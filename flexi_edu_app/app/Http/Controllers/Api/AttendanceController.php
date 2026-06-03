<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\ClassSection;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET /api/attendance/students
    |--------------------------------------------------------------------------
    | Returns students for a section with their attendance status for the date
    | Frontend: attendanceApi.getStudents({ class_id, section_id, subject_id, date })
    */
    public function getStudents(Request $request): JsonResponse
    {
        $schoolId  = $request->user()->school_id;
        $sectionId = $request->query('section_id');
        $date      = $request->query('date', today()->toDateString());

        $students = Student::where('school_id', $schoolId)
            ->where('class_section_id', $sectionId)
            ->active()
            ->orderBy('first_name')
            ->get();

        // Get existing attendance for this date
        $existing = Attendance::where('school_id', $schoolId)
            ->whereIn('student_id', $students->pluck('id'))
            ->whereDate('date', $date)
            ->whereNull('period_number')
            ->pluck('status', 'student_id');

        $data = $students->map(fn($s) => [
            'id'     => (string) $s->id,
            'name'   => $s->first_name . ' ' . $s->last_name,
            'avatar' => strtoupper(substr($s->first_name, 0, 1) . substr($s->last_name, 0, 1)),
            'status' => $this->mapStatus($existing->get($s->id, 'present')),
        ]);

        return response()->json($data);
    }

    /*
    |--------------------------------------------------------------------------
    | POST /api/attendance/save
    |--------------------------------------------------------------------------
    | Saves attendance for a section on a given date
    | Frontend: attendanceApi.saveAttendance({ class_id, section_id, date, attendance })
    */
    public function save(Request $request): JsonResponse
    {
        $request->validate([
            'section_id'          => 'required',
            'date'                => 'required|date',
            'attendance'          => 'required|array',
            'attendance.*.student_id' => 'required',
            'attendance.*.status'     => 'required|in:P,A,L,H',
        ]);

        $schoolId  = $request->user()->school_id;
        $sectionId = $request->section_id;
        $date      = $request->date;

        foreach ($request->attendance as $record) {
            Attendance::updateOrCreate(
                [
                    'student_id'    => $record['student_id'],
                    'date'          => $date,
                    'period_number' => null,
                ],
                [
                    'class_section_id' => $sectionId,
                    'status'           => $this->reverseMapStatus($record['status']),
                    'school_id'        => $schoolId,
                ]
            );
        }

        return response()->json(['message' => 'Attendance saved successfully.']);
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    // DB stores: present, absent, late, excused → Frontend uses: P, A, L, H
    private function mapStatus(string $status): string
    {
        return match ($status) {
            'present' => 'P',
            'absent'  => 'A',
            'late'    => 'L',
            'excused' => 'H',
            default   => 'P',
        };
    }

    private function reverseMapStatus(string $status): string
    {
        return match ($status) {
            'P' => 'present',
            'A' => 'absent',
            'L' => 'late',
            'H' => 'excused',
            default => 'present',
        };
    }
}
