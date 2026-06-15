<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicTerm;
use App\Models\Assessment;
use App\Models\Attendance;
use App\Models\FeePayment;
use App\Models\FeeType;
use App\Models\Student;
use App\Models\StudentGrade;
use App\Models\TimetableSlot;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentPortalController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Helper: resolve which student record to use.
    |
    | - If role = 'student': use the student linked to the logged-in user.
    | - If role = 'parent': find all students who share the same parent_email
    |   or parent_phone as the logged-in user's email/phone. The caller passes
    |   ?student_id=X to select which child to view.
    |--------------------------------------------------------------------------
    */
    private function resolveStudent(Request $request): ?Student
    {
        $user = $request->user();

        if ($user->role === 'student') {
            return Student::with(['section.academicClass'])
                ->where('user_id', $user->id)
                ->first();
        }

        // Parent role: find child by student_id query param
        if ($studentId = $request->query('student_id')) {
            return Student::with(['section.academicClass'])
                ->where('student_id', $studentId)
                ->where('school_id', $user->school_id)
                ->first();
        }

        // Parent with no student_id: return first child
        return Student::with(['section.academicClass'])
            ->where('school_id', $user->school_id)
            ->where(function ($q) use ($user) {
                $q->where('parent_email', $user->email)
                  ->orWhere('parent_phone', $user->phone ?? '');
            })
            ->first();
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/portal/children
    |--------------------------------------------------------------------------
    | Returns all children linked to a parent account.
    | For student role returns just their own record.
    */
    public function children(Request $request): JsonResponse
    {
        $user     = $request->user();
        $schoolId = $user->school_id;

        if ($user->role === 'student') {
            $student = Student::with(['section.academicClass'])
                ->where('user_id', $user->id)->first();
            if (!$student) return response()->json([]);
            return response()->json([$this->childRow($student)]);
        }

        // Parent: find by email or phone
        $children = Student::with(['section.academicClass'])
            ->where('school_id', $schoolId)
            ->where(function ($q) use ($user) {
                $q->where('parent_email', $user->email)
                  ->orWhere('parent_phone', $user->phone ?? '');
            })
            ->get()
            ->map(fn($s) => $this->childRow($s));

        return response()->json($children);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/portal/dashboard?student_id=GWPL-2026-001
    |--------------------------------------------------------------------------
    */
    public function dashboard(Request $request): JsonResponse
    {
        $student = $this->resolveStudent($request);
        if (!$student) return response()->json(['message' => 'Student record not found.'], 404);

        $schoolId = $request->user()->school_id;
        $sectionId = $student->class_section_id;

        // Attendance summary
        $attRecords  = Attendance::where('student_id', $student->id)->where('school_id', $schoolId)->get();
        $attTotal    = $attRecords->count();
        $attPresent  = $attRecords->where('status', 'present')->count();
        $attPct      = $attTotal > 0 ? round(($attPresent / $attTotal) * 100) : 100;

        // CA scores: last 5 subjects with latest grade
        $recentGrades = StudentGrade::with(['assessment.subject'])
            ->where('student_id', $student->id)
            ->whereNotNull('marks')
            ->orderByDesc('created_at')
            ->get()
            ->unique('assessment.subject_id')
            ->take(5)
            ->map(function ($g) {
                $maxMarks = $g->assessment?->max_marks ?? 100;
                $ca1 = $g->marks ?? 0;
                return [
                    'name'      => $g->assessment?->subject?->name ?? '—',
                    'teacher'   => '—',
                    'ca1'       => (int) $ca1,
                    'ca2'       => 0,
                    'max_marks' => $maxMarks,
                ];
            })->values();

        // Today's timetable
        $todayName = now()->format('l'); // Monday, Tuesday...
        $timetable = TimetableSlot::with(['subject', 'staff'])
            ->where('class_section_id', $sectionId)
            ->where('school_id', $schoolId)
            ->where('day', $todayName)
            ->orderBy('start_time')
            ->get()
            ->map(fn($t) => [
                'day'     => now()->format('D'),
                'time'    => Carbon::parse($t->start_time)->format('g:i'),
                'subject' => $t->subject?->name ?? '—',
                'teacher' => $t->staff?->last_name ? 'Mr/Mrs. ' . $t->staff->last_name : '—',
                'room'    => $t->room ?? '—',
            ]);

        // Fee balance
        $feeBalance = FeePayment::where('student_id', $student->id)
            ->whereIn('status', ['pending', 'overdue'])
            ->sum('expected_amount');

        // Class position (ranking by avg marks)
        $position  = $this->classPosition($student->id, $sectionId, $schoolId);
        $classSize = Student::where('class_section_id', $sectionId)->active()->count();

        return response()->json([
            'student' => [
                'id'             => $student->student_id,
                'name'           => $student->first_name . ' ' . $student->last_name,
                'first_name'     => $student->first_name,
                'class'          => $student->section?->academicClass?->name ?? '—',
                'section'        => $student->section?->name ?? '—',
                'class_section'  => ($student->section?->academicClass?->name ?? '') . ($student->section?->name ?? ''),
                'level'          => $student->section?->academicClass?->level ?? '—',
                'form_teacher'   => $this->formTeacher($sectionId, $schoolId),
                'house'          => $student->house ?? '—',
                'admission_no'   => $student->admission_no,
                'avatar'         => strtoupper(substr($student->first_name, 0, 1) . substr($student->last_name, 0, 1)),
            ],
            'stats' => [
                'fees_balance'   => $feeBalance,
                'avg_ca_score'   => $this->avgCaScore($student->id),
                'attendance_pct' => $attPct,
                'position'       => $position,
                'class_size'     => $classSize,
            ],
            'timetable'    => $timetable,
            'ca_scores'    => $recentGrades,
            'term'         => $this->currentTerm(),
            'session'      => $this->currentSession(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/portal/subjects?student_id=...
    |--------------------------------------------------------------------------
    */
    public function subjects(Request $request): JsonResponse
    {
        $student  = $this->resolveStudent($request);
        if (!$student) return response()->json('Student not found.', 404);

        $schoolId    = $request->user()->school_id;
        // Optional term filter — e.g. ?term=2026/Term+1
        // If not provided, defaults to the latest term in the assessments table
        $termFilter  = $request->query('term');

        // ── Get available terms for this student's class ──────────────────
        $availableTerms = Assessment::where('class_section_id', $student->class_section_id)
            ->where('school_id', $schoolId)
            ->distinct()
            ->orderByDesc('academic_term')
            ->pluck('academic_term');

        // Default to latest term if none specified
        $selectedTerm = $termFilter && $availableTerms->contains($termFilter)
            ? $termFilter
            : $availableTerms->first();

        if (!$selectedTerm) {
            return response()->json([
                'term'            => null,
                'available_terms' => [],
                'subjects'        => [],
            ]);
        }

        // ── Load assessments for this class + term ────────────────────────
        $assessments = Assessment::with(['subject'])
            ->where('class_section_id', $student->class_section_id)
            ->where('school_id', $schoolId)
            ->where('academic_term', $selectedTerm)
            ->get();

        // ── Load all grades for this student in one query ─────────────────
        $grades = StudentGrade::where('student_id', $student->id)
            ->whereIn('assessment_id', $assessments->pluck('id'))
            ->get()->keyBy('assessment_id');

        // ── Group by subject and build result rows ────────────────────────
        $bySubject = $assessments->groupBy('subject_id');

        $subjects = $bySubject->map(function ($subjectAssessments) use ($grades) {
            $subject = $subjectAssessments->first()->subject;

            // ALL CA assessments sorted by date — no limit (handles 2, 3, N CAs)
            $cas  = $subjectAssessments->where('category', 'CA')->sortBy('date')->values();
            $exam = $subjectAssessments->where('category', 'Exam')->first();

            // Build CA rows dynamically — each row has title, max, score
            $caRows = $cas->map(function ($ca) use ($grades) {
                $gradeRecord = $grades[$ca->id] ?? null;
                return [
                    'id'    => $ca->id,
                    'title' => $ca->title,
                    'max'   => $ca->max_marks,
                    'score' => $gradeRecord?->marks !== null ? (float) $gradeRecord->marks : null,
                ];
            })->values()->toArray();

            // Exam row
            $examGrade  = $exam ? ($grades[$exam->id] ?? null) : null;
            $examScore  = $examGrade?->marks !== null ? (float) $examGrade->marks : null;
            $examRemark = $examGrade?->remarks ?? '';
            $examMax    = $exam?->max_marks ?? 0;

            // Totals: sum ALL CA scores + exam
            $caTotal    = array_sum(array_map(fn($r) => $r['score'] ?? 0, $caRows));
            $caMax      = array_sum(array_map(fn($r) => $r['max'],         $caRows));
            $total      = $caTotal + ($examScore ?? 0);
            $totalMax   = $caMax   + $examMax;
            $pct        = $totalMax > 0 ? round(($total / $totalMax) * 100) : 0;

            // Teacher assignment
            $assignment = \App\Models\StaffSubjectAssignment::with('staff')
                ->where('subject_id', $subject?->id)
                ->where('class_section_id', $subjectAssessments->first()->class_section_id)
                ->first();

            $grade = $this->getGradeFromScale($pct);

            // For backward compat with frontend, still send ca1/ca2/midterm
            // AND send the full ca_rows array for detailed display
            $ca1 = $caRows[0] ?? null;
            $ca2 = $caRows[1] ?? null;

            return [
                'subject'    => $subject?->name ?? '—',
                'teacher'    => $assignment?->staff
                    ? ($assignment->staff->first_name . ' ' . $assignment->staff->last_name)
                    : '—',
                // Legacy fields (ca1/ca2/midterm) for backward compat
                'ca1'        => $ca1['score'] ?? null,
                'ca1_max'    => $ca1['max']   ?? 0,
                'ca1_title'  => $ca1['title'] ?? 'CA 1',
                'ca2'        => $ca2['score'] ?? null,
                'ca2_max'    => $ca2['max']   ?? 0,
                'ca2_title'  => $ca2['title'] ?? 'CA 2',
                'midterm'    => $examScore,
                'exam_max'   => $examMax,
                'exam_title' => $exam?->title ?? 'Exam',
                // Full CA breakdown for report card display
                'ca_rows'    => $caRows,
                'ca_total'   => $caTotal,
                'ca_max'     => $caMax,
                // Totals
                'total'      => $total,
                'total_max'  => $totalMax,
                'pct'        => $pct,
                'grade'      => $grade['grade'],
                'color'      => $grade['color'],
                'remark'     => $examRemark ?: $grade['remark'],
            ];
        })->values();

        return response()->json([
            'term'            => $selectedTerm,
            'available_terms' => $availableTerms->values(),
            'subjects'        => $subjects,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/portal/attendance?student_id=...
    |--------------------------------------------------------------------------
    */
    public function attendance(Request $request): JsonResponse
    {
        $student  = $this->resolveStudent($request);
        if (!$student) return response()->json(['message' => 'Student not found.'], 404);

        $schoolId = $request->user()->school_id;
        $records  = Attendance::with('subject')
            ->where('student_id', $student->id)
            ->where('school_id', $schoolId)
            ->get();

        $bySubject = $records->whereNotNull('subject_id')->groupBy('subject_id');
        $summary   = [];

        if ($bySubject->isEmpty()) {
            $daily = $records->whereNull('subject_id');
            $summary[] = [
                'subject' => 'General Attendance',
                'present' => $daily->where('status', 'present')->count(),
                'absent'  => $daily->where('status', 'absent')->count(),
                'late'    => $daily->where('status', 'late')->count(),
                'total'   => $daily->count(),
            ];
        } else {
            foreach ($bySubject as $subjectId => $subRecords) {
                $subjectName = $subRecords->first()->subject?->name ?? 'General';
                $summary[] = [
                    'subject' => $subjectName,
                    'present' => $subRecords->where('status', 'present')->count(),
                    'absent'  => $subRecords->where('status', 'absent')->count(),
                    'late'    => $subRecords->where('status', 'late')->count(),
                    'total'   => $subRecords->count(),
                ];
            }
        }

        $overallPct = $records->count() > 0
            ? round(($records->where('status', 'present')->count() / $records->count()) * 100)
            : 100;

        return response()->json([
            'summary'     => $summary,
            'overall_pct' => $overallPct,
            'total_days'  => $records->count(),
            'present'     => $records->where('status', 'present')->count(),
            'absent'      => $records->where('status', 'absent')->count(),
            'late'        => $records->where('status', 'late')->count(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/portal/fees?student_id=...
    |--------------------------------------------------------------------------
    */
    public function fees(Request $request): JsonResponse
    {
        $student  = $this->resolveStudent($request);
        if (!$student) return response()->json(['message' => 'Student not found.'], 404);

        $schoolId = (string) $request->user()->school_id;
        $termId = $this->resolveFeeTerm($request, $schoolId);

        $studentClassName = (string) ($student->section?->academicClass?->name ?? '');

        $feeTypes = FeeType::where('school_id', $schoolId)
            ->where('academic_term', $termId)
            ->orderBy('name')
            ->get()
            ->filter(fn (FeeType $feeType) => $this->feeAppliesToStudentClass((string) $feeType->applicable_class, $studentClassName))
            ->values();

        $feeBreakdown = $feeTypes->map(fn (FeeType $feeType) => [
            'label'  => (string) $feeType->name,
            'amount' => (float) $feeType->amount,
        ])->values();

        $totalDue = (float) $feeTypes->sum('amount');

        $paidAmountForTerm = (float) FeePayment::where('school_id', $schoolId)
            ->where('student_id', $student->id)
            ->where('academic_term', $termId)
            ->where('status', 'paid')
            ->sum('amount');

        $outstanding = max(0, $totalDue - $paidAmountForTerm);

        $payments = FeePayment::with('feeType')
            ->where('school_id', $schoolId)
            ->where('student_id', $student->id)
            ->orderByDesc('paid_at')
            ->orderByDesc('updated_at')
            ->get();

        $paymentHistory = $payments->where('status', 'paid')->map(fn (FeePayment $p) => [
            'date'   => $p->paid_at?->format('M d, Y') ?? $p->updated_at->format('M d, Y'),
            'desc'   => $p->feeType?->name ?? $p->description ?? 'Fee Payment',
            'amount' => (float) $p->amount,
            'method' => ucfirst(str_replace('_', ' ', $p->payment_method ?? 'cash')),
        ])->values();

        return response()->json([
            'total_due'       => $totalDue,
            'total_paid'      => $paidAmountForTerm,
            'outstanding'     => (float) $outstanding,
            'fee_breakdown'   => $feeBreakdown,
            'payment_history' => $paymentHistory,
            'is_paid_on_time' => (float) $outstanding <= 0,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Internal helpers
    |--------------------------------------------------------------------------
    */

    private function childRow(Student $s): array
    {
        return [
            'student_id'    => $s->student_id,
            'name'          => $s->first_name . ' ' . $s->last_name,
            'first_name'    => $s->first_name,
            'avatar'        => strtoupper(substr($s->first_name, 0, 1) . substr($s->last_name, 0, 1)),
            'class'         => $s->section?->academicClass?->name ?? '—',
            'section'       => $s->section?->name ?? '—',
            'class_section' => ($s->section?->academicClass?->name ?? '') . ($s->section?->name ?? ''),
            'level'         => $s->section?->academicClass?->level ?? '—',
            'admission_no'  => $s->admission_no,
            'status'        => $s->status,
        ];
    }

    private function formTeacher(int $sectionId, string $schoolId): string
    {
        $slot = \App\Models\TimetableSlot::with('staff')
            ->where('class_section_id', $sectionId)
            ->where('school_id', $schoolId)
            ->whereNotNull('staff_id')
            ->first();
        if (!$slot?->staff) return '—';
        return $slot->staff->first_name . ' ' . $slot->staff->last_name;
    }

    private function avgCaScore(int $studentId): string
    {
        $avg = StudentGrade::where('student_id', $studentId)->whereNotNull('marks')->avg('marks') ?? 0;
        return round($avg) . '%';
    }

    private function classPosition(int $studentId, int $sectionId, string $schoolId): int
    {
        $students = Student::where('class_section_id', $sectionId)->active()->pluck('id');
        $avgs     = StudentGrade::whereIn('student_id', $students)
            ->whereNotNull('marks')
            ->selectRaw('student_id, AVG(marks) as avg_marks')
            ->groupBy('student_id')
            ->orderByDesc('avg_marks')
            ->pluck('avg_marks', 'student_id');

        $pos = 1;
        foreach ($avgs as $id => $avg) {
            if ($id == $studentId) return $pos;
            $pos++;
        }
        return $pos;
    }


    /*
    |--------------------------------------------------------------------------
    | GET /api/portal/terms?student_id=...
    |--------------------------------------------------------------------------
    | Returns available academic terms for this student's class.
    | Used to populate the term selector in the portal result view.
    */
    public function terms(Request $request): JsonResponse
    {
        $student  = $this->resolveStudent($request);
        if (!$student) return response()->json([], 404);

        $schoolId = $request->user()->school_id;

        $terms = Assessment::where('class_section_id', $student->class_section_id)
            ->where('school_id', $schoolId)
            ->distinct()
            ->orderByDesc('academic_term')
            ->pluck('academic_term')
            ->values();

        return response()->json($terms);
    }

    private function getGradeFromScale(int $pct): array
    {
        // Nigerian WAEC/NECO grading scale — hardcoded since grading_scales table may be empty
        $scale = [
            ['lower' => 75, 'upper' => 100, 'grade' => 'A1', 'color' => '#10B981', 'remark' => 'EXCELLENT'],
            ['lower' => 70, 'upper' => 74,  'grade' => 'B2', 'color' => '#10B981', 'remark' => 'VERY GOOD'],
            ['lower' => 65, 'upper' => 69,  'grade' => 'B3', 'color' => '#22C55E', 'remark' => 'GOOD'],
            ['lower' => 60, 'upper' => 64,  'grade' => 'C4', 'color' => '#C9A020', 'remark' => 'CREDIT'],
            ['lower' => 55, 'upper' => 59,  'grade' => 'C5', 'color' => '#C9A020', 'remark' => 'CREDIT'],
            ['lower' => 50, 'upper' => 54,  'grade' => 'C6', 'color' => '#EAB308', 'remark' => 'CREDIT'],
            ['lower' => 45, 'upper' => 49,  'grade' => 'D7', 'color' => '#F97316', 'remark' => 'PASS'],
            ['lower' => 40, 'upper' => 44,  'grade' => 'E8', 'color' => '#F97316', 'remark' => 'PASS'],
            ['lower' => 0,  'upper' => 39,  'grade' => 'F9', 'color' => '#EF4444', 'remark' => 'FAIL'],
        ];
        foreach ($scale as $row) {
            if ($pct >= $row['lower'] && $pct <= $row['upper']) return $row;
        }
        return ['grade' => 'F9', 'color' => '#EF4444', 'remark' => 'FAIL'];
    }

    // Keep old signature for any other callers
    private function getGrade(int $pct, $gradingScale = null): array
    {
        return $this->getGradeFromScale($pct);
    }

    private function currentTerm(): string
    {
        $month = now()->month;
        return match(true) {
            $month <= 4  => '2nd Term',
            $month <= 8  => '3rd Term',
            default      => '1st Term',
        };
    }

    private function resolveFeeTerm(Request $request, string $schoolId): string
    {
        $termId = trim((string) ($request->query('term_id', $request->input('term_id', ''))));
        if ($termId !== '') {
            $term = AcademicTerm::where('school_id', $schoolId)->find($termId);
            if ($term) return (string) $term->id;
        }

        $activeTerm = AcademicTerm::where('school_id', $schoolId)
            ->where(function ($query) {
                $query->where('is_active', true)
                    ->orWhere('status', 'Active');
            })
            ->orderByDesc('is_active')
            ->orderByDesc('academic_year')
            ->orderBy('name')
            ->first();

        if ($activeTerm) return (string) $activeTerm->id;

        return $this->fallbackFeeTermKey();
    }

    private function feeAppliesToStudentClass(string $applicableClass, string $studentClassName): bool
    {
        $app = strtolower(trim($applicableClass));
        $cls = strtolower(trim($studentClassName));

        if ($app === '') return false;
        if ($app === 'all classes' || $app === 'all grades') return true;
        if ($cls === '') return false;

        if ($app === $cls) return true;
        if (str_contains($app, $cls)) return true;
        if (str_contains($cls, $app)) return true;

        return false;
    }

    private function fallbackFeeTermKey(): string
    {
        $month = now()->month;
        $year  = now()->year;
        $term  = match(true) {
            $month <= 4  => 'Term 2',
            $month <= 8  => 'Term 3',
            default      => 'Term 1',
        };
        return "{$year}/{$term}";
    }

    private function currentSession(): string
    {
        $year = now()->year;
        return $year . '/' . ($year + 1);
    }
}
// NOTE: The above file already has all methods. This is appended separately.
