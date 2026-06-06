<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StaffController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET /api/staff
    |--------------------------------------------------------------------------
    | Supports: search, department, status, page, per_page
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
            $query->where('status', strtolower(str_replace(' ', '_', $status)));
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

    /*
    |--------------------------------------------------------------------------
    | POST /api/staff
    |--------------------------------------------------------------------------
    */
    public function store(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'role'       => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'email'      => 'nullable|email|max:255|unique:staff,email',
            'phone'      => 'nullable|string|max:20',
            'status'     => 'nullable|string',
            'avatar'     => 'nullable|image|max:2048',
        ], [
            'email.unique' => 'A staff member with this email already exists.',
        ]);

        $count   = Staff::where('school_id', $schoolId)->count();
        $staffId = 'STF-' . date('Y') . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);

        $avatarPath = null;
        if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
            $file = $request->file('avatar');
            $uuid = Str::uuid();
            $ext  = $file->getClientOriginalExtension();
            Storage::disk('public')->putFileAs(
                "schools/{$schoolId}/passports/staff",
                $file,
                "{$uuid}.{$ext}"
            );
            $avatarPath = "schools/{$schoolId}/passports/staff/{$uuid}.{$ext}";
        }

        $statusMap = [
            'Active'   => 'active',
            'On Leave' => 'on_leave',
            'Inactive' => 'inactive',
        ];

        try {
            $staff = Staff::create([
                'staff_id'   => $staffId,
                'first_name' => $request->first_name,
                'last_name'  => $request->last_name,
                'email'      => $request->email,
                'phone'      => $request->phone,
                'role_title' => $request->role,
                'avatar'     => $avatarPath,
                'status'     => $statusMap[$request->status] ?? 'active',
                'school_id'  => $schoolId,
            ]);
        } catch (UniqueConstraintViolationException $e) {
            return response()->json([
                'message' => 'A staff member with this email already exists.',
                'errors'  => ['email' => ['This email is already registered.']],
            ], 422);
        }

        $staff->load('department');

        return response()->json([
            'message' => 'Staff added.',
            'data'    => $this->row($staff),
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | POST /api/staff/{staff}
    | Using POST instead of PUT/PATCH to support multipart file uploads
    |--------------------------------------------------------------------------
    */
    public function update(Request $request, Staff $staff): JsonResponse
    {
        abort_if($staff->school_id !== $request->user()->school_id, 403);

        $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name'  => 'sometimes|string|max:255',
            'role'       => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'email'      => 'nullable|email|max:255|unique:staff,email,' . $staff->id,
            'phone'      => 'nullable|string|max:20',
            'status'     => 'nullable|string',
            'avatar'     => 'nullable|image|max:2048',
        ], [
            'email.unique' => 'This email is already used by another staff member.',
        ]);

        if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
            if ($staff->avatar) Storage::disk('public')->delete($staff->avatar);
            $file     = $request->file('avatar');
            $uuid     = Str::uuid();
            $ext      = $file->getClientOriginalExtension();
            $schoolId = $request->user()->school_id;
            Storage::disk('public')->putFileAs(
                "schools/{$schoolId}/passports/staff",
                $file,
                "{$uuid}.{$ext}"
            );
            $staff->avatar = "schools/{$schoolId}/passports/staff/{$uuid}.{$ext}";
        }

        $statusMap = [
            'Active'   => 'active',
            'On Leave' => 'on_leave',
            'Inactive' => 'inactive',
        ];

        $staff->fill([
            'first_name' => $request->first_name ?? $staff->first_name,
            'last_name'  => $request->last_name  ?? $staff->last_name,
            'email'      => $request->email      ?? $staff->email,
            'phone'      => $request->phone      ?? $staff->phone,
            'role_title' => $request->role       ?? $staff->role_title,
            'status'     => isset($statusMap[$request->status])
                                ? $statusMap[$request->status]
                                : $staff->status,
        ])->save();

        $staff->load('department');

        return response()->json([
            'message' => 'Staff updated.',
            'data'    => $this->row($staff),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE /api/staff/{staff}
    |--------------------------------------------------------------------------
    */
    public function destroy(Request $request, Staff $staff): JsonResponse
    {
        abort_if($staff->school_id !== $request->user()->school_id, 403);
        if ($staff->avatar) Storage::disk('public')->delete($staff->avatar);
        $staff->delete();
        return response()->json(['message' => 'Staff deleted.']);
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    private function row(Staff $s): array
    {
        return [
            'id'         => $s->id,
            'staff_id'   => $s->staff_id,
            'name'       => $s->first_name . ' ' . $s->last_name,
            'first_name' => $s->first_name,
            'last_name'  => $s->last_name,
            'role'       => $s->role_title ?? ucfirst($s->role ?? ''),
            'department' => $s->department?->name ?? ($s->department ?? '—'),
            'email'      => $s->email,
            'phone'      => $s->phone,
            'address'    => $s->address,
            'joinDate'   => $s->hire_date?->format('M d, Y'),
            'status'     => $this->displayStatus($s->status),
            'bank_name'  => $s->bank_name,
            'base_pay'   => $s->base_pay,
            'avatar_url' => $s->avatar ? asset('storage/' . $s->avatar) : null,
        ];
    }

    private function detail(Staff $s): array
    {
        return array_merge($this->row($s), [
            'account_number' => $s->account_number,
        ]);
    }

    private function displayStatus(string $status): string
    {
        return match($status) {
            'on_leave' => 'On Leave',
            'inactive' => 'Inactive',
            default    => 'Active',
        };
    }
}
