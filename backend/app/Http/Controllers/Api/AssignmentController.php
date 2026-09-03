<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AssignmentController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Helper: resolve student (same pattern as portal controller)
    |--------------------------------------------------------------------------
    */
    private function resolveStudent(Request $request): ?Student
    {
        $user = $request->user();
        if ($user->role === 'student') {
            return Student::where('user_id', $user->id)->first();
        }
        if ($studentId = $request->query('student_id')) {
            return Student::where('student_id', $studentId)
                ->where('school_id', $user->school_id)->first();
        }
        return Student::where('school_id', $user->school_id)
            ->where(function ($q) use ($user) {
                $q->where('parent_email', $user->email)
                  ->orWhere('parent_phone', $user->phone ?? '');
            })->first();
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/portal/assignments?student_id=...
    |--------------------------------------------------------------------------
    | Returns all active assignments for the student's class section,
    | with the student's submission (if any) attached.
    */
    public function index(Request $request): JsonResponse
    {
        $student  = $this->resolveStudent($request);
        if (!$student) return response()->json(['message' => 'Student not found.'], 404);

        $schoolId  = $request->user()->school_id;
        $sectionId = $student->class_section_id;

        $assignments = Assignment::with(['subject', 'staff', 'submissions' => function ($q) use ($student) {
            $q->where('student_id', $student->id);
        }])
        ->where('class_section_id', $sectionId)
        ->where('school_id', $schoolId)
        ->where('status', 'active')
        ->orderBy('due_date')
        ->get()
        ->map(fn($a) => $this->formatAssignment($a, $student->id));

        return response()->json($assignments);
    }

    /*
    |--------------------------------------------------------------------------
    | POST /api/portal/assignments/{assignment}/submit
    |--------------------------------------------------------------------------
    | Student submits (or resubmits) an assignment.
    | Accepts multipart/form-data with optional file upload.
    |
    | File is stored at:
    |   storage/app/public/schools/{school_id}/assignments/{student_id}/{uuid}.ext
    | Accessible via:
    |   /storage/schools/{school_id}/assignments/{student_id}/{uuid}.ext
    */
    public function submit(Request $request, Assignment $assignment): JsonResponse
    {
        $student  = $this->resolveStudent($request);
        if (!$student) return response()->json(['message' => 'Student not found.'], 404);

        // Only student role can submit
        if ($request->user()->role !== 'student') {
            return response()->json(['message' => 'Only students can submit assignments.'], 403);
        }

        $request->validate([
            'note' => 'nullable|string|max:100000',
            'file' => 'nullable|file|max:10240|mimes:pdf,doc,docx,ppt,pptx,xls,xlsx,jpg,jpeg,png,zip',
        ]);

        $schoolId  = $request->user()->school_id;
        $filePath  = null;
        $fileName  = null;
        $fileSize  = null;
        $fileMime  = null;

        // ── Handle file upload ─────────────────────────────────────────────
        if ($request->hasFile('file') && $request->file('file')->isValid()) {
            $file     = $request->file('file');
            $ext      = $file->getClientOriginalExtension();
            $uuid     = Str::uuid();
            $folder   = "schools/{$schoolId}/assignments/{$student->id}";
            $stored   = "{$folder}/{$uuid}.{$ext}";

            Storage::disk('public')->putFileAs($folder, $file, "{$uuid}.{$ext}");

            $fileName = $file->getClientOriginalName();
            $filePath = $stored;
            $fileSize = $this->humanFileSize($file->getSize());
            $fileMime = $file->getMimeType();
        }

        // ── Upsert submission ──────────────────────────────────────────────
        $existing = AssignmentSubmission::where('assignment_id', $assignment->id)
            ->where('student_id', $student->id)
            ->first();

        // If resubmitting and a new file was uploaded, delete the old file
        if ($existing && $filePath && $existing->file_path) {
            Storage::disk('public')->delete($existing->file_path);
        }

        $submission = AssignmentSubmission::updateOrCreate(
            ['assignment_id' => $assignment->id, 'student_id' => $student->id],
            [
                'note'         => $request->note ?? $existing?->note,
                'file_name'    => $fileName ?? $existing?->file_name,
                'file_path'    => $filePath ?? $existing?->file_path,
                'file_size'    => $fileSize ?? $existing?->file_size,
                'file_mime'    => $fileMime ?? $existing?->file_mime,
                'status'       => 'submitted',
                'school_id'    => $schoolId,
                'submitted_at' => now(),
            ]
        );

        return response()->json([
            'message'    => 'Assignment submitted successfully.',
            'submission' => $this->formatSubmission($submission),
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE /api/portal/assignments/{assignment}/submission
    |--------------------------------------------------------------------------
    | Student withdraws (deletes) their submission.
    */
    public function withdraw(Request $request, Assignment $assignment): JsonResponse
    {
        $student = $this->resolveStudent($request);
        if (!$student) return response()->json(['message' => 'Student not found.'], 404);

        $submission = AssignmentSubmission::where('assignment_id', $assignment->id)
            ->where('student_id', $student->id)
            ->first();

        if (!$submission) {
            return response()->json(['message' => 'No submission found.'], 404);
        }

        // Delete file from storage
        if ($submission->file_path) {
            Storage::disk('public')->delete($submission->file_path);
        }

        $submission->delete();

        return response()->json(['message' => 'Submission withdrawn.']);
    }

    /*
    |--------------------------------------------------------------------------
    | Internal helpers
    |--------------------------------------------------------------------------
    */

    private function formatAssignment(Assignment $a, int $studentId): array
    {
        $submission = $a->submissions->first();

        return [
            'id'          => $a->id,
            'title'       => $a->title,
            'description' => $a->description ?? '',
            'subject'     => $a->subject?->name ?? '—',
            'teacher'     => $a->staff ? ($a->staff->first_name . ' ' . $a->staff->last_name) : '—',
            'due_date'    => $a->due_date->format('M d, Y'),
            'due_raw'     => $a->due_date->toDateString(),
            'status'      => $a->status,
            'is_overdue'  => $a->due_date->isPast() && !$submission,
            'submission'  => $submission ? $this->formatSubmission($submission) : null,
        ];
    }

    private function formatSubmission(AssignmentSubmission $s): array
    {
        return [
            'id'               => $s->id,
            'note'             => $s->note,
            'file_name'        => $s->file_name,
            'file_url'         => $s->file_path ? asset('storage/' . $s->file_path) : null,
            'file_size'        => $s->file_size,
            'status'           => $s->status,
            'teacher_feedback' => $s->teacher_feedback,
            'submitted_at'     => $s->submitted_at->format('M d, Y'),
        ];
    }

    private function humanFileSize(int $bytes): string
    {
        if ($bytes < 1024)        return $bytes . ' B';
        if ($bytes < 1048576)     return round($bytes / 1024, 1) . ' KB';
        return round($bytes / 1048576, 1) . ' MB';
    }
}
