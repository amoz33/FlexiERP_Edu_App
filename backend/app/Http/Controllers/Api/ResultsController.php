<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicClass;
use App\Models\Assessment;
use App\Models\ClassSection;
use App\Models\Staff;
use App\Models\StaffSubjectAssignment;
use App\Models\Student;
use App\Models\StudentGrade;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class ResultsController extends Controller
{
    public function selections(Request $request): JsonResponse
    {
        $schoolId = (string) $request->user()->school_id;
        $className = trim((string) $request->query('class_name', ''));
        $term = $this->resolveAcademicTerm($request, $schoolId);

        $sectionIds = null;
        $classIds = collect();
        if ($className !== '') {
            $classIds = AcademicClass::where('school_id', $schoolId)
                ->where('name', $className)
                ->pluck('id');

            if ($classIds->isEmpty()) {
                $classIds = AcademicClass::where('school_id', $schoolId)
                    ->where('name', 'like', '%' . $className . '%')
                    ->pluck('id');
            }

            if ($classIds->isNotEmpty()) {
                $sectionIds = ClassSection::where('school_id', $schoolId)
                    ->whereIn('class_id', $classIds)
                    ->pluck('id');
            } else {
                $sectionIds = ClassSection::where('school_id', $schoolId)
                    ->where(function ($query) use ($className) {
                        $query->where('name', $className)
                            ->orWhere('full_name', $className)
                            ->orWhere('name', 'like', '%' . $className . '%')
                            ->orWhere('full_name', 'like', '%' . $className . '%');
                    })
                    ->pluck('id');
            }
        }

        $assessmentBase = Assessment::query()
            ->where('school_id', $schoolId)
            ->whereNotNull('subject_id')
            ->whereNotNull('class_section_id');

        if ($sectionIds !== null) {
            $assessmentBase->whereIn('class_section_id', $sectionIds);
        }

        $assessmentsForTerm = (clone $assessmentBase)
            ->where('academic_term', $term)
            ->select(['class_section_id', 'subject_id', 'staff_id'])
            ->distinct()
            ->get();

        $assessmentAnyTermCount = (clone $assessmentBase)->count();
        $assessmentCurrentTermCount = (clone $assessmentBase)->where('academic_term', $term)->count();

        $assessmentDistinct = $assessmentsForTerm->isNotEmpty()
            ? $assessmentsForTerm
            : (clone $assessmentBase)
                ->select(['class_section_id', 'subject_id', 'staff_id'])
                ->distinct()
                ->get();

        $assignmentsBase = StaffSubjectAssignment::query()
            ->where('school_id', $schoolId)
            ->whereNotNull('subject_id')
            ->whereNotNull('staff_id')
            ->whereNotNull('class_section_id');

        if ($sectionIds !== null) {
            $assignmentsBase->whereIn('class_section_id', $sectionIds);
        }

        $assignmentsForTerm = (clone $assignmentsBase)
            ->where('academic_term', $term)
            ->select(['class_section_id', 'subject_id', 'staff_id'])
            ->distinct()
            ->get();

        $assignmentDistinct = $assignmentsForTerm->isNotEmpty()
            ? $assignmentsForTerm
            : $assignmentsBase
                ->select(['class_section_id', 'subject_id', 'staff_id'])
                ->distinct()
                ->get();

        $fallbackStaffMap = $assignmentDistinct
            ->keyBy(fn ($row) => $row->class_section_id . '|' . $row->subject_id);

        $distinctMap = collect();

        foreach ($assessmentDistinct as $row) {
            $sectionId = (string) $row->class_section_id;
            $subjectId = (string) $row->subject_id;
            $staffId = (string) ($row->staff_id ?? '');

            if ($staffId === '') {
                $fallback = $fallbackStaffMap->get($sectionId . '|' . $subjectId);
                $staffId = (string) ($fallback->staff_id ?? '');
            }

            $distinctMap->put($sectionId . '|' . $subjectId . '|' . $staffId, (object) [
                'class_section_id' => $sectionId,
                'subject_id' => $subjectId,
                'staff_id' => $staffId !== '' ? (int) $staffId : null,
            ]);
        }

        foreach ($assignmentDistinct as $row) {
            $sectionId = (string) $row->class_section_id;
            $subjectId = (string) $row->subject_id;
            $staffId = (string) ($row->staff_id ?? '');

            $distinctMap->put($sectionId . '|' . $subjectId . '|' . $staffId, (object) [
                'class_section_id' => $sectionId,
                'subject_id' => $subjectId,
                'staff_id' => $staffId !== '' ? (int) $staffId : null,
            ]);
        }

        $distinct = $distinctMap->values();

        $sectionMap = ClassSection::with('academicClass')
            ->whereIn('id', $distinct->pluck('class_section_id')->unique())
            ->get()
            ->keyBy('id');

        $subjectMap = Subject::whereIn('id', $distinct->pluck('subject_id')->unique())
            ->get()
            ->keyBy('id');

        $staffMap = Staff::whereIn('id', $distinct->pluck('staff_id')->unique())
            ->get()
            ->keyBy('id');

        $data = $distinct->map(function ($row) use ($sectionMap, $subjectMap, $staffMap) {
            $section = $sectionMap->get($row->class_section_id);
            $subject = $subjectMap->get($row->subject_id);
            $staff = $staffMap->get($row->staff_id);

            return [
                'class_name' => $section?->academicClass?->name ?? '',
                'section_id' => (string) $row->class_section_id,
                'section_name' => $section?->full_name ?? $section?->name ?? (string) $row->class_section_id,
                'subject_id' => (string) $row->subject_id,
                'subject_name' => $subject?->name ?? (string) $row->subject_id,
                'staff_id' => (string) $row->staff_id,
                'staff_name' => $staff ? trim($staff->first_name . ' ' . $staff->last_name) : (string) $row->staff_id,
            ];
        })->values();

        // #region debug-point B:results-selections
        Http::timeout(2)->post('http://127.0.0.1:7777/event', [
            'sessionId' => 'results-no-subject',
            'runId' => 'pre-fix',
            'hypothesisId' => 'B',
            'location' => 'ResultsController.php:159',
            'msg' => '[DEBUG] results selections response',
            'data' => [
                'school_id' => $schoolId,
                'class_name' => $className,
                'term' => $term,
                'class_ids' => $classIds->values()->all(),
                'section_ids' => $sectionIds?->values()->all(),
                'assessment_any_term_count' => $assessmentAnyTermCount,
                'assessment_current_term_count' => $assessmentCurrentTermCount,
                'assessment_current_term_rows' => $assessmentsForTerm->values()->all(),
                'count' => $data->count(),
                'items' => $data->values()->all(),
            ],
            'ts' => now()->valueOf(),
        ]);
        // #endregion

        return response()->json([
            'term' => $term,
            'data' => $data,
        ]);
    }

    public function view(Request $request): JsonResponse
    {
        $schoolId = (string) $request->user()->school_id;
        $term = $this->resolveAcademicTerm($request, $schoolId);

        $validated = $request->validate([
            'section_id' => 'required',
            'subject_id' => 'required',
            'staff_id'   => 'nullable',
        ]);

        $sectionId = (string) $validated['section_id'];
        $subjectId = (string) $validated['subject_id'];
        $staffId = array_key_exists('staff_id', $validated) ? trim((string) $validated['staff_id']) : '';

        $assessmentsQuery = Assessment::query()
            ->where('school_id', $schoolId)
            ->where('academic_term', $term)
            ->where('class_section_id', $sectionId)
            ->where('subject_id', $subjectId);

        if ($staffId !== '') {
            $assessmentsQuery->where('staff_id', $staffId);
        }

        $assessments = $assessmentsQuery
            ->orderBy('date')
            ->get();

        $students = Student::query()
            ->forSchool($schoolId)
            ->where('class_section_id', $sectionId)
            ->active()
            ->orderBy('first_name')
            ->get();

        $assessmentIds = $assessments->pluck('id')->all();
        $studentIds = $students->pluck('id')->all();

        $grades = [];
        if (count($assessmentIds) > 0 && count($studentIds) > 0) {
            $grades = StudentGrade::query()
                ->whereIn('assessment_id', $assessmentIds)
                ->whereIn('student_id', $studentIds)
                ->get()
                ->map(fn($g) => [
                    'assessment_id' => (string) $g->assessment_id,
                    'student_id' => (string) $g->student_id,
                    'marks' => $g->marks === null ? null : (float) $g->marks,
                    'remarks' => (string) ($g->remarks ?? ''),
                ])
                ->values()
                ->all();
        }

        return response()->json([
            'term' => $term,
            'assessments' => $assessments->map(fn($a) => [
                'id' => (string) $a->id,
                'title' => (string) $a->title,
                'category' => (string) $a->category,
                'max_marks' => (int) $a->max_marks,
            ])->values(),
            'students' => $students->map(fn($s) => [
                'id' => (string) $s->id,
                'name' => trim($s->first_name . ' ' . $s->last_name),
                'admission_no' => (string) ($s->student_id ?? $s->id),
            ])->values(),
            'grades' => $grades,
        ]);
    }

    private function resolveAcademicTerm(Request $request, string $schoolId): string
    {
        $term = trim((string) $request->query('term', ''));
        if ($term !== '') return $term;

        try {
            if (DB::getSchemaBuilder()->hasTable('school_settings') && DB::getSchemaBuilder()->hasColumn('school_settings', 'current_term')) {
                $current = (string) (DB::table('school_settings')->where('school_id', $schoolId)->value('current_term') ?? '');
                if (trim($current) !== '') return trim($current);
            }
        } catch (\Throwable) {
        }

        $latest = (string) (Assessment::where('school_id', $schoolId)->orderByDesc('date')->value('academic_term') ?? '');
        return trim($latest) !== '' ? trim($latest) : '2026/Term 1';
    }
}
