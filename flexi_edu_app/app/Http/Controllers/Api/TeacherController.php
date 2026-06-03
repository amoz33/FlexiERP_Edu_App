<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\Attendance;
use App\Models\ClassSection;
use App\Models\Conversation;
use App\Models\LessonPlan;
use App\Models\Message;
use App\Models\Staff;
use App\Models\StaffSubjectAssignment;
use App\Models\Student;
use App\Models\StudentGrade;
use App\Models\TimetableSlot;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Helper: get the authenticated teacher's staff record
    |--------------------------------------------------------------------------
    */
    private function getStaff(Request $request): ?Staff
    {
        return Staff::where('user_id', $request->user()->id)->first();
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/teacher/dashboard
    |--------------------------------------------------------------------------
    | Stats + today's schedule + pending attendance + upcoming assessments
    */
    public function dashboard(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $staff    = $this->getStaff($request);

        if (!$staff) {
            return response()->json(['message' => 'Staff record not found.'], 404);
        }

        $today    = today()->toDateString();
        $dayName  = now()->format('l'); // Monday, Tuesday...

        // ── Today's schedule ─────────────────────────────────────────────────
        $todaySlots = TimetableSlot::with(['subject', 'section'])
            ->where('staff_id', $staff->id)
            ->where('day', $dayName)
            ->where('school_id', $schoolId)
            ->orderBy('start_time')
            ->get()
            ->map(fn($slot) => [
                'id'      => (string) $slot->id,
                'time'    => Carbon::parse($slot->start_time)->format('h:i A'),
                'subject' => $slot->subject?->name ?? $slot->label ?? 'Break',
                'group'   => $slot->section?->full_name ?? '—',
                'room'    => $slot->room ?? '—',
                'status'  => $this->slotStatus($slot->start_time, $slot->end_time),
                'type'    => $slot->slot_type,
                'label'   => $slot->label,
            ]);

        // ── Pending attendance (sections where attendance not taken today) ───
        $myAssignments = StaffSubjectAssignment::with('section')
            ->where('staff_id', $staff->id)
            ->where('school_id', $schoolId)
            ->get();

        $pendingAttendance = $myAssignments->filter(function ($assignment) use ($today, $schoolId) {
            $sectionStudentIds = Student::where('class_section_id', $assignment->class_section_id)
                ->active()
                ->pluck('id');

            if ($sectionStudentIds->isEmpty()) return false;

            $attended = Attendance::where('school_id', $schoolId)
                ->whereIn('student_id', $sectionStudentIds)
                ->whereDate('date', $today)
                ->exists();

            return !$attended;
        })->values()->map(fn($a) => [
            'id'       => (string) $a->id,
            'group'    => $a->section?->full_name ?? '—',
            'subject'  => $a->subject?->name ?? '—',
            'date'     => $today,
            'students' => Student::where('class_section_id', $a->class_section_id)->active()->count(),
        ]);

        // ── Upcoming assessments ──────────────────────────────────────────────
        $upcomingAssessments = Assessment::with(['subject', 'section'])
            ->where('staff_id', $staff->id)
            ->where('school_id', $schoolId)
            ->where('status', 'upcoming')
            ->orderBy('date')
            ->limit(5)
            ->get()
            ->map(fn($a) => [
                'id'       => (string) $a->id,
                'title'    => $a->title,
                'type'     => $a->type,
                'group'    => $a->section?->full_name ?? '—',
                'group_id' => (string) $a->class_section_id,
                'date'     => $a->date->toDateString(),
                'maxMarks' => $a->max_marks,
            ]);

        // ── Summary stats ─────────────────────────────────────────────────────
        $totalStudents = StaffSubjectAssignment::where('staff_id', $staff->id)
            ->where('school_id', $schoolId)
            ->with('section')
            ->get()
            ->pluck('class_section_id')
            ->unique()
            ->sum(fn($secId) => Student::where('class_section_id', $secId)->active()->count());

        $attendanceRate = $this->teacherAttendanceRate($staff->id, $schoolId);
        $pendingGrading = Assessment::where('staff_id', $staff->id)
            ->where('school_id', $schoolId)
            ->where('status', 'grading')
            ->count();

        return response()->json([
            'stats' => [
                'total_classes'   => $todaySlots->where('type', 'lesson')->count(),
                'total_students'  => $totalStudents,
                'attendance_rate' => $attendanceRate,
                'pending_grading' => $pendingGrading,
                'teacher_name'    => $staff->first_name . ' ' . $staff->last_name,
            ],
            'today_schedule'       => $todaySlots,
            'pending_attendance'   => $pendingAttendance,
            'upcoming_assessments' => $upcomingAssessments,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/teacher/schedule?day=Monday
    |--------------------------------------------------------------------------
    | Full weekly or day schedule
    */
    public function schedule(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $staff    = $this->getStaff($request);

        if (!$staff) return response()->json(['message' => 'Staff record not found.'], 404);

        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        $weekly = [];
        foreach ($days as $day) {
            $slots = TimetableSlot::with(['subject', 'section'])
                ->where('staff_id', $staff->id)
                ->where('day', $day)
                ->where('school_id', $schoolId)
                ->orderBy('start_time')
                ->get()
                ->map(fn($slot) => [
                    'id'      => (string) $slot->id,
                    'time'    => Carbon::parse($slot->start_time)->format('h:i A'),
                    'subject' => $slot->subject?->name ?? '',
                    'group'   => $slot->section?->full_name ?? '',
                    'room'    => $slot->room ?? '',
                    'batch'   => null,
                    'type'    => $slot->slot_type !== 'lesson' ? $slot->slot_type : null,
                    'label'   => $slot->label,
                ]);
            $weekly[$day] = $slots;
        }

        return response()->json($weekly);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/teacher/groups
    |--------------------------------------------------------------------------
    | Teacher's assigned class sections (groups)
    */
    public function groups(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $staff    = $this->getStaff($request);

        if (!$staff) return response()->json(['message' => 'Staff record not found.'], 404);

        $assignments = StaffSubjectAssignment::with(['section.academicClass', 'subject'])
            ->where('staff_id', $staff->id)
            ->where('school_id', $schoolId)
            ->get();

        $groups = $assignments->map(fn($a) => [
            'id'           => (string) $a->class_section_id,
            'name'         => $a->section?->full_name ?? '—',
            'section'      => $a->section?->name ?? '—',
            'subject'      => $a->subject?->name ?? '—',
            'studentCount' => Student::where('class_section_id', $a->class_section_id)->active()->count(),
        ])->unique('id')->values();

        return response()->json($groups);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/teacher/groups/{sectionId}/students
    |--------------------------------------------------------------------------
    | Students in a specific group
    */
    public function groupStudents(Request $request, $sectionId): JsonResponse
    {
        $schoolId = $request->user()->school_id;

        $students = Student::where('class_section_id', $sectionId)
            ->where('school_id', $schoolId)
            ->active()
            ->orderBy('first_name')
            ->get()
            ->map(fn($s) => [
                'id'     => (string) $s->id,
                'name'   => $s->first_name . ' ' . $s->last_name,
                'avatar' => strtoupper(substr($s->first_name, 0, 1) . substr($s->last_name, 0, 1)),
                'rollNo' => $s->student_id,
                'email'  => $s->email,
            ]);

        return response()->json($students);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/teacher/assessments?section_id=1
    |--------------------------------------------------------------------------
    */
    public function assessments(Request $request): JsonResponse
    {
        $schoolId  = $request->user()->school_id;
        $staff     = $this->getStaff($request);
        $sectionId = $request->query('section_id');

        if (!$staff) return response()->json(['message' => 'Staff record not found.'], 404);

        $query = Assessment::with(['subject', 'section'])
            ->where('staff_id', $staff->id)
            ->where('school_id', $schoolId);

        if ($sectionId) $query->where('class_section_id', $sectionId);

        $assessments = $query->orderByDesc('date')->get()->map(fn($a) => [
            'id'       => (string) $a->id,
            'title'    => $a->title,
            'type'     => $a->type,
            'category' => $a->category,
            'group'    => $a->section?->full_name ?? '—',
            'group_id' => (string) $a->class_section_id,
            'subject'  => $a->subject?->name ?? '—',
            'date'     => $a->date->toDateString(),
            'maxMarks' => $a->max_marks,
            'weight'   => $a->weight,
            'status'   => $a->status,
        ]);

        return response()->json($assessments);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/teacher/assessments/{id}/grades
    |--------------------------------------------------------------------------
    | Student grades for a specific assessment
    */
    public function assessmentGrades(Request $request, Assessment $assessment): JsonResponse
    {
        $students = Student::where('class_section_id', $assessment->class_section_id)
            ->active()
            ->orderBy('first_name')
            ->get();

        $grades = StudentGrade::where('assessment_id', $assessment->id)
            ->pluck('remarks', 'student_id')
            ->toArray();
        $marks = StudentGrade::where('assessment_id', $assessment->id)
            ->pluck('marks', 'student_id')
            ->toArray();

        $data = $students->map(fn($s) => [
            'student_id' => (string) $s->id,
            'name'       => $s->first_name . ' ' . $s->last_name,
            'avatar'     => strtoupper(substr($s->first_name, 0, 1) . substr($s->last_name, 0, 1)),
            'marks'      => $marks[$s->id] ?? null,
            'remarks'    => $grades[$s->id] ?? '',
        ]);

        return response()->json($data);
    }

    /*
    |--------------------------------------------------------------------------
    | POST /api/teacher/assessments/{id}/grades
    |--------------------------------------------------------------------------
    | Save grades for an assessment
    */
    public function saveGrades(Request $request, Assessment $assessment): JsonResponse
    {
        $request->validate([
            'grades'              => 'required|array',
            'grades.*.student_id' => 'required',
            'grades.*.marks'      => 'nullable|numeric|min:0',
            'grades.*.remarks'    => 'nullable|string|max:500',
        ]);

        foreach ($request->grades as $grade) {
            if ($grade['marks'] === null) continue;
            StudentGrade::updateOrCreate(
                ['assessment_id' => $assessment->id, 'student_id' => $grade['student_id']],
                ['marks' => $grade['marks'], 'remarks' => $grade['remarks'] ?? '', 'school_id' => $request->user()->school_id]
            );
        }

        // Update assessment status to completed if all graded
        $totalStudents = Student::where('class_section_id', $assessment->class_section_id)->active()->count();
        $gradedCount   = StudentGrade::where('assessment_id', $assessment->id)->whereNotNull('marks')->count();
        if ($gradedCount >= $totalStudents) {
            $assessment->update(['status' => 'completed']);
        }

        return response()->json(['message' => 'Grades saved successfully.']);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/teacher/performance?section_id=1
    |--------------------------------------------------------------------------
    | Class performance analytics
    */
    public function performance(Request $request): JsonResponse
    {
        $schoolId  = $request->user()->school_id;
        $staff     = $this->getStaff($request);
        $sectionId = $request->query('section_id');

        if (!$staff) return response()->json(['message' => 'Staff record not found.'], 404);

        // Get sections for this teacher
        $sectionIds = StaffSubjectAssignment::where('staff_id', $staff->id)
            ->where('school_id', $schoolId)
            ->pluck('class_section_id')
            ->unique();

        if ($sectionId) $sectionIds = collect([$sectionId]);

        $students = Student::whereIn('class_section_id', $sectionIds)
            ->where('school_id', $schoolId)
            ->active()
            ->get();

        $studentIds = $students->pluck('id');

        // Average score per student
        $avgScores = StudentGrade::whereIn('student_id', $studentIds)
            ->whereNotNull('marks')
            ->selectRaw('student_id, AVG(marks) as avg_marks, COUNT(*) as count')
            ->groupBy('student_id')
            ->pluck('avg_marks', 'student_id');

        // Top performers
        $topPerformers = $students->map(fn($s) => [
            'id'       => (string) $s->id,
            'name'     => $s->first_name . ' ' . $s->last_name,
            'group'    => $s->section?->full_name ?? '—',
            'avgScore' => round($avgScores[$s->id] ?? 0, 1),
            'trend'    => 'stable',
        ])->sortByDesc('avgScore')->values()->take(8);

        // At risk students (avg < 50 OR attendance < 75%)
        $attendanceRates = Attendance::where('school_id', $schoolId)
            ->whereIn('student_id', $studentIds)
            ->selectRaw('student_id, COUNT(*) as total, SUM(status = "present") as present')
            ->groupBy('student_id')
            ->get()
            ->mapWithKeys(fn($a) => [$a->student_id => $a->total > 0 ? round(($a->present / $a->total) * 100) : 100]);

        $atRisk = $students->filter(function ($s) use ($avgScores, $attendanceRates) {
            $avg  = $avgScores[$s->id] ?? 100;
            $att  = $attendanceRates[$s->id] ?? 100;
            return $avg < 50 || $att < 75;
        })->map(fn($s) => [
            'id'             => (string) $s->id,
            'name'           => $s->first_name . ' ' . $s->last_name,
            'group'          => $s->section?->full_name ?? '—',
            'avgScore'       => round($avgScores[$s->id] ?? 0),
            'attendanceRate' => $attendanceRates[$s->id] ?? 0,
            'issue'          => $this->riskReason($avgScores[$s->id] ?? 0, $attendanceRates[$s->id] ?? 0),
        ])->values()->take(5);

        // Weekly attendance summary (last 5 weeks)
        $weeklyAttendance = $this->weeklyAttendanceSummary($studentIds->toArray(), $schoolId);

        // Overall stats
        $overallAvg = $avgScores->avg() ?? 0;
        $overallAtt = $attendanceRates->avg() ?? 0;

        return response()->json([
            'stats' => [
                'avg_score'       => round($overallAvg, 1),
                'attendance_rate' => round($overallAtt) . '%',
                'top_performers'  => $topPerformers->count(),
                'at_risk'         => $atRisk->count(),
            ],
            'top_performers'    => $topPerformers,
            'at_risk'           => $atRisk,
            'weekly_attendance' => $weeklyAttendance,
            'score_trends'      => $this->scoreTrends($studentIds->toArray(), $schoolId),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/teacher/lesson-plans
    |--------------------------------------------------------------------------
    */
    public function lessonPlans(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $staff    = $this->getStaff($request);

        if (!$staff) return response()->json(['message' => 'Staff record not found.'], 404);

        $plans = LessonPlan::with(['subject', 'section'])
            ->where('staff_id', $staff->id)
            ->where('school_id', $schoolId)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($p) => [
                'id'         => (string) $p->id,
                'title'      => $p->title,
                'subject'    => $p->subject?->name ?? '—',
                'group'      => $p->section?->full_name ?? '—',
                'week'       => $p->week_label,
                'day'        => $p->day,
                'period'     => $p->period_number,
                'duration'   => $p->duration,
                'objectives' => $p->objectives,
                'activities' => $p->activities,
                'resources'  => $p->resources,
                'homework'   => $p->homework,
                'status'     => $p->status,
                'createdAt'  => $p->created_at->toDateString(),
            ]);

        return response()->json($plans);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/teacher/messages
    |--------------------------------------------------------------------------
    */
    public function messages(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $staff    = $this->getStaff($request);

        if (!$staff) return response()->json(['message' => 'Staff record not found.'], 404);

        $conversations = Conversation::with(['student', 'messages' => fn($q) => $q->latest()->limit(1)])
            ->where('staff_id', $staff->id)
            ->where('school_id', $schoolId)
            ->orderByDesc('updated_at')
            ->get()
            ->map(function ($conv) {
                $lastMsg    = $conv->messages->first();
                $unread     = Message::where('conversation_id', $conv->id)
                    ->where('sender_type', 'parent')
                    ->where('is_read', false)
                    ->count();

                $student    = $conv->student;
                $parentName = $student?->parent_name ?? 'Parent';
                $initials   = collect(explode(' ', $parentName))->map(fn($n) => strtoupper(substr($n, 0, 1)))->join('');

                return [
                    'id'            => (string) $conv->id,
                    'parentId'      => 'par_' . $conv->student_id,
                    'parentName'    => $parentName,
                    'parentAvatar'  => substr($initials, 0, 2),
                    'studentName'   => $student ? $student->first_name . ' ' . $student->last_name : '—',
                    'studentGroup'  => $student?->section?->full_name ?? '—',
                    'lastMessage'   => $lastMsg?->body ?? '',
                    'lastTimestamp' => $conv->updated_at->toIso8601String(),
                    'unreadCount'   => $unread,
                    'messages'      => $this->formatMessages($conv),
                ];
            });

        return response()->json($conversations);
    }

    /*
    |--------------------------------------------------------------------------
    | POST /api/teacher/messages
    |--------------------------------------------------------------------------
    | Send a message in a conversation
    */
    public function sendMessage(Request $request): JsonResponse
    {
        $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'body'            => 'required|string',
            'subject'         => 'nullable|string',
        ]);

        $staff = $this->getStaff($request);

        $message = Message::create([
            'conversation_id' => $request->conversation_id,
            'sender_type'     => 'staff',
            'sender_id'       => $staff->id,
            'subject'         => $request->subject ?? 'Re: Message',
            'body'            => $request->body,
            'is_read'         => false,
            'school_id'       => $request->user()->school_id,
        ]);

        // Touch conversation updated_at
        Conversation::find($request->conversation_id)->touch();

        return response()->json([
            'id'          => (string) $message->id,
            'senderId'    => 'teacher_' . $staff->id,
            'senderName'  => $staff->first_name . ' ' . $staff->last_name,
            'senderRole'  => 'teacher',
            'senderAvatar'=> strtoupper(substr($staff->first_name, 0, 1) . substr($staff->last_name, 0, 1)),
            'body'        => $message->body,
            'timestamp'   => $message->created_at->toIso8601String(),
            'read'        => true,
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | Internal helpers
    |--------------------------------------------------------------------------
    */

    private function slotStatus(string $start, string $end): string
    {
        $now       = now();
        $startTime = Carbon::parse($start);
        $endTime   = Carbon::parse($end);

        if ($now->gt($endTime))   return 'completed';
        if ($now->gte($startTime)) return 'live';
        return 'upcoming';
    }

    private function teacherAttendanceRate(int $staffId, string $schoolId): int
    {
        $sectionIds = StaffSubjectAssignment::where('staff_id', $staffId)
            ->where('school_id', $schoolId)
            ->pluck('class_section_id')
            ->unique();

        $studentIds = Student::whereIn('class_section_id', $sectionIds)
            ->active()
            ->pluck('id');

        if ($studentIds->isEmpty()) return 0;

        $total   = Attendance::where('school_id', $schoolId)->whereIn('student_id', $studentIds)->count();
        $present = Attendance::where('school_id', $schoolId)->whereIn('student_id', $studentIds)->where('status', 'present')->count();

        return $total > 0 ? round(($present / $total) * 100) : 0;
    }

    private function weeklyAttendanceSummary(array $studentIds, string $schoolId): array
    {
        $weeks = [];
        for ($i = 4; $i >= 0; $i--) {
            $start = now()->subWeeks($i)->startOfWeek();
            $end   = now()->subWeeks($i)->endOfWeek();
            $label = 'W' . (5 - $i);

            $present = Attendance::where('school_id', $schoolId)
                ->whereIn('student_id', $studentIds)
                ->whereBetween('date', [$start, $end])
                ->where('status', 'present')
                ->count();

            $absent = Attendance::where('school_id', $schoolId)
                ->whereIn('student_id', $studentIds)
                ->whereBetween('date', [$start, $end])
                ->where('status', 'absent')
                ->count();

            $weeks[] = ['week' => $label, 'present' => $present, 'absent' => $absent];
        }
        return $weeks;
    }

    private function scoreTrends(array $studentIds, string $schoolId): array
    {
        $months = [];
        for ($i = 4; $i >= 0; $i--) {
            $month  = now()->subMonths($i);
            $label  = $month->format('M');
            $start  = $month->startOfMonth()->toDateString();
            $end    = $month->endOfMonth()->toDateString();

            $avg = StudentGrade::whereIn('student_id', $studentIds)
                ->whereNotNull('marks')
                ->whereHas('assessment', fn($q) => $q->whereBetween('date', [$start, $end]))
                ->avg('marks') ?? 0;

            $attTotal   = Attendance::where('school_id', $schoolId)->whereIn('student_id', $studentIds)->whereBetween('date', [$start, $end])->count();
            $attPresent = Attendance::where('school_id', $schoolId)->whereIn('student_id', $studentIds)->whereBetween('date', [$start, $end])->where('status', 'present')->count();
            $attPct     = $attTotal > 0 ? round(($attPresent / $attTotal) * 100) : 0;

            $months[] = ['month' => $label, 'avgScore' => round($avg, 1), 'attendance' => $attPct];
        }
        return $months;
    }

    private function riskReason(float $avgScore, float $attendanceRate): string
    {
        if ($avgScore < 50 && $attendanceRate < 75) return 'Low scores & attendance';
        if ($avgScore < 50) return 'Declining performance';
        return 'Frequent absences';
    }

    private function formatMessages(Conversation $conv): array
    {
        return $conv->messages->map(function ($msg) use ($conv) {
            $isStaff = $msg->sender_type === 'staff';
            $staff   = $isStaff ? Staff::find($msg->sender_id) : null;
            $student = !$isStaff ? $conv->student : null;

            return [
                'id'           => (string) $msg->id,
                'senderId'     => $msg->sender_type . '_' . $msg->sender_id,
                'senderName'   => $isStaff ? ($staff?->first_name . ' ' . $staff?->last_name) : ($student?->parent_name ?? 'Parent'),
                'senderRole'   => $isStaff ? 'teacher' : 'parent',
                'senderAvatar' => $isStaff
                    ? strtoupper(substr($staff?->first_name ?? 'T', 0, 1) . substr($staff?->last_name ?? '', 0, 1))
                    : substr(collect(explode(' ', $student?->parent_name ?? 'P'))->map(fn($n) => strtoupper(substr($n, 0, 1)))->join(''), 0, 2),
                'recipientId'   => $isStaff ? 'par_' . $conv->student_id : 'teacher_' . $conv->staff_id,
                'recipientName' => $isStaff ? ($student?->parent_name ?? 'Parent') : ($staff?->first_name . ' ' . $staff?->last_name),
                'subject'       => $msg->subject,
                'body'          => $msg->body,
                'timestamp'     => $msg->created_at->toIso8601String(),
                'read'          => $msg->is_read,
            ];
        })->toArray();
    }
}
