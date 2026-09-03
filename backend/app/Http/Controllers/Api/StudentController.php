<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicClass;
use App\Models\ClassSection;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class StudentController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET /api/students
    |--------------------------------------------------------------------------
    */
    public function index(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $perPage  = min((int) $request->query('per_page', 20), 100);

        $query = Student::with('section.academicClass', 'user')
            ->forSchool($schoolId)
            ->orderBy('first_name');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name',    'like', "%{$search}%")
                  ->orWhere('last_name',   'like', "%{$search}%")
                  ->orWhere('student_id',  'like', "%{$search}%")
                  ->orWhere('admission_no','like', "%{$search}%")
                  ->orWhere('email',       'like', "%{$search}%");
            });
        }

        if ($grade = $request->query('grade')) {
            $query->whereHas('section.academicClass', fn($q) => $q->where('name', $grade));
        }

        if ($status = $request->query('status')) {
            $query->where('status', strtolower($status));
        }

        $students = $query->paginate($perPage);

        return response()->json([
            'data'         => $students->map(fn($s) => $this->row($s)),
            'total'        => $students->total(),
            'current_page' => $students->currentPage(),
            'last_page'    => $students->lastPage(),
            'per_page'     => $students->perPage(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/students/{student}
    |--------------------------------------------------------------------------
    */
    public function show(Request $request, Student $student): JsonResponse
    {
        abort_if($student->school_id !== $request->user()->school_id, 403);
        $student->load('section.academicClass', 'user');
        return response()->json(['data' => $this->detail($student)]);
    }

    /*
    |--------------------------------------------------------------------------
    | POST /api/students
    |--------------------------------------------------------------------------
    */
    public function store(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'first_name'        => 'required|string|max:255',
            'last_name'         => 'required|string|max:255',
            'admission_no'      => 'required|string|max:100|unique:students,admission_no',
            'class_section_id'  => 'nullable|integer|exists:class_sections,id',
            'gender'            => 'nullable|in:Male,Female',
            'date_of_birth'     => 'nullable|date',
            'email'             => 'nullable|email|max:255|unique:students,email',
            'phone'             => 'nullable|string|max:20',
            'address'           => 'nullable|string|max:500',
            'parent_name'       => 'nullable|string|max:255',
            'parent_phone'      => 'nullable|string|max:20',
            'parent_email'      => 'nullable|email|max:255',
            'status'            => 'nullable|string',
            'avatar'            => 'nullable|image|max:2048',
            'blood_group'       => 'nullable|string|max:10',
            'genotype'          => 'nullable|string|max:10',
            'allergies'         => 'nullable|string',
            'medical_conditions'=> 'nullable|string',
            'medications'       => 'nullable|string',
            'medical_notes'     => 'nullable|string',
        ], [
            'admission_no.unique' => 'This admission number is already registered.',
            'email.unique'        => 'A student with this email already exists.',
        ]);

        // Generate student ID
        $count     = Student::where('school_id', $schoolId)->withTrashed()->count();
        $prefix    = strtoupper(substr($schoolId, 0, 3));
        $studentId = "{$prefix}-" . date('Y') . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);

        // Handle avatar upload
        $avatarPath = $this->uploadAvatar($request, $schoolId);

        $statusMap = ['Active' => 'active', 'Inactive' => 'inactive'];

        try {
            $student = Student::create([
                'student_id'         => $studentId,
                'admission_no'       => $request->admission_no,
                'first_name'         => $request->first_name,
                'last_name'          => $request->last_name,
                'email'              => $request->email,
                'phone'              => $request->phone,
                'address'            => $request->address,
                'gender'             => $request->gender,
                'date_of_birth'      => $request->date_of_birth,
                'class_section_id'   => $request->class_section_id,
                'parent_name'        => $request->parent_name,
                'parent_phone'       => $request->parent_phone,
                'parent_email'       => $request->parent_email,
                'avatar'             => $avatarPath,
                'blood_group'        => $request->blood_group,
                'genotype'           => $request->genotype,
                'allergies'          => $request->allergies,
                'medical_conditions' => $request->medical_conditions,
                'medications'        => $request->medications,
                'medical_notes'      => $request->medical_notes,
                'status'             => $statusMap[$request->status] ?? 'active',
                'enrollment_date'    => now()->toDateString(),
                'school_id'          => $schoolId,
            ]);
        } catch (UniqueConstraintViolationException $e) {
            return response()->json([
                'message' => 'Admission number or email already exists.',
                'errors'  => ['admission_no' => ['This admission number is already registered.']],
            ], 422);
        }

        $student->load('section.academicClass', 'user');

        return response()->json([
            'message' => 'Student added.',
            'data'    => $this->detail($student),
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | POST /api/students/{student}  (POST for file upload support)
    |--------------------------------------------------------------------------
    */
    public function update(Request $request, Student $student): JsonResponse
    {
        abort_if($student->school_id !== $request->user()->school_id, 403);

        $request->validate([
            'first_name'        => 'sometimes|string|max:255',
            'last_name'         => 'sometimes|string|max:255',
            'admission_no'      => 'sometimes|string|max:100|unique:students,admission_no,' . $student->id,
            'class_section_id'  => 'nullable|integer|exists:class_sections,id',
            'gender'            => 'nullable|in:Male,Female',
            'date_of_birth'     => 'nullable|date',
            'email'             => 'nullable|email|max:255|unique:students,email,' . $student->id,
            'phone'             => 'nullable|string|max:20',
            'address'           => 'nullable|string|max:500',
            'parent_name'       => 'nullable|string|max:255',
            'parent_phone'      => 'nullable|string|max:20',
            'parent_email'      => 'nullable|email|max:255',
            'status'            => 'nullable|string',
            'avatar'            => 'nullable|image|max:2048',
            'blood_group'       => 'nullable|string|max:10',
            'genotype'          => 'nullable|string|max:10',
            'allergies'         => 'nullable|string',
            'medical_conditions'=> 'nullable|string',
            'medications'       => 'nullable|string',
            'medical_notes'     => 'nullable|string',
        ]);

        if ($request->has('email')) {
            $this->assertPortalEmailAvailable($student, trim((string) $request->email));
        }

        // Handle avatar upload
        if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
            if ($student->avatar) Storage::disk('public')->delete($student->avatar);
            $student->avatar = $this->uploadAvatar($request, $request->user()->school_id);
        }

        $statusMap = ['Active' => 'active', 'Inactive' => 'inactive'];

        $student->fill([
            'first_name'         => $request->first_name         ?? $student->first_name,
            'last_name'          => $request->last_name          ?? $student->last_name,
            'admission_no'       => $request->admission_no       ?? $student->admission_no,
            'email'              => $request->email              ?? $student->email,
            'phone'              => $request->phone              ?? $student->phone,
            'address'            => $request->address            ?? $student->address,
            'gender'             => $request->gender             ?? $student->gender,
            'date_of_birth'      => $request->date_of_birth      ?? $student->date_of_birth,
            'class_section_id'   => $request->class_section_id   ?? $student->class_section_id,
            'parent_name'        => $request->parent_name        ?? $student->parent_name,
            'parent_phone'       => $request->parent_phone       ?? $student->parent_phone,
            'parent_email'       => $request->parent_email       ?? $student->parent_email,
            'blood_group'        => $request->blood_group        ?? $student->blood_group,
            'genotype'           => $request->genotype           ?? $student->genotype,
            'allergies'          => $request->allergies          ?? $student->allergies,
            'medical_conditions' => $request->medical_conditions ?? $student->medical_conditions,
            'medications'        => $request->medications        ?? $student->medications,
            'medical_notes'      => $request->medical_notes      ?? $student->medical_notes,
            'status'             => isset($statusMap[$request->status])
                                        ? $statusMap[$request->status]
                                        : $student->status,
        ])->save();

        $this->syncPortalUserFromStudent($student);
        $student->load('section.academicClass', 'user');

        return response()->json([
            'message' => 'Student updated.',
            'data'    => $this->detail($student),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE /api/students/{student}
    |--------------------------------------------------------------------------
    */
    public function destroy(Request $request, Student $student): JsonResponse
    {
        abort_if($student->school_id !== $request->user()->school_id, 403);
        if ($student->avatar) Storage::disk('public')->delete($student->avatar);
        $student->delete();
        return response()->json(['message' => 'Student deleted.']);
    }

    public function generatePortalCredentials(Request $request, Student $student): JsonResponse
    {
        abort_if($student->school_id !== $request->user()->school_id, 403);

        $password = Str::password(10);
        $credentials = $this->upsertStudentPortalAccount($student, $password);
        $student->load('user');

        return response()->json([
            'message' => 'Student portal credentials generated.',
            'data' => [
                'student' => $this->detail($student),
                'portal_credentials' => $credentials,
            ],
        ]);
    }

    public function updatePortalPassword(Request $request, Student $student): JsonResponse
    {
        abort_if($student->school_id !== $request->user()->school_id, 403);

        $payload = $request->validate([
            'password' => 'required|string|min:8|max:255',
        ]);

        $credentials = $this->upsertStudentPortalAccount($student, (string) $payload['password']);
        $student->load('user');

        return response()->json([
            'message' => 'Student portal password updated.',
            'data' => [
                'student' => $this->detail($student),
                'portal_credentials' => $credentials,
            ],
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | POST /api/students/bulk-import
    |--------------------------------------------------------------------------
    | Accepts a CSV file, upserts students by admission_no.
    | Returns counts of created, updated, skipped.
    */
    public function bulkImport(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:5120',
        ]);

        $file    = $request->file('file');
        $text    = file_get_contents($file->getPathname());
        $text    = preg_replace('/^\xEF\xBB\xBF/', '', $text); // strip BOM
        $lines   = array_filter(explode("\n", str_replace(["\r\n", "\r"], "\n", $text)));
        $lines   = array_values($lines);

        if (count($lines) < 2) {
            return response()->json(['message' => 'CSV is empty or has no data rows.'], 422);
        }

        $headers   = array_map('trim', str_getcsv($lines[0]));
        $normalize = fn($h) => strtolower(str_replace([' ', '-'], '_', trim($h)));
        $headerMap = array_flip(array_map($normalize, $headers));

        $get = function (array $row, string $key) use ($headerMap): string {
            $idx = $headerMap[$key] ?? -1;
            return $idx >= 0 ? trim($row[$idx] ?? '') : '';
        };

        // Required columns
        foreach (['first_name', 'last_name', 'admission_no'] as $required) {
            if (!isset($headerMap[$required])) {
                return response()->json([
                    'message' => "CSV must include column: {$required}",
                ], 422);
            }
        }

        $created = 0; $updated = 0; $skipped = 0;
        $errors  = [];

        // Pre-load all sections for fast lookup by full_name
        $sections = ClassSection::where('school_id', $schoolId)
            ->get()
            ->keyBy(fn($s) => strtolower($s->full_name));

        for ($i = 1; $i < count($lines); $i++) {
            $row = str_getcsv($lines[$i]);

            $firstName   = $get($row, 'first_name');
            $lastName    = $get($row, 'last_name');
            $admissionNo = $get($row, 'admission_no');

            if (!$firstName || !$lastName || !$admissionNo) {
                $skipped++;
                continue;
            }

            // Resolve class_section_id from "grade / section" or "class" column
            $classSectionId = null;
            $classValue     = $get($row, 'grade') ?: $get($row, 'class');
            $sectionValue   = $get($row, 'section');
            $fullName       = trim("{$classValue} {$sectionValue}");

            if ($fullName) {
                $classSectionId = $sections[strtolower($fullName)]?->id
                    ?? $sections[strtolower($classValue)]?->id;
            }

            $statusMap = ['active' => 'active', 'inactive' => 'inactive'];
            $rawStatus = strtolower($get($row, 'status'));
            $status    = $statusMap[$rawStatus] ?? 'active';

            $data = [
                'first_name'         => $firstName,
                'last_name'          => $lastName,
                'email'              => $get($row, 'email') ?: null,
                'phone'              => $get($row, 'phone') ?: null,
                'address'            => $get($row, 'address') ?: null,
                'parent_name'        => $get($row, 'parent') ?: $get($row, 'parent_name') ?: null,
                'parent_phone'       => $get($row, 'parent_phone') ?: null,
                'parent_email'       => $get($row, 'parent_email') ?: null,
                'class_section_id'   => $classSectionId,
                'blood_group'        => $get($row, 'blood_group') ?: null,
                'genotype'           => $get($row, 'genotype') ?: null,
                'allergies'          => $get($row, 'allergies') ?: null,
                'medical_conditions' => $get($row, 'medical_conditions') ?: null,
                'medications'        => $get($row, 'medications') ?: null,
                'medical_notes'      => $get($row, 'medical_notes') ?: null,
                'status'             => $status,
                'school_id'          => $schoolId,
            ];

            $existing = Student::where('admission_no', $admissionNo)
                ->where('school_id', $schoolId)
                ->first();

            if ($existing) {
                $existing->fill($data)->save();
                $updated++;
            } else {
                $count     = Student::where('school_id', $schoolId)->withTrashed()->count() + $created;
                $prefix    = strtoupper(substr($schoolId, 0, 3));
                $studentId = "{$prefix}-" . date('Y') . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);

                try {
                    Student::create(array_merge($data, [
                        'student_id'      => $studentId,
                        'admission_no'    => $admissionNo,
                        'enrollment_date' => now()->toDateString(),
                    ]));
                    $created++;
                } catch (\Exception $e) {
                    $errors[] = "Row {$i}: " . $e->getMessage();
                    $skipped++;
                }
            }
        }

        return response()->json([
            'message' => "Import complete: {$created} added, {$updated} updated, {$skipped} skipped.",
            'created' => $created,
            'updated' => $updated,
            'skipped' => $skipped,
            'errors'  => $errors,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/academics/classes  (reused from AcademicsController)
    | Supplementary: GET /api/students/class-sections
    |--------------------------------------------------------------------------
    | Returns classes + sections for the grade/section dropdowns in the form
    */
    public function classSections(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;

        $sections = ClassSection::with('academicClass')
            ->where('school_id', $schoolId)
            ->get()
            ->map(fn($s) => [
                'id'         => $s->id,
                'name'       => $s->name,
                'full_name'  => $s->full_name,
                'class_name' => $s->academicClass?->name ?? '—',
            ]);

        return response()->json($sections);
    }

    /*
    |--------------------------------------------------------------------------
    | POST /api/students/class-sections
    |--------------------------------------------------------------------------
    | Creates a class (if needed) and a section under it for the current school.
    */
    public function storeClassSection(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'class_name'   => 'required|string|max:255',
            'name'         => 'nullable|string|max:100',
            'section_name' => 'nullable|string|max:100',
            'capacity'     => 'nullable|integer|min:0',
        ]);

        $className = trim((string) $request->input('class_name'));
        $sectionName = trim((string) ($request->input('name') ?: $request->input('section_name')));

        if ($sectionName === '') {
            return response()->json([
                'message' => 'A section name is required.',
                'errors'  => ['name' => ['A section name is required.']],
            ], 422);
        }

        $class = AcademicClass::firstOrCreate(
            ['school_id' => $schoolId, 'name' => $className],
            [
                'level'    => $className,
                'order'    => ((int) AcademicClass::where('school_id', $schoolId)->max('order')) + 1,
                'school_id'=> $schoolId,
            ]
        );

        $section = ClassSection::firstOrCreate(
            [
                'school_id' => $schoolId,
                'class_id'  => $class->id,
                'name'      => $sectionName,
            ],
            [
                'full_name' => trim($className . ' ' . $sectionName),
                'capacity'  => $request->input('capacity'),
                'school_id' => $schoolId,
            ]
        );

        $section->load('academicClass');

        return response()->json([
            'message' => $section->wasRecentlyCreated ? 'Class section created.' : 'Class section already exists.',
            'data'    => [
                'id'         => $section->id,
                'name'       => $section->name,
                'full_name'  => $section->full_name,
                'class_name' => $section->academicClass?->name ?? $className,
            ],
        ], $section->wasRecentlyCreated ? 201 : 200);
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE /api/students/class-sections
    |--------------------------------------------------------------------------
    | Removes a class section. If the class has no more sections afterwards,
    | the class record is removed too.
    */
    public function destroyClassSection(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'id'               => 'nullable|integer',
            'class_section_id' => 'nullable|integer',
        ]);

        $sectionId = (int) ($request->input('id') ?: $request->input('class_section_id'));

        if ($sectionId <= 0) {
            return response()->json([
                'message' => 'A class section id is required.',
                'errors'  => ['id' => ['A class section id is required.']],
            ], 422);
        }

        $section = ClassSection::where('school_id', $schoolId)->findOrFail($sectionId);
        $classId = $section->class_id;

        $section->delete();

        if ($classId) {
            $hasSections = ClassSection::where('school_id', $schoolId)
                ->where('class_id', $classId)
                ->exists();

            if (!$hasSections) {
                AcademicClass::where('school_id', $schoolId)
                    ->where('id', $classId)
                    ->delete();
            }
        }

        return response()->json(['message' => 'Class section removed.']);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function row(Student $s): array
    {
        $classSection = $s->relationLoaded('section')
            ? $s->getRelation('section')
            : $s->section()->with('academicClass')->first();

        return [
            'id'           => $s->student_id,
            'db_id'        => $s->id,
            'name'         => $s->first_name . ' ' . $s->last_name,
            'first_name'   => $s->first_name,
            'last_name'    => $s->last_name,
            'admission_no' => $s->admission_no,
            'grade'        => $classSection?->academicClass?->name ?? $s->grade ?? '—',
            'section'      => $classSection?->name ?? $s->section ?? '—',
            'section_id'   => $s->class_section_id,
            'parent'       => $s->parent_name ?? '—',
            'status'       => ucfirst($s->status),
            'email'        => $s->email,
            'phone'        => $s->phone,
            'avatar_url'   => $s->avatar ? asset('storage/' . $s->avatar) : null,
            'has_portal_account' => (bool) $s->user_id,
            'portal_email' => $s->email,
        ];
    }

    private function detail(Student $s): array
    {
        return array_merge($this->row($s), [
            'gender'             => $s->gender,
            'date_of_birth'      => $s->date_of_birth?->format('M d, Y'),
            'address'            => $s->address,
            'parent_phone'       => $s->parent_phone,
            'parent_email'       => $s->parent_email,
            'enrollment_date'    => $s->enrollment_date?->format('M d, Y'),
            'blood_group'        => $s->blood_group,
            'genotype'           => $s->genotype,
            'allergies'          => $s->allergies,
            'medical_conditions' => $s->medical_conditions,
            'medications'        => $s->medications,
            'medical_notes'      => $s->medical_notes,
        ]);
    }

    private function uploadAvatar(Request $request, string $schoolId): ?string
    {
        if (!$request->hasFile('avatar') || !$request->file('avatar')->isValid()) {
            return null;
        }
        $file = $request->file('avatar');
        $uuid = Str::uuid();
        $ext  = $file->getClientOriginalExtension();
        Storage::disk('public')->putFileAs(
            "schools/{$schoolId}/passports/students",
            $file,
            "{$uuid}.{$ext}"
        );
        return "schools/{$schoolId}/passports/students/{$uuid}.{$ext}";
    }

    private function syncPortalUserFromStudent(Student $student): void
    {
        if (!$student->user_id) {
            return;
        }

        $user = $student->relationLoaded('user') ? $student->getRelation('user') : $student->user;
        if (!$user) {
            return;
        }

        $studentName = trim($student->first_name . ' ' . $student->last_name);
        $nextEmail = trim((string) $student->email);

        if ($nextEmail !== '' && $nextEmail !== $user->email) {
            $this->assertPortalEmailAvailable($student, $nextEmail, $user->id);
            $user->email = $nextEmail;
        }

        $user->name = $studentName;
        $user->save();
    }

    private function upsertStudentPortalAccount(Student $student, string $plainPassword): array
    {
        $email = trim((string) $student->email);
        if ($email === '') {
            throw ValidationException::withMessages([
                'email' => 'Student email is required before generating portal credentials.',
            ]);
        }

        $studentName = trim($student->first_name . ' ' . $student->last_name);
        $user = $student->user_id
            ? User::find($student->user_id)
            : User::where('email', $email)->first();

        if ($user && $user->role !== 'student') {
            throw ValidationException::withMessages([
                'email' => 'This email is already used by another non-student account.',
            ]);
        }

        if ($user && (string) $user->school_id !== (string) $student->school_id) {
            throw ValidationException::withMessages([
                'email' => 'This email is already linked to another school account.',
            ]);
        }

        if ($user && Student::where('user_id', $user->id)->where('id', '!=', $student->id)->exists()) {
            throw ValidationException::withMessages([
                'email' => 'This email is already linked to another student portal account.',
            ]);
        }

        if (!$user) {
            $user = User::create([
                'name' => $studentName,
                'email' => $email,
                'password' => $plainPassword,
                'role' => 'student',
                'school_id' => $student->school_id,
                'is_active' => true,
            ]);
        } else {
            $user->update([
                'name' => $studentName,
                'email' => $email,
                'password' => $plainPassword,
                'role' => 'student',
                'school_id' => $student->school_id,
                'is_active' => true,
            ]);
        }

        if ((int) $student->user_id !== (int) $user->id) {
            $student->user_id = $user->id;
            $student->save();
        }

        return [
            'email' => $email,
            'password' => $plainPassword,
        ];
    }

    private function assertPortalEmailAvailable(Student $student, string $email, ?int $ignoreUserId = null): void
    {
        if ($email === '') {
            return;
        }

        $query = User::where('email', $email);
        if ($ignoreUserId) {
            $query->where('id', '!=', $ignoreUserId);
        }

        if ($query->exists()) {
            throw ValidationException::withMessages([
                'email' => 'This email is already used by another portal account.',
            ]);
        }
    }
}
