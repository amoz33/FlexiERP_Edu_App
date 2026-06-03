<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET /api/staff
    |--------------------------------------------------------------------------
    | Supports: search, department, status, page, per_page
    | Frontend: staffApi.list({ page, search, department, per_page })
    */
    public function index(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $perPage  = min((int) $request->query('per_page', 20), 100);

        $query = Staff::with('department')
            ->forSchool($schoolId)
            ->orderBy('first_name');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name',  'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email',     'like', "%{$search}%")
                  ->orWhere('staff_id',  'like', "%{$search}%");
            });
        }

        if ($dept = $request->query('department')) {
            $query->whereHas('department', fn($q) => $q->where('name', $dept));
        }

        if ($status = $request->query('status')) {
            $query->where('status', strtolower($status));
        }

        $staff = $query->paginate($perPage);

        return response()->json([
            'data'         => $staff->map(fn($s) => $this->row($s)),
            'total'        => $staff->total(),
            'current_page' => $staff->currentPage(),
            'last_page'    => $staff->lastPage(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/staff/{staff}
    |--------------------------------------------------------------------------
    */
    public function show(Request $request, Staff $staff): JsonResponse
    {
        abort_if($staff->school_id !== $request->user()->school_id, 403);
        $staff->load('department');

        return response()->json(['data' => $this->detail($staff)]);
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private function row(Staff $s): array
    {
        return [
            'id'         => $s->id,
            'staff_id'   => $s->staff_id,
            'name'       => $s->first_name . ' ' . $s->last_name,
            'role'       => $s->role_title ?? ucfirst($s->role),
            'department' => $s->department?->name ?? '—',
            'email'      => $s->email,
            'phone'      => $s->phone,
            'address'    => $s->address,
            'joinDate'   => $s->hire_date?->format('M d, Y'),
            'status'     => ucfirst($s->status),
            'bank_name'  => $s->bank_name,
            'base_pay'   => $s->base_pay,
        ];
    }

    private function detail(Staff $s): array
    {
        return [
            ...$this->row($s),
            'account_number' => $s->account_number,
        ];
    }
}
