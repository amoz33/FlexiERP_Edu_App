<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Attendance;
use App\Models\FeePayment;
use App\Models\Staff;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET /api/dashboard/overview
    |--------------------------------------------------------------------------
    | Returns all stat card data for the admin dashboard.
    | Scoped to the authenticated user's school_id.
    */

    public function overview(Request $request): JsonResponse
    {
        $schoolId   = $request->user()->school_id;
        $currentTerm = $this->currentTerm();

        // ── Students ────────────────────────────────────────────────────────
        $totalStudents     = Student::forSchool($schoolId)->active()->count();
        $lastTermStudents  = Student::forSchool($schoolId)
            ->active()
            ->where('enrollment_date', '<', now()->subMonths(4))
            ->count();

        $studentChange = $this->percentageChange($lastTermStudents, $totalStudents);

        // ── Staff ───────────────────────────────────────────────────────────
        $totalStaff     = Staff::forSchool($schoolId)->active()->count();
        $lastMonthStaff = Staff::forSchool($schoolId)
            ->active()
            ->where('hire_date', '<', now()->subMonth())
            ->count();

        $staffChange = $totalStaff === $lastMonthStaff
            ? 'No change'
            : $this->percentageChange($lastMonthStaff, $totalStaff) . ' vs last month';

        // ── Revenue ─────────────────────────────────────────────────────────
        $termPayments = FeePayment::forSchool($schoolId)
            ->forTerm($currentTerm)
            ->get();

        $termRevenue      = $termPayments->sum('amount');
        $expectedRevenue  = $termPayments->sum('expected_amount');
        $collectedPct     = $expectedRevenue > 0
            ? round(($termRevenue / $expectedRevenue) * 100)
            : 0;

        // Compare with previous term
        $prevTerm         = $this->previousTerm();
        $prevTermRevenue  = FeePayment::forSchool($schoolId)->forTerm($prevTerm)->sum('amount');
        $revenueChange    = $this->percentageChange($prevTermRevenue, $termRevenue) . ' vs last term';

        // ── Attendance ──────────────────────────────────────────────────────
        $todayRecords   = Attendance::forSchool($schoolId)->today()->get();
        $presentCount   = $todayRecords->where('status', 'present')->count();
        $absentCount    = $todayRecords->where('status', 'absent')->count();
        $lateCount      = $todayRecords->where('status', 'late')->count();
        $totalToday     = $todayRecords->count();

        $attendancePct  = $totalToday > 0
            ? round(($presentCount / $totalToday) * 100, 1)
            : 0.0;

        // Yesterday's attendance for comparison
        $yesterdayTotal   = Attendance::forSchool($schoolId)
            ->whereDate('date', Carbon::yesterday())
            ->count();
        $yesterdayPresent = Attendance::forSchool($schoolId)
            ->whereDate('date', Carbon::yesterday())
            ->where('status', 'present')
            ->count();
        $yesterdayPct     = $yesterdayTotal > 0
            ? round(($yesterdayPresent / $yesterdayTotal) * 100, 1)
            : 0.0;

        $attendanceDiff   = round($attendancePct - $yesterdayPct, 1);
        $attendanceChange = ($attendanceDiff >= 0 ? '+' : '') . $attendanceDiff . '% vs yesterday';

        return response()->json([
            'total_students'        => $totalStudents,
            'total_students_change' => $studentChange . ' vs last term',
            'total_staff'           => $totalStaff,
            'staff_change'          => $staffChange,
            'term_revenue'          => $termRevenue,
            'revenue_change'        => $revenueChange,
            'revenue_collected_pct' => $collectedPct,
            'attendance_today'      => $attendancePct,
            'attendance_change'     => $attendanceChange,
            'absent_count'          => $absentCount,
            'late_count'            => $lateCount,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/dashboard/activities?limit=10
    |--------------------------------------------------------------------------
    | Returns recent activity log entries for the school.
    */

    public function activities(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $limit    = min((int) $request->query('limit', 10), 50);

        $logs = ActivityLog::forSchool($schoolId)
            ->latest()
            ->limit($limit)
            ->get()
            ->map(fn ($log) => [
                'id'    => $log->id,
                'type'  => $log->type,
                'title' => $log->title,
                'desc'  => $log->description,
                'time'  => $this->humanTime($log->created_at),
            ]);

        return response()->json($logs);
    }

    /*
    |--------------------------------------------------------------------------
    | Internal helpers
    |--------------------------------------------------------------------------
    */

    private function currentTerm(): string
    {
        $year  = now()->year;
        $month = now()->month;

        // Jan–Apr = Term 2, May–Aug = Term 3, Sep–Dec = Term 1
        $term = match (true) {
            $month <= 4  => 'Term 2',
            $month <= 8  => 'Term 3',
            default      => 'Term 1',
        };

        return "{$year}/{$term}";
    }

    private function previousTerm(): string
    {
        $month = now()->month;
        $year  = now()->year;

        if ($month <= 4) {
            return ($year - 1) . '/Term 1';
        }
        if ($month <= 8) {
            return "{$year}/Term 2";
        }
        return "{$year}/Term 3";
    }

    private function percentageChange(float $old, float $new): string
    {
        if ($old == 0) {
            return $new > 0 ? '+100%' : '0%';
        }

        $pct = round((($new - $old) / $old) * 100, 1);
        return ($pct >= 0 ? '+' : '') . $pct . '%';
    }

    private function humanTime(Carbon $date): string
    {
        $diffInMinutes = $date->diffInMinutes(now());

        if ($diffInMinutes < 60) {
            return $diffInMinutes . ' mins ago';
        }

        $diffInHours = $date->diffInHours(now());

        if ($diffInHours < 24) {
            return $diffInHours . ' hour' . ($diffInHours > 1 ? 's' : '') . ' ago';
        }

        if ($date->isYesterday()) {
            return 'Yesterday';
        }

        return $date->format('M d');
    }
}
