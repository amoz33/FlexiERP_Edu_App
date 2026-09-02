<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\ActivityLog;
use App\Models\Attendance;
use App\Models\FeePayment;
use App\Models\Staff;
use App\Models\Student;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DashboardSeeder extends Seeder
{
    private string $schoolId = 'SCH-001';

    public function run(): void
    {
        $this->seedStudents();
        $this->seedStaff();
        $this->seedFeePayments();
        $this->seedAttendance();
        $this->seedActivityLogs();

        $this->command->info('Dashboard seed data created successfully.');
    }

    /*
    |--------------------------------------------------------------------------
    | Students – 50 across different grades
    |--------------------------------------------------------------------------
    */
    private function seedStudents(): void
    {
        $grades    = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
        $sections  = ['A', 'B', 'C'];
        $firstNames = ['James', 'Maria', 'David', 'Sarah', 'Michael', 'Jessica', 'Robert', 'Emily',
                       'John', 'Ashley', 'William', 'Amanda', 'Charles', 'Stephanie', 'Daniel', 'Nicole',
                       'Matthew', 'Heather', 'Anthony', 'Elizabeth', 'Chukwuemeka', 'Ngozi', 'Babatunde',
                       'Amaka', 'Tunde', 'Chioma', 'Emeka', 'Adaeze', 'Segun', 'Funmi'];
        $lastNames  = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson',
                       'Okafor', 'Adeleke', 'Nwosu', 'Ibrahim', 'Bello', 'Adesanya', 'Okonkwo', 'Adeyemi'];

        for ($i = 1; $i <= 50; $i++) {
            Student::updateOrCreate(
                ['student_id' => 'STU-' . str_pad($i, 4, '0', STR_PAD_LEFT)],
                [
                    'first_name'      => $firstNames[array_rand($firstNames)],
                    'last_name'       => $lastNames[array_rand($lastNames)],
                    'email'           => 'student' . $i . '@flexierp.com',
                    'grade'           => $grades[array_rand($grades)],
                    'section'         => $sections[array_rand($sections)],
                    'school_id'       => $this->schoolId,
                    'status'          => $i <= 45 ? 'active' : 'inactive',
                    'enrollment_date' => Carbon::now()->subMonths(rand(1, 24)),
                ]
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Staff – 10 members
    |--------------------------------------------------------------------------
    */
    private function seedStaff(): void
    {
        $roles       = ['teacher', 'teacher', 'teacher', 'admin', 'support'];
        $departments = ['Mathematics', 'English', 'Science', 'Administration', 'ICT', 'Social Studies'];
        $firstNames  = ['Mr. Emeka', 'Mrs. Ngozi', 'Mr. James', 'Mrs. Sarah', 'Mr. Tunde',
                        'Mrs. Amaka', 'Mr. David', 'Mrs. Linda', 'Mr. Peter', 'Mrs. Grace'];
        $lastNames   = ['Okafor', 'Adeleke', 'Williams', 'Johnson', 'Bello',
                        'Nwosu', 'Garcia', 'Brown', 'Ibrahim', 'Adesanya'];

        for ($i = 1; $i <= 10; $i++) {
            Staff::updateOrCreate(
                ['staff_id' => 'STF-' . str_pad($i, 4, '0', STR_PAD_LEFT)],
                [
                    'first_name'  => $firstNames[$i - 1],
                    'last_name'   => $lastNames[$i - 1],
                    'email'       => 'staff' . $i . '@flexierp.com',
                    'role'        => $roles[array_rand($roles)],
                    'department'  => $departments[array_rand($departments)],
                    'school_id'   => $this->schoolId,
                    'status'      => 'active',
                    'hire_date'   => Carbon::now()->subMonths(rand(6, 36)),
                ]
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Fee Payments – current term payments for students
    |--------------------------------------------------------------------------
    */
    private function seedFeePayments(): void
    {
        $students    = Student::forSchool($this->schoolId)->active()->get();
        $currentTerm = now()->year . '/Term 1';
        $feeAmount   = 45000; // e.g. ₦45,000 per term

        foreach ($students as $index => $student) {
            // 75% of students have paid, 25% pending
            $hasPaid = $index < ($students->count() * 0.75);

            FeePayment::updateOrCreate(
                ['student_id' => $student->id, 'term' => $currentTerm],
                [
                    'amount'             => $hasPaid ? $feeAmount : 0,
                    'expected_amount'    => $feeAmount,
                    'status'             => $hasPaid ? 'paid' : 'pending',
                    'school_id'          => $this->schoolId,
                    'term'               => $currentTerm,
                    'payment_reference'  => $hasPaid ? 'REF-' . strtoupper(Str::random(8)) : null,
                    'paid_at'            => $hasPaid ? Carbon::now()->subDays(rand(1, 30)) : null,
                ]
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Attendance – today's records
    |--------------------------------------------------------------------------
    */
    private function seedAttendance(): void
    {
        $students = Student::forSchool($this->schoolId)->active()->get();

        foreach ($students as $index => $student) {
            // 96% present, 2% absent, 2% late
            $status = match (true) {
                $index < $students->count() * 0.96 => 'present',
                $index < $students->count() * 0.98 => 'absent',
                default                             => 'late',
            };

            Attendance::updateOrCreate(
                ['student_id' => $student->id, 'date' => today()->toDateString()],
                [
                    'school_id' => $this->schoolId,
                    'status'    => $status,
                ]
            );
        }

        // Yesterday's attendance (slightly different numbers for the change metric)
        foreach ($students->take(40) as $student) {
            Attendance::updateOrCreate(
                ['student_id' => $student->id, 'date' => Carbon::yesterday()->toDateString()],
                [
                    'school_id' => $this->schoolId,
                    'status'    => 'present',
                ]
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Activity Logs
    |--------------------------------------------------------------------------
    */
    private function seedActivityLogs(): void
    {
        $logs = [
            ['payment',   'Term Fee Payment Received',    'Payment of ₦45,000 recorded for Student ID: STU-0012 (Grade 10).', 10],
            ['admission', 'New Admission Application',    'Application #A-2025-089 submitted for Grade 5. Pending review.',    70],
            ['meeting',   'Staff Meeting Scheduled',      'Principal called for a general staff meeting on Friday at 3:00 PM.', 180],
            ['system',    'System Maintenance Alert',     'Scheduled portal downtime this Sunday from 02:00 AM to 04:00 AM.',  1500],
            ['payment',   'Bulk Fee Payment Processed',   'Batch payment of ₦225,000 processed for 5 students in Grade 9.',    2880],
            ['admission', 'Admission List Published',     'The 2025/2026 admission list has been published on the portal.',    4320],
        ];

        foreach ($logs as [$type, $title, $desc, $minutesAgo]) {
            ActivityLog::create([
                'school_id'   => $this->schoolId,
                'type'        => $type,
                'title'       => $title,
                'description' => $desc,
                'created_at'  => now()->subMinutes($minutesAgo),
                'updated_at'  => now()->subMinutes($minutesAgo),
            ]);
        }
    }
}
