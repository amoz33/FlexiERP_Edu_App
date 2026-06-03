<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\Attendance;
use App\Models\FeePayment;
use App\Models\FeeType;
use App\Models\GradingScale;
use App\Models\Student;
use App\Models\StudentGrade;
use App\Models\Subject;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentPortalController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Helper: get authenticated student record
    |--------------------------------------------------------------------------
    */
    private function getStudent(Request $request): ?Student
    {
        return Student::with(['section.academicClass'])
            ->where('user_id', $request->user()->id)
            ->first();
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/portal/dashboard
    |--------------------------------------------------------------------------
    | Summary stats for student/parent dashboard
    */
    public function dashboard(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $student  = $this->getStudent($request);

        if (!$student) {
            return response()->json(['message' => 'Student record not found.'], 404);
        }

        // Attendance summary
        $totalDays  = Attendance::where('student_id', $student->id)->count();
        $presentDays = Attendance::where('student_id', $student->id)->where('status', 'present')->count();
        $attendancePct = $totalDays > 0 ? round(($presentDays / $totalDays) * 100) : 0;

        // Average score from all grades
        $avgScore = StudentGrade::where('student_id', $student->id)
            ->whereNotNull('marks')
            ->avg('marks') ?? 0;

        // Upcoming assessments
        $upcomingAssessments = Assessment::with('subject')
            ->where('class_section_id', $student->class_section_id)
            ->where('status', 'upcoming')
            ->where('school_id', $schoolId)
            ->orderBy('date')
            ->limit(3)
            ->get()
            ->map(fn($a) => [
                'id'       => (string) $a->id,
                'title'    => $a->title,
                'type'     => $a->type,
                'subject'  => $a->subject?->name ?? '—',
                'date'     => $a->date->format('M d, Y'),
                'maxMarks' => $a->max_marks,
            ]);

        // Outstanding fees
        $outstandingFees = FeePayment::where('student_id', $student->id)
            ->whereIn('status', ['pending', 'overdue'])
            ->sum('expected_amount');

        // Recent notices (use ActivityLog)
        $recentActivity = \App\Models\ActivityLog::where('school_id', $schoolId)
            ->latest()
            ->limit(3)
            ->get()
            ->map(fn($a) => [
                'title'    => $a->title,
                'desc'     => $a->description,
                'type'     => $a->type,
                'time'     => $this->humanTime($a->created_at),
            ]);

        return response()->json([
            'student' => [
                'name'         => $student->first_name . ' ' . $student->last_name,
                'student_id'   => $student->student_id,
                'class'        => $student->section?->academicClass?->name ?? '—',
                'section'      => $student->section?->name ?? '—',
                'admission_no' => $student->admission_no,
            ],
            'stats' => [
                'attendance_pct'   => $attendancePct,
                'avg_score'        => round($avgScore, 1),
                'outstanding_fees' => $outstandingFees,
                'upcoming_tests'   => $upcomingAssessments->count(),
            ],
            'upcoming_assessments' => $upcomingAssessments,
            'recent_activity'      => $recentActivity,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/portal/subjects
    |--------------------------------------------------------------------------
    | Student's subjects with CA scores
    | Maps to SubjectsView: ca1, ca2, midterm scores per subject
    */
    public function subjects(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $student  = $this->getStudent($request);

        if (!$student) return response()->json(['message' => 'Student record not found.'], 404);

        // Get all assessments for this student's section
        $assessments = Assessment::with('subject')
            ->where('class_section_id', $student->class_section_id)
            ->where('school_id', $schoolId)
            ->get();

        // Get student's grades
        $grades = StudentGrade::where('student_id', $student->id)
            ->whereIn('assessment_id', $assessments->pluck('id'))
            ->get()
            ->keyBy('assessment_id');

        // Group by subject
        $bySubject = $assessments->groupBy('subject_id');

        $gradingScale = GradingScale::where('school_id', $schoolId)->get();

        $subjects = $bySubject->map(function ($subjectAssessments) use ($grades, $gradingScale) {
            $subject = $subjectAssessments->first()->subject;

            // Map assessments to CA1, CA2, Midterm/Exam slots
            $cas  = $subjectAssessments->where('category', 'CA')->sortBy('date')->values();
            $exam = $subjectAssessments->where('category', 'Exam')->first();

            $ca1     = $cas->get(0);
            $ca2     = $cas->get(1);
            $midterm = $exam ?? $cas->get(2);

            $ca1Score     = $ca1     ? (float) ($grades[$ca1->id]?->marks     ?? 0) : 0;
            $ca2Score     = $ca2     ? (float) ($grades[$ca2->id]?->marks     ?? 0) : 0;
            $midtermScore = $midterm ? (float) ($grades[$midterm->id]?->marks ?? 0) : 0;

            // Normalise to percentage
            $ca1Max     = $ca1?->max_marks     ?? 10;
            $ca2Max     = $ca2?->max_marks     ?? 10;
            $midtermMax = $midterm?->max_marks ?? 70;
            $totalMax   = $ca1Max + $ca2Max + $midtermMax;
            $total      = $ca1Score + $ca2Score + $midtermScore;
            $pct        = $totalMax > 0 ? round(($total / $totalMax) * 100) : 0;

            // Find teacher for this subject from assignments
            $assignment = \App\Models\StaffSubjectAssignment::with('staff')
                ->where('subject_id', $subject->id)
                ->first();

            $grade = $this->getGrade($pct, $gradingScale);

            return [
                'subject'   => $subject?->name ?? '—',
                'teacher'   => $assignment?->staff?->first_name . ' ' . $assignment?->staff?->last_name,
                'ca1'       => (int) $ca1Score,
                'ca2'       => (int) $ca2Score,
                'midterm'   => (int) $midtermScore,
                'total'     => $total,
                'total_max' => $totalMax,
                'pct'       => $pct,
                'grade'     => $grade['grade'],
                'color'     => $grade['color'],
                'remark'    => $grade['remark'],
            ];
        })->values();

        return response()->json($subjects);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/portal/attendance
    |--------------------------------------------------------------------------
    | Student attendance summary per subject
    | Maps to AttendanceView: subject, present, absent, late, total
    */
    public function attendance(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $student  = $this->getStudent($request);

        if (!$student) return response()->json(['message' => 'Student record not found.'], 404);

        // Get attendance grouped by subject
        $records = Attendance::with('subject')
            ->where('student_id', $student->id)
            ->where('school_id', $schoolId)
            ->whereNotNull('subject_id')
            ->get()
            ->groupBy('subject_id');

        // Also get daily attendance (no subject)
        $daily = Attendance::where('student_id', $student->id)
            ->where('school_id', $schoolId)
            ->whereNull('subject_id')
            ->get();

        $summary = [];

        if ($records->isEmpty() && $daily->isNotEmpty()) {
            // Fall back to daily attendance summary
            $summary[] = [
                'subject' => 'General Attendance',
                'present' => $daily->where('status', 'present')->count(),
                'absent'  => $daily->where('status', 'absent')->count(),
                'late'    => $daily->where('status', 'late')->count(),
                'total'   => $daily->count(),
            ];
        } else {
            foreach ($records as $subjectId => $attendanceRecords) {
                $subject = $attendanceRecords->first()->subject;
                $summary[] = [
                    'subject' => $subject?->name ?? 'General',
                    'present' => $attendanceRecords->where('status', 'present')->count(),
                    'absent'  => $attendanceRecords->where('status', 'absent')->count(),
                    'late'    => $attendanceRecords->where('status', 'late')->count(),
                    'total'   => $attendanceRecords->count(),
                ];
            }
        }

        // Overall stats
        $allRecords  = Attendance::where('student_id', $student->id)->where('school_id', $schoolId)->get();
        $overallPct  = $allRecords->count() > 0
            ? round(($allRecords->where('status', 'present')->count() / $allRecords->count()) * 100)
            : 0;

        return response()->json([
            'summary'     => $summary,
            'overall_pct' => $overallPct,
            'total_days'  => $allRecords->count(),
            'present'     => $allRecords->where('status', 'present')->count(),
            'absent'      => $allRecords->where('status', 'absent')->count(),
            'late'        => $allRecords->where('status', 'late')->count(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/portal/fees
    |--------------------------------------------------------------------------
    | Student fee breakdown and payment history
    | Maps to FeesView
    */
    public function fees(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $student  = $this->getStudent($request);

        if (!$student) return response()->json(['message' => 'Student record not found.'], 404);

        $payments = FeePayment::with('feeType')
            ->where('student_id', $student->id)
            ->orderByDesc('created_at')
            ->get();

        $currentTermPayments = $payments->take(5); // current term items

        $totalDue       = $currentTermPayments->sum('expected_amount');
        $totalPaid      = $payments->where('status', 'paid')->sum('amount');
        $outstanding    = max(0, $totalDue - $totalPaid);

        // Fee breakdown for current term
        $feeBreakdown = $currentTermPayments->map(fn($p) => [
            'label'  => $p->feeType?->name ?? $p->description ?? 'Fee',
            'amount' => $p->expected_amount,
            'status' => ucfirst($p->status),
        ]);

        // Payment history (paid only)
        $paymentHistory = $payments->where('status', 'paid')->map(fn($p) => [
            'date'   => $p->paid_at?->format('M d, Y') ?? $p->updated_at->format('M d, Y'),
            'desc'   => $p->feeType?->name ?? $p->description ?? 'Fee Payment',
            'amount' => $p->amount,
            'method' => ucfirst(str_replace('_', ' ', $p->payment_method ?? 'cash')),
        ])->values();

        return response()->json([
            'total_due'       => $totalDue,
            'total_paid'      => $totalPaid,
            'outstanding'     => $outstanding,
            'fee_breakdown'   => $feeBreakdown,
            'payment_history' => $paymentHistory,
            'is_paid_on_time' => $payments->where('status', 'paid')->isNotEmpty(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Internal helpers
    |--------------------------------------------------------------------------
    */

    private function getGrade(int $pct, $gradingScale): array
    {
        $match = $gradingScale->first(fn($g) => $pct >= $g->lower_bound && $pct <= $g->upper_bound);
        return [
            'grade'  => $match?->grade  ?? 'F9',
            'color'  => $match?->color  ?? '#EF4444',
            'remark' => $match?->remark ?? 'FAIL',
        ];
    }

    private function humanTime(Carbon $date): string
    {
        $mins = $date->diffInMinutes(now());
        if ($mins < 60) return $mins . ' mins ago';
        $hours = $date->diffInHours(now());
        if ($hours < 24) return $hours . 'h ago';
        if ($date->isYesterday()) return 'Yesterday';
        return $date->format('M d');
    }
}
