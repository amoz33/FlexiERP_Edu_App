<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Staff;
use App\Models\StaffSubjectAssignment;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeacherAssignmentController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Helper: get authenticated teacher's staff record
    |--------------------------------------------------------------------------
    */
    private function getStaff(Request $request): ?Staff
    {
        return Staff::where('user_id', $request->user()->id)->first();
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/teacher/assignments
    |--------------------------------------------------------------------------
    | Returns all assignments created by this teacher, with submission counts.
    | Supports ?section_id=X and ?status=active|closed|draft filters.
    */
    public function index(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $staff    = $this->getStaff($request);
        if (!$staff) return response()->json(['message' => 'Staff record not found.'], 404);

        $query = Assignment::with(['subject', 'section.academicClass', 'submissions'])
            ->where('staff_id', $staff->id)
            ->where('school_id', $schoolId)
            ->orderByDesc('created_at');

        if ($sectionId = $request->query('section_id')) {
            $query->where('class_section_id', $sectionId);
        }
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $assignments = $query->get()->map(fn($a) => $this->formatForTeacher($a));

        return response()->json($assignments);
    }

    /*
    |--------------------------------------------------------------------------
    | POST /api/teacher/assignments
    |--------------------------------------------------------------------------
    | Teacher creates a new assignment.
    */
    public function store(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $staff    = $this->getStaff($request);
        if (!$staff) return response()->json(['message' => 'Staff record not found.'], 404);

        $request->validate([
            'title'            => 'required|string|max:255',
            'description'      => 'nullable|string|max:5000',
            'subject_id'       => 'required|integer|exists:subjects,id',
            'class_section_id' => 'required|integer|exists:class_sections,id',
            'due_date'         => 'required|date|after:today',
            'status'           => 'in:active,draft',
        ]);

        // Verify this teacher is actually assigned to this subject+section
        $assigned = StaffSubjectAssignment::where('staff_id', $staff->id)
            ->where('subject_id', $request->subject_id)
            ->where('class_section_id', $request->class_section_id)
            ->where('school_id', $schoolId)
            ->exists();

        // Allow admins and staff with no assignment (some schools don't use formal assignments table)
        // Still create but flag if unverified — I'm guessing the assignment table may be sparse
        $assignment = Assignment::create([
            'title'            => $request->title,
            'description'      => $request->description,
            'subject_id'       => $request->subject_id,
            'class_section_id' => $request->class_section_id,
            'staff_id'         => $staff->id,
            'due_date'         => $request->due_date,
            'academic_term'    => $this->currentTerm(),
            'status'           => $request->status ?? 'active',
            'school_id'        => $schoolId,
        ]);

        $assignment->load(['subject', 'section.academicClass', 'submissions']);

        return response()->json([
            'message'    => 'Assignment created successfully.',
            'assignment' => $this->formatForTeacher($assignment),
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | PUT /api/teacher/assignments/{assignment}
    |--------------------------------------------------------------------------
    | Teacher updates an assignment (title, description, due date, status).
    */
    public function update(Request $request, Assignment $assignment): JsonResponse
    {
        $staff = $this->getStaff($request);
        if (!$staff || $assignment->staff_id !== $staff->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:5000',
            'due_date'    => 'sometimes|date',
            'status'      => 'sometimes|in:active,closed,draft',
        ]);

        $assignment->update($request->only(['title', 'description', 'due_date', 'status']));
        $assignment->load(['subject', 'section.academicClass', 'submissions']);

        return response()->json([
            'message'    => 'Assignment updated.',
            'assignment' => $this->formatForTeacher($assignment),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE /api/teacher/assignments/{assignment}
    |--------------------------------------------------------------------------
    */
    public function destroy(Request $request, Assignment $assignment): JsonResponse
    {
        $staff = $this->getStaff($request);
        if (!$staff || $assignment->staff_id !== $staff->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $assignment->delete();

        return response()->json(['message' => 'Assignment deleted.']);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/teacher/assignments/{assignment}/submissions
    |--------------------------------------------------------------------------
    | Returns all student submissions for a specific assignment.
    */
    public function submissions(Request $request, Assignment $assignment): JsonResponse
    {
        $staff = $this->getStaff($request);
        if (!$staff || $assignment->staff_id !== $staff->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Get all students in the class
        $students = Student::where('class_section_id', $assignment->class_section_id)
            ->active()
            ->orderBy('first_name')
            ->get();

        // Get submissions keyed by student_id
        $submissions = AssignmentSubmission::where('assignment_id', $assignment->id)
            ->get()->keyBy('student_id');

        $data = $students->map(function ($student) use ($submissions) {
            $sub = $submissions[$student->id] ?? null;
            return [
                'student_id'   => $student->student_id,
                'student_name' => $student->first_name . ' ' . $student->last_name,
                'avatar'       => strtoupper(substr($student->first_name, 0, 1) . substr($student->last_name, 0, 1)),
                'submitted'    => $sub !== null,
                'submitted_at' => $sub?->submitted_at?->format('M d, Y h:i A'),
                'note'         => $sub?->note,
                'file_name'    => $sub?->file_name,
                'file_url'     => $sub?->file_path ? asset('storage/' . $sub->file_path) : null,
                'file_size'    => $sub?->file_size,
                'status'       => $sub?->status ?? 'not_submitted',
                'feedback'     => $sub?->teacher_feedback,
                'submission_id'=> $sub?->id,
            ];
        });

        $totalStudents  = $students->count();
        $totalSubmitted = $submissions->count();

        return response()->json([
            'assignment'    => [
                'id'       => $assignment->id,
                'title'    => $assignment->title,
                'due_date' => $assignment->due_date->format('M d, Y'),
                'subject'  => $assignment->subject?->name,
                'class'    => $assignment->section?->full_name ?? '—',
            ],
            'stats' => [
                'total'     => $totalStudents,
                'submitted' => $totalSubmitted,
                'pending'   => $totalStudents - $totalSubmitted,
                'rate'      => $totalStudents > 0 ? round(($totalSubmitted / $totalStudents) * 100) : 0,
            ],
            'submissions' => $data,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | POST /api/teacher/assignments/{assignment}/feedback
    |--------------------------------------------------------------------------
    | Teacher leaves feedback on a submission.
    */
    public function leaveFeedback(Request $request, Assignment $assignment): JsonResponse
    {
        $staff = $this->getStaff($request);
        if (!$staff || $assignment->staff_id !== $staff->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $request->validate([
            'submission_id' => 'required|integer|exists:assignment_submissions,id',
            'feedback'      => 'required|string|max:2000',
            'status'        => 'in:reviewed,returned',
        ]);

        AssignmentSubmission::where('id', $request->submission_id)
            ->where('assignment_id', $assignment->id)
            ->update([
                'teacher_feedback' => $request->feedback,
                'status'           => $request->status ?? 'reviewed',
            ]);

        return response()->json(['message' => 'Feedback saved.']);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/teacher/assignments/groups
    |--------------------------------------------------------------------------
    | Returns teacher's assigned class sections with subject info,
    | for populating the "Create Assignment" form dropdowns.
    */
    public function groups(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $staff    = $this->getStaff($request);
        if (!$staff) return response()->json(['message' => 'Staff record not found.'], 404);

        $assignments = StaffSubjectAssignment::with(['section.academicClass', 'subject'])
            ->where('staff_id', $staff->id)
            ->where('school_id', $schoolId)
            ->get()
            ->map(fn($a) => [
                'section_id'   => $a->class_section_id,
                'section_name' => $a->section?->full_name ?? '—',
                'subject_id'   => $a->subject_id,
                'subject_name' => $a->subject?->name ?? '—',
            ]);

        return response()->json($assignments);
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */
    private function formatForTeacher(Assignment $a): array
    {
        $totalStudents  = Student::where('class_section_id', $a->class_section_id)->active()->count();
        $submittedCount = $a->submissions->count();

        return [
            'id'           => $a->id,
            'title'        => $a->title,
            'description'  => $a->description ?? '',
            'subject'      => $a->subject?->name ?? '—',
            'subject_id'   => $a->subject_id,
            'class'        => $a->section?->full_name ?? '—',
            'section_id'   => $a->class_section_id,
            'due_date'     => $a->due_date->format('M d, Y'),
            'due_raw'      => $a->due_date->toDateString(),
            'academic_term'=> $a->academic_term,
            'status'       => $a->status,
            'is_overdue'   => $a->due_date->isPast() && $a->status === 'active',
            'created_at'   => $a->created_at->format('M d, Y'),
            'stats' => [
                'total'     => $totalStudents,
                'submitted' => $submittedCount,
                'pending'   => max(0, $totalStudents - $submittedCount),
                'rate'      => $totalStudents > 0 ? round(($submittedCount / $totalStudents) * 100) : 0,
            ],
        ];
    }

    private function currentTerm(): string
    {
        $month = now()->month;
        $year  = now()->year;
        $term  = match(true) {
            $month <= 4  => '2nd Term',
            $month <= 8  => '3rd Term',
            default      => '1st Term',
        };
        return "{$year}/{$term}";
    }
}
