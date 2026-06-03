<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
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
        $currentTerm = $this->currentTerm();

        // ── Stats ────────────────────────────────────────────────────────────
        $termPayments = FeePayment::where('school_id', $schoolId)
            ->where('academic_term', $currentTerm)
            ->get();

        $totalCollected   = $termPayments->where('status', 'paid')->sum('amount');
        $pendingClearance = $termPayments->where('status', 'partial')->sum('expected_amount');
        $pendingInvoices  = $termPayments->where('status', 'pending')->count();
        $overdueFees      = $termPayments->where('status', 'overdue')->sum('expected_amount');

        // Compare with previous term
        $prevTerm        = $this->previousTerm();
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
            ->map(fn($f) => [
                'id'     => $f->id,
                'name'   => $f->name,
                'grade'  => $f->applicable_class,
                'amount' => $f->amount,
                'status' => ucfirst($f->status),
            ]);

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
            'total_collected'   => $totalCollected,
            'total_change'      => $totalChange,
            'pending_clearance' => $pendingClearance,
            'pending_invoices'  => $pendingInvoices,
            'overdue_fees'      => $overdueFees,
            'fee_types'         => $feeTypes,
            'recent_transactions' => $transactions,
        ]);
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

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
