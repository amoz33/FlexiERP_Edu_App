<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdmissionApplication;
use App\Models\Student;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdmissionController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET /api/admissions
    |--------------------------------------------------------------------------
    | Supports: status, date_from, date_to, program, search, page, per_page
    */
    public function index(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $perPage  = min((int) $request->query('per_page', 10), 100);

        $query = AdmissionApplication::where('school_id', $schoolId)
            ->orderByDesc('date_applied');

        // Tab filter
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

        // Program / level
        if ($program = $request->query('program')) {
            $query->where('program', 'like', "%{$program}%");
        }

        // Search
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name',      'like', "%{$search}%")
                  ->orWhere('last_name',     'like', "%{$search}%")
                  ->orWhere('application_no','like', "%{$search}%")
                  ->orWhere('email',         'like', "%{$search}%")
                  ->orWhere('phone',         'like', "%{$search}%");
            });
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
    | Public-facing application submission (no auth required — see routes).
    | Accepts multipart/form-data for document uploads.
    */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'first_name'             => 'required|string|max:255',
            'last_name'              => 'required|string|max:255',
            'date_of_birth'          => 'nullable|date',
            'gender'                 => 'nullable|in:Male,Female,Other',
            'state_of_origin'        => 'nullable|string|max:100',
            'lga'                    => 'nullable|string|max:100',
            'address'                => 'nullable|string|max:500',
            'program'                => 'required|string|max:255',
            'level'                  => 'nullable|string|max:100',
            'previous_school'        => 'nullable|string|max:255',
            'guardian_name'          => 'nullable|string|max:255',
            'guardian_relationship'  => 'nullable|string|max:100',
            'guardian_phone'         => 'nullable|string|max:20',
            'guardian_email'         => 'nullable|email|max:255',
            'guardian_occupation'    => 'nullable|string|max:255',
            'email'                  => 'nullable|email|max:255',
            'phone'                  => 'nullable|string|max:20',
            'notes'                  => 'nullable|string|max:2000',
            'school_id'              => 'required|string',   // passed from form
            'documents.*'            => 'nullable|file|max:5120|mimes:pdf,jpg,jpeg,png,doc,docx',
        ]);

        $schoolId = $request->input('school_id');

        // Generate sequential application number
        $count = AdmissionApplication::where('school_id', $schoolId)->count();
        $year  = date('Y');
        $appNo = 'APP-' . $year . '-' . str_pad($count + 1, 4, '0', STR_PAD_LEFT);

        // Handle document uploads — school-scoped storage
        $documentPaths = [];
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $file) {
                if (!$file->isValid()) continue;
                $ext  = $file->getClientOriginalExtension();
                $uuid = Str::uuid();
                $path = "schools/{$schoolId}/admissions/{$appNo}/{$uuid}.{$ext}";
                Storage::disk('public')->putFileAs(
                    "schools/{$schoolId}/admissions/{$appNo}",
                    $file,
                    "{$uuid}.{$ext}"
                );
                $documentPaths[] = [
                    'name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'url'  => asset('storage/' . $path),
                    'size' => $this->humanSize($file->getSize()),
                ];
            }
        }

        $application = AdmissionApplication::create([
            'application_no'        => $appNo,
            'first_name'            => $request->first_name,
            'last_name'             => $request->last_name,
            'email'                 => $request->email,
            'phone'                 => $request->phone,
            'date_of_birth'         => $request->date_of_birth,
            'gender'                => $request->gender,
            'state_of_origin'       => $request->state_of_origin,
            'lga'                   => $request->lga,
            'address'               => $request->address,
            'program'               => $request->program,
            'level'                 => $request->level,
            'previous_school'       => $request->previous_school,
            'guardian_name'         => $request->guardian_name,
            'guardian_relationship' => $request->guardian_relationship,
            'guardian_phone'        => $request->guardian_phone,
            'guardian_email'        => $request->guardian_email,
            'guardian_occupation'   => $request->guardian_occupation,
            'notes'                 => $request->notes,
            'documents'             => $documentPaths ?: null,
            'date_applied'          => now()->toDateString(),
            'status'                => 'pending',
            'school_id'             => $schoolId,
        ]);

        return response()->json([
            'message'        => 'Application submitted successfully.',
            'application_no' => $appNo,
            'data'           => $this->row($application),
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/admissions/{application}
    |--------------------------------------------------------------------------
    | Full detail view of a single application
    */
    public function show(Request $request, AdmissionApplication $application): JsonResponse
    {
        abort_if($application->school_id !== $request->user()->school_id, 403);

        return response()->json($this->row($application, full: true));
    }

    /*
    |--------------------------------------------------------------------------
    | PATCH /api/admissions/{application}/status
    |--------------------------------------------------------------------------
    | Admin updates status: pending → under_evaluation → admitted | rejected
    | When status becomes 'admitted', the record is ALSO promoted to students table.
    */
    public function updateStatus(Request $request, AdmissionApplication $application): JsonResponse
    {
        abort_if($application->school_id !== $request->user()->school_id, 403);

        $request->validate([
            'status' => 'required|in:pending,under_evaluation,admitted,rejected',
            'notes'  => 'nullable|string|max:2000',
        ]);

        $newStatus = $request->status;
        $now       = now();

        $updates = [
            'status'      => $newStatus,
            'reviewed_by' => $request->user()->name,
            'reviewed_at' => $now,
        ];

        if ($request->filled('notes')) {
            $updates['notes'] = $request->notes;
        }

        if ($newStatus === 'admitted') {
            $updates['admitted_at'] = $now;
        }

        $application->update($updates);

        // ── Promote to students table when admitted ────────────────────────
        $student = null;
        if ($newStatus === 'admitted' && !$application->student_id) {
            $student = $this->promoteToStudent($application, $request->user()->school_id);
            $application->update(['student_id' => $student->id]);
        }

        return response()->json([
            'message' => "Application status updated to {$newStatus}.",
            'data'    => $this->row($application->fresh(), full: true),
            'student' => $student ? [
                'student_id'   => $student->student_id,
                'name'         => $student->first_name . ' ' . $student->last_name,
                'admission_no' => $student->admission_no,
            ] : null,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE /api/admissions/{application}
    |--------------------------------------------------------------------------
    | Admin deletes an application (soft delete via status = rejected)
    */
    public function destroy(Request $request, AdmissionApplication $application): JsonResponse
    {
        abort_if($application->school_id !== $request->user()->school_id, 403);
        $application->delete();

        return response()->json(['message' => 'Application deleted.']);
    }

    /*
    |--------------------------------------------------------------------------
    | Internal: promote admitted applicant to students table
    |--------------------------------------------------------------------------
    */
    private function promoteToStudent(AdmissionApplication $app, string $schoolId): Student
    {
        return DB::transaction(function () use ($app, $schoolId) {
            // Generate student ID
            $count     = Student::where('school_id', $schoolId)->withTrashed()->count();
            $year      = date('Y');
            $prefix    = strtoupper(substr($schoolId, 0, 3)); // e.g. SCH → SCH
            $studentId = "{$prefix}-{$year}-" . str_pad($count + 1, 3, '0', STR_PAD_LEFT);

            // Create student record — partial info, admin can fill the rest later
            $student = Student::create([
                'student_id'     => $studentId,
                'admission_no'   => $app->application_no,
                'first_name'     => $app->first_name,
                'last_name'      => $app->last_name,
                'email'          => $app->email,
                'phone'          => $app->phone,
                'date_of_birth'  => $app->date_of_birth,
                'gender'         => $app->gender,
                'address'        => $app->address,
                'parent_name'    => $app->guardian_name,
                'parent_phone'   => $app->guardian_phone,
                'parent_email'   => $app->guardian_email,
                'enrollment_date'=> now()->toDateString(),
                'status'         => 'active',
                'school_id'      => $schoolId,
                // class_section_id left null — admin assigns class later
            ]);

            return $student;
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Internal: format a row for API response
    |--------------------------------------------------------------------------
    */
    private function row(AdmissionApplication $a, bool $full = false): array
    {
        $statusLabels = [
            'pending'          => 'Pending Review',
            'under_evaluation' => 'Under Evaluation',
            'admitted'         => 'Admitted',
            'rejected'         => 'Rejected',
        ];

        $base = [
            'id'              => $a->application_no,
            'db_id'           => $a->id,
            'student_name'    => $a->first_name . ' ' . $a->last_name,
            'first_name'      => $a->first_name,
            'last_name'       => $a->last_name,
            'email'           => $a->email,
            'phone'           => $a->phone,
            'program'         => $a->program,
            'level'           => $a->level,
            'date_applied'    => $a->date_applied?->format('M d, Y'),
            'date_applied_raw'=> $a->date_applied?->toDateString(),
            'status'          => $a->status,                          // raw enum for logic
            'status_label'    => $statusLabels[$a->status] ?? ucfirst($a->status),
            'reviewed_by'     => $a->reviewed_by,
            'admitted_at'     => $a->admitted_at?->format('M d, Y'),
            'student_id'      => $a->student_id,  // FK to students.id (null until admitted)
        ];

        if ($full) {
            $base = array_merge($base, [
                'date_of_birth'         => $a->date_of_birth?->format('M d, Y'),
                'gender'                => $a->gender,
                'state_of_origin'       => $a->state_of_origin,
                'lga'                   => $a->lga,
                'address'               => $a->address,
                'previous_school'       => $a->previous_school,
                'guardian_name'         => $a->guardian_name,
                'guardian_relationship' => $a->guardian_relationship,
                'guardian_phone'        => $a->guardian_phone,
                'guardian_email'        => $a->guardian_email,
                'guardian_occupation'   => $a->guardian_occupation,
                'notes'                 => $a->notes,
                'documents'             => $a->documents ?? [],
            ]);
        }

        return $base;
    }

    private function humanSize(int $bytes): string
    {
        if ($bytes < 1024)    return $bytes . ' B';
        if ($bytes < 1048576) return round($bytes / 1024, 1) . ' KB';
        return round($bytes / 1048576, 1) . ' MB';
    }
}
