<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdmissionApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdmissionController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET /api/admissions
    |--------------------------------------------------------------------------
    | Supports: status, date_from, date_to, program, page, per_page
    | Frontend: admissionApi.list({ status, date_from, date_to, program, page, per_page })
    */
    public function index(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $perPage  = min((int) $request->query('per_page', 10), 100);

        $query = AdmissionApplication::where('school_id', $schoolId)
            ->orderByDesc('date_applied');

        // Filter by status tab
        // Frontend sends: '' (all), 'shortlisted', 'enrolled'
        if ($status = $request->query('status')) {
            $map = [
                'shortlisted' => 'under_evaluation',
                'enrolled'    => 'admitted',
            ];
            $query->where('status', $map[$status] ?? $status);
        }

        // Date range
        if ($from = $request->query('date_from')) {
            $query->whereDate('date_applied', '>=', $from);
        }
        if ($to = $request->query('date_to')) {
            $query->whereDate('date_applied', '<=', $to);
        }

        // Program (class applying for)
        if ($program = $request->query('program')) {
            $query->where('program', 'like', "%{$program}%");
        }

        $results = $query->paginate($perPage);

        return response()->json([
            'data'         => $results->map(fn($a) => $this->row($a)),
            'total'        => $results->total(),
            'current_page' => $results->currentPage(),
            'last_page'    => $results->lastPage(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | POST /api/admissions
    |--------------------------------------------------------------------------
    */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'first_name'   => 'required|string|max:255',
            'last_name'    => 'required|string|max:255',
            'program'      => 'required|string|max:255',
            'date_applied' => 'required|date',
            'email'        => 'nullable|email|max:255',
            'phone'        => 'nullable|string|max:20',
        ]);

        $schoolId = $request->user()->school_id;

        // Generate application number
        $count = AdmissionApplication::where('school_id', $schoolId)->count();
        $appNo = 'APP-' . date('Y') . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);

        $application = AdmissionApplication::create([
            'application_no' => $appNo,
            'first_name'     => $request->first_name,
            'last_name'      => $request->last_name,
            'email'          => $request->email,
            'phone'          => $request->phone,
            'program'        => $request->program,
            'date_applied'   => $request->date_applied,
            'status'         => 'pending',
            'school_id'      => $schoolId,
        ]);

        return response()->json(['data' => $this->row($application)], 201);
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private function row(AdmissionApplication $a): array
    {
        $statusMap = [
            'pending'          => 'Pending Review',
            'under_evaluation' => 'Under Evaluation',
            'admitted'         => 'Approved',
            'rejected'         => 'Rejected',
        ];

        return [
            'id'           => $a->application_no,
            'student_name' => $a->first_name . ' ' . $a->last_name,
            'program'      => $a->program,
            'date_applied' => $a->date_applied?->format('M d, Y'),
            'status'       => $statusMap[$a->status] ?? ucfirst($a->status),
            'email'        => $a->email,
            'phone'        => $a->phone,
        ];
    }
}
