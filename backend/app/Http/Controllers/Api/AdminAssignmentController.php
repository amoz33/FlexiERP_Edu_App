<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\ClassSection;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAssignmentController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET /api/admin/assignments
    |--------------------------------------------------------------------------
    | Admin sees ALL assignments across all classes.
    | Filters: ?section_id=X, ?staff_id=X, ?status=active|closed|draft
    */
    public function index(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;

        $query = Assignment::with(['subject', 'section.academicClass', 'staff', 'submissions'])
            ->where('school_id', $schoolId)
            ->orderByDesc('created_at');

        if ($sectionId = $request->query('section_id')) $query->where('class_section_id', $sectionId);
        if ($staffId   = $request->query('staff_id'))   $query->where('staff_id', $staffId);
        if ($status    = $request->query('status'))      $query->where('status', $status);

        $assignments = $query->get()->map(function ($a) {
            $totalStudents  = Student::where('class_section_id', $a->class_section_id)->active()->count();
            $submittedCount = $a->submissions->count();
            return [
                'id'           => $a->id,
                'title'        => $a->title,
                'description'  => $a->description ?? '',
                'subject'      => $a->subject?->name ?? '—',
                'class'        => $a->section?->full_name ?? '—',
                'section_id'   => $a->class_section_id,
                'teacher'      => $a->staff ? $a->staff->first_name . ' ' . $a->staff->last_name : '—',
                'staff_id'     => $a->staff_id,
                'due_date'     => $a->due_date->format('M d, Y'),
                'due_raw'      => $a->due_date->toDateString(),
                'status'       => $a->status,
                'is_overdue'   => $a->due_date->isPast() && $a->status === 'active',
                'academic_term'=> $a->academic_term,
                'created_at'   => $a->created_at->format('M d, Y'),
                'stats' => [
                    'total'     => $totalStudents,
                    'submitted' => $submittedCount,
                    'pending'   => max(0, $totalStudents - $submittedCount),
                    'rate'      => $totalStudents > 0 ? round(($submittedCount / $totalStudents) * 100) : 0,
                ],
            ];
        });

        // Summary stats across all
        $total     = $assignments->count();
        $active    = $assignments->where('status', 'active')->count();
        $overdue   = $assignments->where('is_overdue', true)->count();
        $avgRate   = $total > 0 ? round($assignments->avg('stats.rate')) : 0;

        return response()->json([
            'summary' => compact('total', 'active', 'overdue', 'avgRate'),
            'data'    => $assignments,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | PUT /api/admin/assignments/{assignment}
    |--------------------------------------------------------------------------
    | Admin can update any assignment.
    */
    public function update(Request $request, Assignment $assignment): JsonResponse
    {
        abort_if($assignment->school_id !== $request->user()->school_id, 403);

        $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'due_date'    => 'sometimes|date',
            'status'      => 'sometimes|in:active,closed,draft',
        ]);

        $assignment->update($request->only(['title', 'description', 'due_date', 'status']));

        return response()->json(['message' => 'Assignment updated.']);
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE /api/admin/assignments/{assignment}
    |--------------------------------------------------------------------------
    */
    public function destroy(Request $request, Assignment $assignment): JsonResponse
    {
        abort_if($assignment->school_id !== $request->user()->school_id, 403);
        $assignment->delete();
        return response()->json(['message' => 'Assignment deleted.']);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/admin/assignments/{assignment}/submissions
    |--------------------------------------------------------------------------
    | Admin views all submissions for an assignment.
    */
    public function submissions(Request $request, Assignment $assignment): JsonResponse
    {
        abort_if($assignment->school_id !== $request->user()->school_id, 403);

        $students = Student::where('class_section_id', $assignment->class_section_id)
            ->active()->orderBy('first_name')->get();

        $submissions = AssignmentSubmission::where('assignment_id', $assignment->id)
            ->get()->keyBy('student_id');

        return response()->json([
            'assignment' => [
                'id'      => $assignment->id,
                'title'   => $assignment->title,
                'class'   => $assignment->section?->full_name ?? '—',
                'subject' => $assignment->subject?->name ?? '—',
                'due_date'=> $assignment->due_date->format('M d, Y'),
                'teacher' => $assignment->staff
                    ? $assignment->staff->first_name . ' ' . $assignment->staff->last_name
                    : '—',
            ],
            'submissions' => $students->map(function ($student) use ($submissions) {
                $sub = $submissions[$student->id] ?? null;
                return [
                    'student_id'   => $student->student_id,
                    'student_name' => $student->first_name . ' ' . $student->last_name,
                    'avatar'       => strtoupper(substr($student->first_name, 0, 1) . substr($student->last_name, 0, 1)),
                    'submitted'    => $sub !== null,
                    'submitted_at' => $sub?->submitted_at?->format('M d, Y'),
                    'file_name'    => $sub?->file_name,
                    'file_url'     => $sub?->file_path ? asset('storage/' . $sub->file_path) : null,
                    'status'       => $sub?->status ?? 'not_submitted',
                    'submission_id'=> $sub?->id,
                ];
            }),
        ]);
    }
}
