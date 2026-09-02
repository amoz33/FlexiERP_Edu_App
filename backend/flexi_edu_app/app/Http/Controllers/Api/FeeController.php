<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\AcademicTerm;
use App\Models\FeePayment;
use App\Models\FeeType;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeeController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET /api/fees/dashboard
    |--------------------------------------------------------------------------
    | Returns fee stats, fee types and recent transactions
    | Frontend: feeApi.getDashboard()
    */
    public function dashboard(Request $request): JsonResponse
    {
        $schoolId    = $request->user()->school_id;
        $currentTerm = $this->resolveFeeTerm($request, $schoolId);

        // ── Stats ────────────────────────────────────────────────────────────
        $termPayments = FeePayment::where('school_id', $schoolId)
            ->where('academic_term', $currentTerm)
            ->get();

        $totalCollected   = $termPayments->where('status', 'paid')->sum('amount');
        $pendingClearance = $termPayments->where('status', 'partial')->sum('expected_amount');
        $pendingInvoices  = $termPayments->where('status', 'pending')->count();
        $overdueFees      = $termPayments->where('status', 'overdue')->sum('expected_amount');

        // Compare with previous term
        $prevTerm        = $this->previousFeeTerm($schoolId, $currentTerm);
        $prevCollected   = FeePayment::where('school_id', $schoolId)
            ->where('academic_term', $prevTerm)
            ->where('status', 'paid')
            ->sum('amount');

        $changePct = $prevCollected > 0
            ? round((($totalCollected - $prevCollected) / $prevCollected) * 100, 1)
            : 0;
        $totalChange = ($changePct >= 0 ? '+' : '') . $changePct . '% from last term';

        // ── Fee Types ────────────────────────────────────────────────────────
        $feeTypes = FeeType::where('school_id', $schoolId)
            ->where('academic_term', $currentTerm)
            ->orderBy('name')
            ->get()
            ->map(fn($f) => $this->mapFeeType($f));

        // ── Recent Transactions ──────────────────────────────────────────────
        $transactions = FeePayment::with('student')
            ->where('school_id', $schoolId)
            ->whereNotNull('paid_at')
            ->orderByDesc('paid_at')
            ->limit(8)
            ->get()
            ->map(fn($p) => [
                'id'      => $p->id,
                'student' => $p->student?->first_name . ' ' . $p->student?->last_name,
                'amount'  => $p->amount,
                'method'  => ucfirst(str_replace('_', ' ', $p->payment_method ?? 'cash')),
                'desc'    => ($p->description ?? 'Fee Payment') . ' - ID #' . $p->student?->student_id,
                'time'    => $this->humanTime($p->paid_at),
                'color'   => $p->payment_method === 'card' ? '#C9A020' : '#6B6660',
            ]);

        return response()->json([
            'term'              => $currentTerm,
            'total_collected'   => $totalCollected,
            'total_change'      => $totalChange,
            'pending_clearance' => $pendingClearance,
            'pending_invoices'  => $pendingInvoices,
            'overdue_fees'      => $overdueFees,
            'fee_types'         => $feeTypes,
            'recent_transactions' => $transactions,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $payload = $this->validateFeeType($request);

        $feeType = FeeType::create([
            'name'             => $payload['name'],
            'applicable_class' => $payload['grade'],
            'amount'           => $payload['amount'],
            'status'           => $this->normalizeFeeStatus($payload['status']),
            'academic_term'    => $this->resolveFeeTerm($request, $schoolId),
            'school_id'        => $schoolId,
        ]);

        return response()->json([
            'message' => 'Fee item created.',
            'data'    => $this->mapFeeType($feeType),
        ], 201);
    }

    public function update(Request $request, FeeType $feeType): JsonResponse
    {
        abort_if($feeType->school_id !== $request->user()->school_id, 403);

        $payload = $this->validateFeeType($request);

        $feeType->update([
            'name'             => $payload['name'],
            'applicable_class' => $payload['grade'],
            'amount'           => $payload['amount'],
            'status'           => $this->normalizeFeeStatus($payload['status']),
        ]);

        return response()->json([
            'message' => 'Fee item updated.',
            'data'    => $this->mapFeeType($feeType->fresh()),
        ]);
    }

    public function destroy(Request $request, FeeType $feeType): JsonResponse
    {
        abort_if($feeType->school_id !== $request->user()->school_id, 403);

        $feeType->delete();

        return response()->json([
            'message' => 'Fee item deleted.',
        ]);
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private function validateFeeType(Request $request): array
    {
        return $request->validate([
            'name'   => 'required|string|max:255',
            'grade'  => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'status' => 'required|string|max:20',
        ]);
    }

    private function normalizeFeeStatus(?string $status): string
    {
        return match (strtolower(trim((string) $status))) {
            'pending' => 'pending',
            'overdue' => 'overdue',
            default   => 'active',
        };
    }

    private function mapFeeType(FeeType $feeType): array
    {
        return [
            'id'     => $feeType->id,
            'name'   => $feeType->name,
            'grade'  => $feeType->applicable_class,
            'amount' => (float) $feeType->amount,
            'status' => ucfirst((string) $feeType->status),
        ];
    }

    private function resolveFeeTerm(Request $request, string $schoolId): string
    {
        $termId = trim((string) ($request->query('term_id', $request->input('term_id', ''))));
        if ($termId !== '') {
            $term = AcademicTerm::where('school_id', $schoolId)->find($termId);
            if ($term) {
                return (string) $term->id;
            }
        }

        $activeTerm = AcademicTerm::where('school_id', $schoolId)
            ->where(function ($query) {
                $query->where('is_active', true)
                    ->orWhere('status', 'Active');
            })
            ->orderByDesc('is_active')
            ->orderByDesc('academic_year')
            ->orderBy('name')
            ->first();

        if ($activeTerm) {
            return (string) $activeTerm->id;
        }

        return $this->currentTerm();
    }

    private function previousFeeTerm(string $schoolId, string $currentTerm): string
    {
        $terms = AcademicTerm::where('school_id', $schoolId)
            ->orderByRaw("CASE WHEN is_active = 1 THEN 0 ELSE 1 END")
            ->orderByDesc('academic_year')
            ->orderBy('name')
            ->get(['id']);

        $currentIndex = $terms->search(fn (AcademicTerm $term) => (string) $term->id === $currentTerm);
        if ($currentIndex !== false) {
            $previous = $terms->get($currentIndex + 1);
            if ($previous) {
                return (string) $previous->id;
            }
        }

        return $this->previousTerm();
    }

    private function currentTerm(): string
    {
        $month = now()->month;
        $year  = now()->year;
        $term  = match(true) {
            $month <= 4  => 'Term 2',
            $month <= 8  => 'Term 3',
            default      => 'Term 1',
        };
        return "{$year}/{$term}";
    }

    private function previousTerm(): string
    {
        $month = now()->month;
        $year  = now()->year;
        if ($month <= 4) return ($year - 1) . '/Term 1';
        if ($month <= 8) return "{$year}/Term 2";
        return "{$year}/Term 3";
    }

    private function humanTime(Carbon $date): string
    {
        $mins = $date->diffInMinutes(now());
        if ($mins < 60) return $mins . ' mins ago';
        $hours = $date->diffInHours(now());
        if ($hours < 24) return $hours . 'h ago';
        if ($date->isToday()) return 'Today, ' . $date->format('h:i A');
        if ($date->isYesterday()) return 'Yesterday, ' . $date->format('h:i A');
        return $date->format('M d, h:i A');
    }
}
