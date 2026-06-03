<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET /api/students
    |--------------------------------------------------------------------------
    | Supports: search, grade, status, page, per_page
    */
    public function index(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $perPage  = min((int) $request->query('per_page', 20), 100);

        $query = Student::with('section.academicClass')
            ->forSchool($schoolId)
            ->orderBy('first_name');

        // Search by name, student_id, admission_no or email
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name',   'like', "%{$search}%")
                  ->orWhere('last_name',  'like', "%{$search}%")
                  ->orWhere('student_id', 'like', "%{$search}%")
                  ->orWhere('admission_no','like', "%{$search}%")
                  ->orWhere('email',       'like', "%{$search}%");
            });
        }

        // Filter by class/grade name
        if ($grade = $request->query('grade')) {
            $query->whereHas('section.academicClass', function ($q) use ($grade) {
                $q->where('name', $grade);
            });
        }

        // Filter by status
        if ($status = $request->query('status')) {
            $query->where('status', strtolower($status));
        }

        $students = $query->paginate($perPage);

        return response()->json([
            'data'         => $students->map(fn($s) => $this->studentRow($s)),
            'total'        => $students->total(),
            'current_page' => $students->currentPage(),
            'last_page'    => $students->lastPage(),
            'per_page'     => $students->perPage(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/students/{id}
    |--------------------------------------------------------------------------
    */
    public function show(Request $request, Student $student): JsonResponse
    {
        $this->authoriseSchool($request, $student);
        $student->load('section.academicClass');

        return response()->json(['data' => $this->studentDetail($student)]);
    }

    /*
    |--------------------------------------------------------------------------
    | Internal helpers
    |--------------------------------------------------------------------------
    */

    // Compact row for the table list
    private function studentRow(Student $s): array
    {
        return [
            'id'           => $s->student_id,
            'name'         => $s->first_name . ' ' . $s->last_name,
            'admission_no' => $s->admission_no,
            'grade'        => $s->section?->academicClass?->name ?? $s->grade ?? '—',
            'section'      => $s->section?->name ?? $s->section ?? '—',
            'parent'       => $s->parent_name ?? '—',
            'status'       => ucfirst($s->status),
            'email'        => $s->email,
            'phone'        => $s->phone,
        ];
    }

    // Full detail for the student profile view
    private function studentDetail(Student $s): array
    {
        return [
            ...$this->studentRow($s),
            'gender'          => $s->gender,
            'date_of_birth'   => $s->date_of_birth?->format('M d, Y'),
            'address'         => $s->address,
            'parent_phone'    => $s->parent_phone,
            'parent_email'    => $s->parent_email,
            'enrollment_date' => $s->enrollment_date?->format('M d, Y'),
        ];
    }

    private function authoriseSchool(Request $request, Student $student): void
    {
        abort_if($student->school_id !== $request->user()->school_id, 403);
    }
}
