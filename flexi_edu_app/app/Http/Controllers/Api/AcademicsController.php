<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicClass;
use App\Models\ClassSection;
use App\Models\Staff;
use App\Models\StaffSubjectAssignment;
use App\Models\Subject;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AcademicsController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET /api/academics/classes
    |--------------------------------------------------------------------------
    */
    public function getClasses(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;

        $classes = AcademicClass::where('school_id', $schoolId)
            ->orderBy('order')
            ->with(['sections' => fn($q) => $q->where('school_id', $schoolId)->orderBy('name')])
            ->get()
            ->map(fn($cls) => [
                'id'       => (string) $cls->id,
                'name'     => $cls->name,
                'level'    => $cls->level,
                'sections' => $cls->sections->map(fn($sec) => [
                    'id'        => (string) $sec->id,
                    'name'      => $sec->name,
                    'full_name' => $sec->full_name,
                ]),
            ]);

        return response()->json($classes);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/academics/subjects?section_id=9
    |--------------------------------------------------------------------------
    | Returns all subjects assigned to a class section with teacher info.
    */
    public function getSubjects(Request $request): JsonResponse
    {
        $schoolId  = $request->user()->school_id;
        $sectionId = $request->query('section_id');

        if (!$sectionId) {
            return response()->json([]);
        }

        $assignments = StaffSubjectAssignment::with(['subject', 'staff'])
            ->where('school_id', $schoolId)
            ->where('class_section_id', $sectionId)
            ->get()
            ->map(fn($a) => [
                'assignment_id' => $a->id,
                'id'            => (string) $a->subject->id,
                'code'          => $a->subject->code,
                'name'          => $a->subject->name,
                'type'          => $a->subject->type,
                'teacher'       => $a->staff
                    ? ($a->staff->first_name . ' ' . $a->staff->last_name)
                    : '—',
                'teacher_id'    => $a->staff_id,
                'max_marks'     => $a->subject->max_theory_marks . ' (Theory) / '
                                 . $a->subject->max_practical_marks . ' (Practical)',
                'max_theory'    => $a->subject->max_theory_marks,
                'max_practical' => $a->subject->max_practical_marks,
                'academic_term' => $a->academic_term,
            ]);

        return response()->json($assignments);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/academics/all-subjects
    |--------------------------------------------------------------------------
    | Returns ALL subjects for the school (for the "add subject to section" modal).
    */
    public function allSubjects(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;

        $subjects = Subject::where('school_id', $schoolId)
            ->orderBy('name')
            ->get()
            ->map(fn($s) => [
                'id'            => $s->id,
                'code'          => $s->code,
                'name'          => $s->name,
                'type'          => $s->type,
                'max_theory'    => $s->max_theory_marks,
                'max_practical' => $s->max_practical_marks,
            ]);

        return response()->json($subjects);
    }

    /*
    |--------------------------------------------------------------------------
    | POST /api/academics/subjects
    |--------------------------------------------------------------------------
    | Create a new subject (school-wide) then assign to a section + teacher.
    */
    public function createSubject(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'code'             => 'required|string|max:50',
            'name'             => 'required|string|max:255',
            'type'             => 'required|string|max:100',
            'max_theory'       => 'nullable|integer|min:0|max:200',
            'max_practical'    => 'nullable|integer|min:0|max:200',
            // Assignment fields
            'class_section_id' => 'required|integer|exists:class_sections,id',
            'staff_id'         => 'nullable|integer|exists:staff,id',
            'academic_term'    => 'nullable|string|max:100',
        ]);

        // Create or find the subject (unique by code + school)
        try {
            $subject = Subject::firstOrCreate(
                ['code' => strtoupper($request->code), 'school_id' => $schoolId],
                [
                    'name'                => $request->name,
                    'type'                => $request->type,
                    'max_theory_marks'    => $request->max_theory    ?? 70,
                    'max_practical_marks' => $request->max_practical ?? 30,
                    'school_id'           => $schoolId,
                ]
            );
        } catch (UniqueConstraintViolationException $e) {
            $subject = Subject::where('code', strtoupper($request->code))
                ->where('school_id', $schoolId)->first();
        }

        // Check if this subject is already assigned to this section
        $existing = StaffSubjectAssignment::where('subject_id', $subject->id)
            ->where('class_section_id', $request->class_section_id)
            ->where('school_id', $schoolId)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'This subject is already assigned to this class section.',
            ], 422);
        }

        // Create the assignment
        $assignment = StaffSubjectAssignment::create([
            'subject_id'       => $subject->id,
            'class_section_id' => $request->class_section_id,
            'staff_id'         => $request->staff_id,
            'academic_term'    => $request->academic_term ?? $this->currentTerm(),
            'school_id'        => $schoolId,
        ]);

        $assignment->load(['subject', 'staff']);

        return response()->json([
            'message'       => 'Subject created and assigned.',
            'assignment_id' => $assignment->id,
            'id'            => (string) $subject->id,
            'code'          => $subject->code,
            'name'          => $subject->name,
            'type'          => $subject->type,
            'teacher'       => $assignment->staff
                ? ($assignment->staff->first_name . ' ' . $assignment->staff->last_name)
                : '—',
            'teacher_id'    => $assignment->staff_id,
            'max_marks'     => $subject->max_theory_marks . ' (Theory) / '
                             . $subject->max_practical_marks . ' (Practical)',
            'max_theory'    => $subject->max_theory_marks,
            'max_practical' => $subject->max_practical_marks,
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | PUT /api/academics/subjects/{assignment}
    |--------------------------------------------------------------------------
    | Update subject details AND/OR reassign teacher for a section assignment.
    */
    public function updateSubject(Request $request, StaffSubjectAssignment $assignment): JsonResponse
    {
        abort_if($assignment->school_id !== $request->user()->school_id, 403);

        $request->validate([
            'name'          => 'sometimes|string|max:255',
            'type'          => 'sometimes|string|max:100',
            'max_theory'    => 'nullable|integer|min:0|max:200',
            'max_practical' => 'nullable|integer|min:0|max:200',
            'staff_id'      => 'nullable|integer|exists:staff,id',
            'academic_term' => 'nullable|string|max:100',
        ]);

        // Update subject record
        $subject = $assignment->subject;
        if ($request->has('name'))          $subject->name                = $request->name;
        if ($request->has('type'))          $subject->type                = $request->type;
        if ($request->has('max_theory'))    $subject->max_theory_marks    = $request->max_theory;
        if ($request->has('max_practical')) $subject->max_practical_marks = $request->max_practical;
        $subject->save();

        // Update assignment (teacher / term)
        $assignment->update([
            'staff_id'      => $request->staff_id    ?? $assignment->staff_id,
            'academic_term' => $request->academic_term ?? $assignment->academic_term,
        ]);

        $assignment->load(['subject', 'staff']);

        return response()->json([
            'message'       => 'Subject updated.',
            'assignment_id' => $assignment->id,
            'id'            => (string) $subject->id,
            'code'          => $subject->code,
            'name'          => $subject->name,
            'type'          => $subject->type,
            'teacher'       => $assignment->staff
                ? ($assignment->staff->first_name . ' ' . $assignment->staff->last_name)
                : '—',
            'teacher_id'    => $assignment->staff_id,
            'max_marks'     => $subject->max_theory_marks . ' (Theory) / '
                             . $subject->max_practical_marks . ' (Practical)',
            'max_theory'    => $subject->max_theory_marks,
            'max_practical' => $subject->max_practical_marks,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE /api/academics/subjects/{assignment}
    |--------------------------------------------------------------------------
    | Removes the teacher assignment for a subject in a section.
    | Does NOT delete the subject itself (other sections may use it).
    */
    public function deleteSubject(Request $request, StaffSubjectAssignment $assignment): JsonResponse
    {
        abort_if($assignment->school_id !== $request->user()->school_id, 403);
        $assignment->delete();

        return response()->json(['message' => 'Subject removed from this section.']);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/academics/staff
    |--------------------------------------------------------------------------
    | Returns teaching staff for the teacher dropdown.
    */
    public function getStaff(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;

        $staff = Staff::where('school_id', $schoolId)
            ->where('status', 'active')
            ->orderBy('first_name')
            ->get()
            ->map(fn($s) => [
                'id'   => $s->id,
                'name' => $s->first_name . ' ' . $s->last_name,
                'role' => $s->role_title ?? ucfirst($s->role),
            ]);

        return response()->json($staff);
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private function currentTerm(): string
    {
        $month = now()->month;
        return match(true) {
            $month <= 4  => now()->year . '/Term 2',
            $month <= 8  => now()->year . '/Term 3',
            default      => now()->year . '/Term 1',
        };
    }
}
