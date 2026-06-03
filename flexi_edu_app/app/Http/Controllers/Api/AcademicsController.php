<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicClass;
use App\Models\ClassSection;
use App\Models\StaffSubjectAssignment;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AcademicsController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET /api/academics/classes
    |--------------------------------------------------------------------------
    | Returns all classes with their sections
    | Frontend: academicsApi.getClasses()
    */
    public function getClasses(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;

        $classes = AcademicClass::where('school_id', $schoolId)
            ->orderBy('order')
            ->with(['sections' => function ($q) use ($schoolId) {
                $q->where('school_id', $schoolId)->orderBy('name');
            }])
            ->get()
            ->map(fn($cls) => [
                'id'       => (string) $cls->id,
                'name'     => $cls->name,
                'level'    => $cls->level,
                'sections' => $cls->sections->map(fn($sec) => [
                    'id'   => (string) $sec->id,
                    'name' => $sec->name,
                ]),
            ]);

        return response()->json($classes);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/academics/subjects?class_id=1&section_id=2
    |--------------------------------------------------------------------------
    | Returns subjects assigned to a specific class section
    | Frontend: academicsApi.getSubjects(selectedClass, selectedSection)
    */
    public function getSubjects(Request $request): JsonResponse
    {
        $schoolId  = $request->user()->school_id;
        $sectionId = $request->query('section_id');

        $assignments = StaffSubjectAssignment::with(['subject.department', 'staff'])
            ->where('school_id', $schoolId)
            ->where('class_section_id', $sectionId)
            ->get()
            ->map(fn($a) => [
                'id'        => (string) $a->subject->id,
                'code'      => $a->subject->code,
                'name'      => $a->subject->name,
                'type'      => $a->subject->type,
                'teacher'   => $a->staff?->full_name ?? '—',
                'teacher_id'=> $a->staff_id,
                'max_marks' => $a->subject->max_theory_marks . ' (Theory) / ' . $a->subject->max_practical_marks . ' (Practical)',
            ]);

        return response()->json($assignments);
    }
}
