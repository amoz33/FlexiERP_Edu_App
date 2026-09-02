<?php

namespace Database\Seeders;

use App\Models\AcademicClass;
use App\Models\ActivityLog;
use App\Models\AdmissionApplication;
use App\Models\Assessment;
use App\Models\Attendance;
use App\Models\ClassSection;
use App\Models\Conversation;
use App\Models\Department;
use App\Models\FeePayment;
use App\Models\FeeType;
use App\Models\GradingScale;
use App\Models\InventoryItem;
use App\Models\LessonPlan;
use App\Models\Message;
use App\Models\Notice;
use App\Models\Staff;
use App\Models\StaffSubjectAssignment;
use App\Models\Student;
use App\Models\StudentGrade;
use App\Models\Subject;
use App\Models\TimetableSlot;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class MasterSeeder extends Seeder
{
    private string $school = 'SCH-001';
    private string $term   = '2026/Term 1';

    public function run(): void
    {
        $this->seedDepartments();
        $this->seedClasses();
        $this->seedStaff();
        $this->seedClassSections();   // needs staff IDs for form teachers
        $this->seedSubjects();
        $this->seedStudents();
        $this->seedStaffSubjectAssignments();
        $this->seedTimetable();
        $this->seedAttendance();
        $this->seedAssessments();
        $this->seedGradingScale();
        $this->seedFeeTypes();
        $this->seedFeePayments();
        $this->seedAdmissionApplications();
        $this->seedInventory();
        $this->seedNotices();
        $this->seedLessonPlans();
        $this->seedConversations();
        $this->seedActivityLogs();

        $this->command->info('✅ Master seed completed with Nigerian data.');
    }

    // ─────────────────────────────────────────────────────────
    private function seedDepartments(): void
    {
        $departments = [
            ['name' => 'Mathematics',         'code' => 'MATH'],
            ['name' => 'English Language',    'code' => 'ENG'],
            ['name' => 'Sciences',            'code' => 'SCI'],
            ['name' => 'Social Studies',      'code' => 'SOC'],
            ['name' => 'Arts & Humanities',   'code' => 'ARTS'],
            ['name' => 'Information Technology', 'code' => 'ICT'],
            ['name' => 'Administration',      'code' => 'ADMIN'],
            ['name' => 'Sports & P.E',        'code' => 'PE'],
        ];
        foreach ($departments as $d) {
            Department::updateOrCreate(['code' => $d['code']], [...$d, 'school_id' => $this->school]);
        }
    }

    // ─────────────────────────────────────────────────────────
    private function seedClasses(): void
    {
        $classes = [
            ['name' => 'JSS 1', 'level' => 'Junior', 'order' => 1],
            ['name' => 'JSS 2', 'level' => 'Junior', 'order' => 2],
            ['name' => 'JSS 3', 'level' => 'Junior', 'order' => 3],
            ['name' => 'SSS 1', 'level' => 'Senior', 'order' => 4],
            ['name' => 'SSS 2', 'level' => 'Senior', 'order' => 5],
            ['name' => 'SSS 3', 'level' => 'Senior', 'order' => 6],
        ];
        foreach ($classes as $c) {
            AcademicClass::updateOrCreate(['name' => $c['name'], 'school_id' => $this->school], [...$c, 'school_id' => $this->school]);
        }
    }

    // ─────────────────────────────────────────────────────────
    private function seedStaff(): void
    {
        $deptId = fn($code) => Department::where('code', $code)->first()?->id;

        $members = [
            ['staff_id' => 'STF-2026-001', 'first_name' => 'Ngozi',      'last_name' => 'Adeleke',   'email' => 'n.adeleke@flexierp.com',   'phone' => '+234 801 234 5678', 'dept' => 'MATH', 'role_title' => 'Head of Mathematics',    'role' => 'teacher',  'hire_date' => '2018-09-12', 'address' => '12 Victoria Island, Lagos'],
            ['staff_id' => 'STF-2026-002', 'first_name' => 'Emeka',       'last_name' => 'Okafor',    'email' => 'e.okafor@flexierp.com',    'phone' => '+234 802 345 6789', 'dept' => 'SCI',  'role_title' => 'Senior Physics Teacher',  'role' => 'teacher',  'hire_date' => '2020-01-05', 'address' => '45 Lekki Phase 1, Lagos'],
            ['staff_id' => 'STF-2026-003', 'first_name' => 'Adaeze',      'last_name' => 'Nwosu',     'email' => 'a.nwosu@flexierp.com',     'phone' => '+234 803 456 7890', 'dept' => 'ADMIN','role_title' => 'Academic Coordinator',    'role' => 'admin',    'hire_date' => '2021-03-20', 'address' => '22 Ikeja GRA, Lagos'],
            ['staff_id' => 'STF-2026-004', 'first_name' => 'Tunde',       'last_name' => 'Bello',     'email' => 't.bello@flexierp.com',     'phone' => '+234 804 567 8901', 'dept' => 'ARTS', 'role_title' => 'English Language Teacher', 'role' => 'teacher',  'hire_date' => '2022-08-15', 'address' => 'Surulere, Lagos'],
            ['staff_id' => 'STF-2026-005', 'first_name' => 'Funmi',       'last_name' => 'Adesanya',  'email' => 'f.adesanya@flexierp.com',  'phone' => '+234 805 678 9012', 'dept' => 'ENG',  'role_title' => 'Literature Teacher',      'role' => 'teacher',  'hire_date' => '2019-02-10', 'address' => 'Yaba, Lagos'],
            ['staff_id' => 'STF-2026-006', 'first_name' => 'Chukwuemeka', 'last_name' => 'Ibrahim',   'email' => 'c.ibrahim@flexierp.com',   'phone' => '+234 806 789 0123', 'dept' => 'SCI',  'role_title' => 'Biology Teacher',         'role' => 'teacher',  'hire_date' => '2023-11-22', 'address' => 'Maryland, Lagos'],
            ['staff_id' => 'STF-2026-007', 'first_name' => 'Amaka',       'last_name' => 'Okonkwo',   'email' => 'a.okonkwo@flexierp.com',   'phone' => '+234 807 890 1234', 'dept' => 'SOC',  'role_title' => 'History & Government Teacher', 'role' => 'teacher', 'hire_date' => '2021-10-01', 'address' => 'Gbagada, Lagos'],
            ['staff_id' => 'STF-2026-008', 'first_name' => 'Segun',       'last_name' => 'Adeyemi',   'email' => 's.adeyemi@flexierp.com',   'phone' => '+234 808 901 2345', 'dept' => 'SCI',  'role_title' => 'Chemistry Teacher',       'role' => 'teacher',  'hire_date' => '2024-01-15', 'address' => 'Apapa, Lagos'],
            ['staff_id' => 'STF-2026-009', 'first_name' => 'Kemi',        'last_name' => 'Olawale',   'email' => 'k.olawale@flexierp.com',   'phone' => '+234 809 012 3456', 'dept' => 'ICT',  'role_title' => 'ICT Teacher',             'role' => 'teacher',  'hire_date' => '2022-09-30', 'address' => 'Festac, Lagos'],
            ['staff_id' => 'STF-2026-010', 'first_name' => 'Biodun',      'last_name' => 'Fashola',   'email' => 'b.fashola@flexierp.com',   'phone' => '+234 810 123 4567', 'dept' => 'ARTS', 'role_title' => 'Fine Arts Teacher',       'role' => 'teacher',  'hire_date' => '2020-05-05', 'address' => 'Ikoyi, Lagos'],
            ['staff_id' => 'STF-2026-011', 'first_name' => 'Yetunde',     'last_name' => 'Coker',     'email' => 'y.coker@flexierp.com',     'phone' => '+234 811 234 5678', 'dept' => 'MATH', 'role_title' => 'Further Mathematics Teacher', 'role' => 'teacher', 'hire_date' => '2021-07-12', 'address' => 'Ajah, Lagos'],
            ['staff_id' => 'STF-2026-012', 'first_name' => 'Rotimi',      'last_name' => 'Gbadebo',   'email' => 'r.gbadebo@flexierp.com',   'phone' => '+234 812 345 6789', 'dept' => 'PE',   'role_title' => 'Physical Education Teacher', 'role' => 'teacher', 'hire_date' => '2018-12-18', 'address' => 'Epe, Lagos'],
            ['staff_id' => 'STF-2026-013', 'first_name' => 'Damilola',    'last_name' => 'Martins',   'email' => 'd.martins@flexierp.com',   'phone' => '+234 813 456 7890', 'dept' => 'ICT',  'role_title' => 'IT Administrator',        'role' => 'admin',    'hire_date' => '2023-04-22', 'address' => 'Ogba, Lagos'],
            ['staff_id' => 'STF-2026-014', 'first_name' => 'Blessing',    'last_name' => 'Eze',       'email' => 'b.eze@flexierp.com',       'phone' => '+234 814 567 8901', 'dept' => 'ADMIN','role_title' => 'Librarian',               'role' => 'support',  'hire_date' => '2020-08-08', 'address' => 'Mushin, Lagos'],
            ['staff_id' => 'STF-2026-015', 'first_name' => 'Olumide',     'last_name' => 'Akande',    'email' => 'o.akande@flexierp.com',    'phone' => '+234 815 678 9012', 'dept' => 'ADMIN','role_title' => 'Security Head',           'role' => 'support',  'hire_date' => '2019-02-14', 'address' => 'Agege, Lagos'],
        ];

        foreach ($members as $m) {
            $deptId = Department::where('code', $m['dept'])->first()?->id;

            // Create login user for teachers
            $user = User::updateOrCreate(
                ['email' => $m['email']],
                [
                    'name'      => $m['first_name'] . ' ' . $m['last_name'],
                    'password'  => Hash::make('Staff@1234'),
                    'role'      => $m['role'] === 'teacher' ? 'teacher' : 'admin',
                    'school_id' => $this->school,
                    'is_active' => true,
                ]
            );

            Staff::updateOrCreate(
                ['staff_id' => $m['staff_id']],
                [
                    'user_id'       => $user->id,
                    'first_name'    => $m['first_name'],
                    'last_name'     => $m['last_name'],
                    'email'         => $m['email'],
                    'phone'         => $m['phone'],
                    'address'       => $m['address'],
                    'department_id' => $deptId,
                    'role_title'    => $m['role_title'],
                    'role'          => $m['role'],
                    'status'        => 'active',
                    'school_id'     => $this->school,
                    'hire_date'     => $m['hire_date'],
                ]
            );
        }
    }

    // ─────────────────────────────────────────────────────────
    private function seedClassSections(): void
    {
        $staff = fn($id) => Staff::where('staff_id', $id)->first()?->id;

        $sections = [
            ['class' => 'JSS 1', 'name' => 'A', 'full_name' => 'JSS 1A', 'form_teacher' => 'STF-2026-007'],
            ['class' => 'JSS 1', 'name' => 'B', 'full_name' => 'JSS 1B', 'form_teacher' => 'STF-2026-010'],
            ['class' => 'JSS 2', 'name' => 'A', 'full_name' => 'JSS 2A', 'form_teacher' => 'STF-2026-004'],
            ['class' => 'JSS 2', 'name' => 'B', 'full_name' => 'JSS 2B', 'form_teacher' => 'STF-2026-005'],
            ['class' => 'JSS 3', 'name' => 'A', 'full_name' => 'JSS 3A', 'form_teacher' => 'STF-2026-011'],
            ['class' => 'JSS 3', 'name' => 'B', 'full_name' => 'JSS 3B', 'form_teacher' => 'STF-2026-009'],
            ['class' => 'SSS 1', 'name' => 'Science', 'full_name' => 'SSS 1 Science', 'form_teacher' => 'STF-2026-002'],
            ['class' => 'SSS 1', 'name' => 'Arts',    'full_name' => 'SSS 1 Arts',    'form_teacher' => 'STF-2026-005'],
            ['class' => 'SSS 2', 'name' => 'Science', 'full_name' => 'SSS 2 Science', 'form_teacher' => 'STF-2026-008'],
            ['class' => 'SSS 2', 'name' => 'Arts',    'full_name' => 'SSS 2 Arts',    'form_teacher' => 'STF-2026-007'],
            ['class' => 'SSS 3', 'name' => 'Science', 'full_name' => 'SSS 3 Science', 'form_teacher' => 'STF-2026-001'],
            ['class' => 'SSS 3', 'name' => 'Arts',    'full_name' => 'SSS 3 Arts',    'form_teacher' => 'STF-2026-004'],
        ];

        foreach ($sections as $s) {
            $classId = AcademicClass::where('name', $s['class'])->first()?->id;
            ClassSection::updateOrCreate(
                ['full_name' => $s['full_name'], 'school_id' => $this->school],
                [
                    'class_id'       => $classId,
                    'name'           => $s['name'],
                    'full_name'      => $s['full_name'],
                    'capacity'       => 45,
                    'form_teacher_id'=> $staff($s['form_teacher']),
                    'school_id'      => $this->school,
                ]
            );
        }
    }

    // ─────────────────────────────────────────────────────────
    private function seedSubjects(): void
    {
        $dept = fn($code) => Department::where('code', $code)->first()?->id;

        $subjects = [
            ['code' => 'MAT101', 'name' => 'Mathematics',               'type' => 'Core',     'dept' => 'MATH'],
            ['code' => 'MAT201', 'name' => 'Further Mathematics',        'type' => 'Elective', 'dept' => 'MATH'],
            ['code' => 'ENG101', 'name' => 'English Language',           'type' => 'Core',     'dept' => 'ENG'],
            ['code' => 'LIT101', 'name' => 'Literature in English',      'type' => 'Core',     'dept' => 'ENG'],
            ['code' => 'PHY101', 'name' => 'Physics',                    'type' => 'Core',     'dept' => 'SCI'],
            ['code' => 'CHE101', 'name' => 'Chemistry',                  'type' => 'Core',     'dept' => 'SCI'],
            ['code' => 'BIO101', 'name' => 'Biology',                    'type' => 'Core',     'dept' => 'SCI'],
            ['code' => 'GOV101', 'name' => 'Government',                 'type' => 'Core',     'dept' => 'SOC'],
            ['code' => 'CRS101', 'name' => 'Christian Religious Studies','type' => 'Core',     'dept' => 'SOC'],
            ['code' => 'ICT101', 'name' => 'Information Technology',     'type' => 'Core',     'dept' => 'ICT'],
            ['code' => 'AGR101', 'name' => 'Agricultural Science',       'type' => 'Core',     'dept' => 'SCI'],
            ['code' => 'ART101', 'name' => 'Fine & Applied Arts',        'type' => 'Elective', 'dept' => 'ARTS'],
            ['code' => 'ECO101', 'name' => 'Economics',                  'type' => 'Core',     'dept' => 'SOC'],
            ['code' => 'GEO101', 'name' => 'Geography',                  'type' => 'Core',     'dept' => 'SOC'],
            ['code' => 'YOR101', 'name' => 'Yoruba Language',            'type' => 'Language', 'dept' => 'ARTS'],
        ];

        foreach ($subjects as $s) {
            Subject::updateOrCreate(
                ['code' => $s['code']],
                [
                    'name'                => $s['name'],
                    'type'                => $s['type'],
                    'department_id'       => $dept($s['dept']),
                    'max_theory_marks'    => 70,
                    'max_practical_marks' => 30,
                    'school_id'           => $this->school,
                ]
            );
        }
    }

    // ─────────────────────────────────────────────────────────
    private function seedStudents(): void
    {
        $nigerianFirstNames = ['Chukwuemeka', 'Ngozi', 'Adaeze', 'Tunde', 'Funmi', 'Segun', 'Amaka', 'Kemi', 'Biodun', 'Yetunde', 'Rotimi', 'Damilola', 'Blessing', 'Olumide', 'Chioma', 'Babatunde', 'Ifeoma', 'Obinna', 'Tolani', 'Emeka', 'Sade', 'Kunle', 'Nkechi', 'Femi', 'Onyeka', 'Taiwo', 'Kehinde', 'Gbemisola', 'Rashidat', 'Muideen'];
        $nigerianLastNames  = ['Okafor', 'Adeleke', 'Nwosu', 'Bello', 'Adesanya', 'Ibrahim', 'Okonkwo', 'Adeyemi', 'Fashola', 'Coker', 'Gbadebo', 'Martins', 'Eze', 'Akande', 'Chukwu', 'Olawale', 'Babatunde', 'Lawal', 'Adebayo', 'Owoeye', 'Ogundipe', 'Salami', 'Amadi', 'Eze', 'Uche', 'Obi', 'Nwachukwu', 'Agboola', 'Bakare', 'Tijani'];

        $sections = ClassSection::where('school_id', $this->school)->get();
        $counter  = 1;

        foreach ($sections as $section) {
            $count = rand(25, 35);
            for ($i = 0; $i < $count; $i++) {
                $firstName = $nigerianFirstNames[array_rand($nigerianFirstNames)];
                $lastName  = $nigerianLastNames[array_rand($nigerianLastNames)];
                $studentId = 'GWPL-2026-' . str_pad($counter, 3, '0', STR_PAD_LEFT);
                $admNo     = 'ADM-2026-' . str_pad($counter, 3, '0', STR_PAD_LEFT);
                $email     = strtolower(substr($firstName, 0, 1) . '.' . $lastName . $counter . '@flexierp.com');

                // Create a login user for the student
                $user = User::updateOrCreate(
                    ['email' => $email],
                    [
                        'name'      => "$firstName $lastName",
                        'password'  => Hash::make('Student@1234'),
                        'role'      => 'student',
                        'school_id' => $this->school,
                        'is_active' => true,
                    ]
                );

                Student::updateOrCreate(
                    ['student_id' => $studentId],
                    [
                        'user_id'          => $user->id,
                        'admission_no'     => $admNo,
                        'first_name'       => $firstName,
                        'last_name'        => $lastName,
                        'email'            => $email,
                        'phone'            => '+234 8' . rand(10, 99) . ' ' . rand(100, 999) . ' ' . rand(1000, 9999),
                        'gender'           => $i % 2 === 0 ? 'Male' : 'Female',
                        'date_of_birth'    => Carbon::now()->subYears(rand(11, 18))->subDays(rand(1, 365))->toDateString(),
                        'class_section_id' => $section->id,
                        'parent_name'      => 'Mr/Mrs ' . $nigerianLastNames[array_rand($nigerianLastNames)],
                        'parent_phone'     => '+234 7' . rand(10, 99) . ' ' . rand(100, 999) . ' ' . rand(1000, 9999),
                        'parent_email'     => 'parent' . $counter . '@flexierp.com',
                        'status'           => $counter % 20 === 0 ? 'inactive' : 'active',
                        'school_id'        => $this->school,
                        'enrollment_date'  => Carbon::now()->subMonths(rand(1, 36))->toDateString(),
                        'address'          => rand(1, 99) . ' ' . ['Allen Avenue', 'Broad Street', 'Marina Road', 'Ozumba Mbadiwe', 'Adeola Odeku'][array_rand(['Allen Avenue', 'Broad Street', 'Marina Road', 'Ozumba Mbadiwe', 'Adeola Odeku'])] . ', Lagos',
                    ]
                );
                $counter++;
            }
        }
    }

    // ─────────────────────────────────────────────────────────
    private function seedStaffSubjectAssignments(): void
    {
        $s = fn($code) => Subject::where('code', $code)->first()?->id;
        $t = fn($id)   => Staff::where('staff_id', $id)->first()?->id;
        $sec = fn($name) => ClassSection::where('full_name', $name)->first()?->id;

        $assignments = [
            ['staff' => 'STF-2026-001', 'subject' => 'MAT101', 'sections' => ['SSS 3 Science', 'SSS 2 Science']],
            ['staff' => 'STF-2026-011', 'subject' => 'MAT201', 'sections' => ['SSS 3 Science', 'SSS 2 Science']],
            ['staff' => 'STF-2026-002', 'subject' => 'PHY101', 'sections' => ['SSS 1 Science', 'SSS 2 Science', 'SSS 3 Science']],
            ['staff' => 'STF-2026-008', 'subject' => 'CHE101', 'sections' => ['SSS 1 Science', 'SSS 2 Science', 'SSS 3 Science']],
            ['staff' => 'STF-2026-006', 'subject' => 'BIO101', 'sections' => ['SSS 1 Science', 'SSS 2 Science']],
            ['staff' => 'STF-2026-005', 'subject' => 'ENG101', 'sections' => ['JSS 1A', 'JSS 2A', 'SSS 1 Arts']],
            ['staff' => 'STF-2026-004', 'subject' => 'LIT101', 'sections' => ['SSS 1 Arts', 'SSS 2 Arts', 'SSS 3 Arts']],
            ['staff' => 'STF-2026-007', 'subject' => 'GOV101', 'sections' => ['SSS 2 Arts', 'SSS 3 Arts']],
            ['staff' => 'STF-2026-009', 'subject' => 'ICT101', 'sections' => ['JSS 3A', 'JSS 3B', 'SSS 1 Science']],
            ['staff' => 'STF-2026-007', 'subject' => 'GEO101', 'sections' => ['SSS 1 Arts', 'SSS 2 Arts']],
        ];

        foreach ($assignments as $a) {
            foreach ($a['sections'] as $secName) {
                $secId = $sec($secName);
                if (!$secId) continue;
                StaffSubjectAssignment::updateOrCreate(
                    ['staff_id' => $t($a['staff']), 'subject_id' => $s($a['subject']), 'class_section_id' => $secId, 'academic_term' => $this->term],
                    ['school_id' => $this->school]
                );
            }
        }
    }

    // ─────────────────────────────────────────────────────────
    private function seedTimetable(): void
    {
        $section = ClassSection::where('full_name', 'SSS 2 Science')->first();
        if (!$section) return;

        $physics  = Subject::where('code', 'PHY101')->first();
        $maths    = Subject::where('code', 'MAT101')->first();
        $chem     = Subject::where('code', 'CHE101')->first();
        $eng      = Subject::where('code', 'ENG101')->first();
        $teacher  = Staff::where('staff_id', 'STF-2026-002')->first(); // physics teacher

        $slots = [
            ['day' => 'Monday',    'period' => 1, 'start' => '08:00', 'end' => '08:45', 'subject' => $physics,  'room' => 'Lab 4A',   'type' => 'lesson'],
            ['day' => 'Monday',    'period' => 2, 'start' => '08:45', 'end' => '09:30', 'subject' => $maths,    'room' => 'Room 101', 'type' => 'lesson'],
            ['day' => 'Monday',    'period' => 0, 'start' => '10:00', 'end' => '10:30', 'subject' => null,      'room' => null,       'type' => 'break',  'label' => 'Morning Break'],
            ['day' => 'Monday',    'period' => 3, 'start' => '10:30', 'end' => '11:15', 'subject' => $chem,     'room' => 'Lab 2B',   'type' => 'lesson'],
            ['day' => 'Monday',    'period' => 4, 'start' => '11:15', 'end' => '12:00', 'subject' => $eng,      'room' => 'Room 205', 'type' => 'lesson'],
            ['day' => 'Tuesday',   'period' => 1, 'start' => '08:00', 'end' => '08:45', 'subject' => $physics,  'room' => 'Lab 4A',   'type' => 'lesson'],
            ['day' => 'Tuesday',   'period' => 2, 'start' => '08:45', 'end' => '09:30', 'subject' => null,      'room' => null,       'type' => 'free',   'label' => 'Free Period'],
            ['day' => 'Wednesday', 'period' => 1, 'start' => '08:00', 'end' => '08:45', 'subject' => $maths,    'room' => 'Room 101', 'type' => 'lesson'],
            ['day' => 'Thursday',  'period' => 1, 'start' => '08:00', 'end' => '08:45', 'subject' => $physics,  'room' => 'Lab 4A',   'type' => 'lesson'],
            ['day' => 'Friday',    'period' => 1, 'start' => '08:00', 'end' => '08:45', 'subject' => $chem,     'room' => 'Lab 2B',   'type' => 'lesson'],
        ];

        foreach ($slots as $sl) {
            TimetableSlot::updateOrCreate(
                ['class_section_id' => $section->id, 'day' => $sl['day'], 'period_number' => $sl['period'], 'academic_term' => $this->term],
                [
                    'subject_id'   => $sl['subject']?->id,
                    'staff_id'     => $sl['type'] === 'lesson' ? $teacher?->id : null,
                    'start_time'   => $sl['start'],
                    'end_time'     => $sl['end'],
                    'room'         => $sl['room'],
                    'slot_type'    => $sl['type'],
                    'label'        => $sl['label'] ?? null,
                    'school_id'    => $this->school,
                ]
            );
        }
    }

    // ─────────────────────────────────────────────────────────
    private function seedAttendance(): void
    {
        $students = Student::where('school_id', $this->school)->active()->take(50)->get();
        $section  = ClassSection::where('full_name', 'SSS 2 Science')->first();

        foreach ($students as $index => $student) {
            $status = match(true) {
                $index < 45 => 'present',
                $index < 48 => 'absent',
                default     => 'late',
            };
            Attendance::updateOrCreate(
                ['student_id' => $student->id, 'date' => today()->toDateString(), 'period_number' => null],
                ['class_section_id' => $section?->id ?? $student->class_section_id, 'status' => $status, 'school_id' => $this->school]
            );
            // Yesterday
            Attendance::updateOrCreate(
                ['student_id' => $student->id, 'date' => Carbon::yesterday()->toDateString(), 'period_number' => null],
                ['class_section_id' => $section?->id ?? $student->class_section_id, 'status' => 'present', 'school_id' => $this->school]
            );
        }
    }

    // ─────────────────────────────────────────────────────────
    private function seedAssessments(): void
    {
        $physics = Subject::where('code', 'PHY101')->first();
        $maths   = Subject::where('code', 'MAT101')->first();
        $section = ClassSection::where('full_name', 'SSS 2 Science')->first();
        $teacher = Staff::where('staff_id', 'STF-2026-002')->first();

        if (!$physics || !$section || !$teacher) return;

        $assessments = [
            ['title' => 'First C.A — Mechanics',             'type' => 'CA',   'cat' => 'CA',   'subject' => $physics, 'date' => now()->subDays(30)->toDateString(), 'max' => 10, 'weight' => 10, 'status' => 'completed'],
            ['title' => 'Second C.A — Waves & Optics',       'type' => 'CA',   'cat' => 'CA',   'subject' => $physics, 'date' => now()->subDays(14)->toDateString(), 'max' => 10, 'weight' => 10, 'status' => 'completed'],
            ['title' => 'Physics Lab Report — Refraction',   'type' => 'Lab',  'cat' => 'CA',   'subject' => $physics, 'date' => now()->subDays(7)->toDateString(),  'max' => 30, 'weight' => 10, 'status' => 'grading'],
            ['title' => 'First Term Examination — Physics',  'type' => 'Exam', 'cat' => 'Exam', 'subject' => $physics, 'date' => now()->addDays(14)->toDateString(), 'max' => 70, 'weight' => 60, 'status' => 'upcoming'],
            ['title' => 'Mathematics C.A — Algebra',         'type' => 'CA',   'cat' => 'CA',   'subject' => $maths,   'date' => now()->subDays(10)->toDateString(), 'max' => 10, 'weight' => 10, 'status' => 'completed'],
        ];

        foreach ($assessments as $a) {
            $assessment = Assessment::updateOrCreate(
                ['title' => $a['title'], 'class_section_id' => $section->id],
                [
                    'type'             => $a['type'],
                    'category'         => $a['cat'],
                    'subject_id'       => $a['subject']->id,
                    'staff_id'         => $teacher->id,
                    'date'             => $a['date'],
                    'max_marks'        => $a['max'],
                    'weight'           => $a['weight'],
                    'status'           => $a['status'],
                    'academic_term'    => $this->term,
                    'school_id'        => $this->school,
                ]
            );

            // Seed grades for completed assessments
            if ($a['status'] === 'completed') {
                $students = Student::where('class_section_id', $section->id)->active()->get();
                foreach ($students as $student) {
                    StudentGrade::updateOrCreate(
                        ['assessment_id' => $assessment->id, 'student_id' => $student->id],
                        ['marks' => rand(5, $a['max']), 'remarks' => '', 'school_id' => $this->school]
                    );
                }
            }
        }
    }

    // ─────────────────────────────────────────────────────────
    private function seedGradingScale(): void
    {
        $scale = [
            ['grade' => 'A1', 'lower_bound' => 75, 'upper_bound' => 100, 'remark' => 'EXCELLENT', 'color' => '#C9A020'],
            ['grade' => 'B2', 'lower_bound' => 70, 'upper_bound' => 74,  'remark' => 'VERY GOOD',  'color' => '#10B981'],
            ['grade' => 'B3', 'lower_bound' => 65, 'upper_bound' => 69,  'remark' => 'GOOD',        'color' => '#3B82F6'],
            ['grade' => 'C4', 'lower_bound' => 60, 'upper_bound' => 64,  'remark' => 'CREDIT',      'color' => '#8B5CF6'],
            ['grade' => 'C5', 'lower_bound' => 55, 'upper_bound' => 59,  'remark' => 'CREDIT',      'color' => '#F59E0B'],
            ['grade' => 'C6', 'lower_bound' => 50, 'upper_bound' => 54,  'remark' => 'CREDIT',      'color' => '#EF4444'],
            ['grade' => 'F9', 'lower_bound' => 0,  'upper_bound' => 49,  'remark' => 'FAIL',        'color' => '#DC2626'],
        ];

        foreach ($scale as $s) {
            GradingScale::updateOrCreate(
                ['grade' => $s['grade'], 'school_id' => $this->school],
                [
                    'lower_bound' => $s['lower_bound'],
                    'upper_bound' => $s['upper_bound'],
                    'remark'      => $s['remark'],
                    'color'       => $s['color'],
                    'school_id'   => $this->school,
                ]
            );
        }
    }

    // ─────────────────────────────────────────────────────────
    private function seedFeeTypes(): void
    {
        $fees = [
            ['name' => 'Tuition Fee',              'class' => 'JSS 1',   'amount' => 45000],
            ['name' => 'Tuition Fee',              'class' => 'JSS 2',   'amount' => 45000],
            ['name' => 'Tuition Fee',              'class' => 'JSS 3',   'amount' => 50000],
            ['name' => 'Tuition Fee',              'class' => 'SSS 1',   'amount' => 60000],
            ['name' => 'Tuition Fee',              'class' => 'SSS 2',   'amount' => 60000],
            ['name' => 'Tuition Fee',              'class' => 'SSS 3',   'amount' => 65000],
            ['name' => 'Textbooks & Workbooks',    'class' => 'All',     'amount' => 15000],
            ['name' => 'Science Laboratory Fee',   'class' => 'SSS 1',   'amount' => 8000],
            ['name' => 'Science Laboratory Fee',   'class' => 'SSS 2',   'amount' => 8000],
            ['name' => 'Science Laboratory Fee',   'class' => 'SSS 3',   'amount' => 10000],
            ['name' => 'ICT Levy',                 'class' => 'All',     'amount' => 5000],
            ['name' => 'School Uniform Set',       'class' => 'All',     'amount' => 12000],
            ['name' => 'Transportation (Bus A)',   'class' => 'All',     'amount' => 18000],
            ['name' => 'Examination Council Fee',  'class' => 'SSS 3',   'amount' => 25000],
            ['name' => 'Graduation & Alumni Fee',  'class' => 'SSS 3',   'amount' => 15000],
            ['name' => 'PTA Levy',                 'class' => 'All',     'amount' => 3000],
        ];

        foreach ($fees as $f) {
            FeeType::updateOrCreate(
                ['name' => $f['name'], 'applicable_class' => $f['class'], 'academic_term' => $this->term, 'school_id' => $this->school],
                ['amount' => $f['amount'], 'status' => 'active', 'school_id' => $this->school]
            );
        }
    }

    // ─────────────────────────────────────────────────────────
    private function seedFeePayments(): void
    {
        $students  = Student::where('school_id', $this->school)->active()->get();
        $tuitionFee = FeeType::where('name', 'Tuition Fee')->where('academic_term', $this->term)->first();
        if (!$tuitionFee) return;

        foreach ($students as $index => $student) {
            $hasPaid = $index < ($students->count() * 0.75);
            FeePayment::updateOrCreate(
                ['student_id' => $student->id, 'fee_type_id' => $tuitionFee->id],
                [
                    'amount'             => $hasPaid ? $tuitionFee->amount : 0,
                    'expected_amount'    => $tuitionFee->amount,
                    'status'             => $hasPaid ? 'paid' : 'pending',
                    'payment_method'     => $hasPaid ? ['cash', 'bank_transfer', 'card'][rand(0, 2)] : null,
                    'payment_reference'  => $hasPaid ? 'REF-' . strtoupper(\Illuminate\Support\Str::random(8)) : null,
                    'description'        => 'Tuition Fee — ' . $this->term,
                    'academic_term'      => $this->term,
                    'school_id'          => $this->school,
                    'paid_at'            => $hasPaid ? Carbon::now()->subDays(rand(1, 30)) : null,
                ]
            );
        }
    }

    // ─────────────────────────────────────────────────────────
    private function seedAdmissionApplications(): void
    {
        $applications = [
            ['first' => 'Oluwaseun',   'last' => 'Adeleke',  'program' => 'JSS 1',   'status' => 'admitted',          'days' => 30],
            ['first' => 'Chidinma',    'last' => 'Obi',      'program' => 'SSS 1',   'status' => 'pending',           'days' => 20],
            ['first' => 'Babatunde',   'last' => 'Lawal',    'program' => 'JSS 2',   'status' => 'under_evaluation',  'days' => 18],
            ['first' => 'Nneka',       'last' => 'Amadi',    'program' => 'SSS 1',   'status' => 'admitted',          'days' => 15],
            ['first' => 'Mustapha',    'last' => 'Bello',    'program' => 'JSS 3',   'status' => 'rejected',          'days' => 10],
            ['first' => 'Ifeoma',      'last' => 'Nwachukwu','program' => 'SSS 2',   'status' => 'pending',           'days' => 5],
        ];

        foreach ($applications as $i => $a) {
            AdmissionApplication::updateOrCreate(
                ['application_no' => 'APP-2026-' . str_pad($i + 1, 3, '0', STR_PAD_LEFT)],
                [
                    'first_name'   => $a['first'],
                    'last_name'    => $a['last'],
                    'email'        => strtolower($a['first'] . '.' . $a['last'] . '@flexierp.com'),
                    'program'      => $a['program'],
                    'date_applied' => Carbon::now()->subDays($a['days'])->toDateString(),
                    'status'       => $a['status'],
                    'school_id'    => $this->school,
                ]
            );
        }
    }

    // ─────────────────────────────────────────────────────────
    private function seedInventory(): void
    {
        $items = [
            ['code' => 'INV-1001', 'name' => 'WAEC Past Questions Pack (2020-2025)', 'category' => 'Books & Media',   'stock' => 145, 'reorder' => 50, 'status' => 'optimal'],
            ['code' => 'INV-2001', 'name' => 'Student Desks (Standard)',             'category' => 'Furniture',        'stock' => 12,  'reorder' => 20, 'status' => 'low_stock'],
            ['code' => 'INV-3001', 'name' => 'Beaker Set 500ml',                    'category' => 'Lab Equipment',    'stock' => 88,  'reorder' => 30, 'status' => 'optimal'],
            ['code' => 'INV-4001', 'name' => 'Whiteboard Markers (Pack of 12)',      'category' => 'Stationery',       'stock' => 5,   'reorder' => 25, 'status' => 'low_stock'],
            ['code' => 'INV-5001', 'name' => 'HP Chromebook Laptops',               'category' => 'IT & Electronics', 'stock' => 42,  'reorder' => 10, 'status' => 'optimal'],
            ['code' => 'INV-6001', 'name' => 'School Blazers (Junior)',              'category' => 'Uniform',          'stock' => 200, 'reorder' => 50, 'status' => 'optimal'],
            ['code' => 'INV-7001', 'name' => 'Microscope (Compound)',               'category' => 'Lab Equipment',    'stock' => 0,   'reorder' => 5,  'status' => 'out_of_stock'],
        ];

        foreach ($items as $item) {
            InventoryItem::updateOrCreate(
                ['item_code' => $item['code']],
                [
                    'name'           => $item['name'],
                    'category'       => $item['category'],
                    'stock_quantity' => $item['stock'],
                    'reorder_level'  => $item['reorder'],
                    'status'         => $item['status'],
                    'school_id'      => $this->school,
                ]
            );
        }
    }

    // ─────────────────────────────────────────────────────────
    private function seedNotices(): void
    {
        $notices = [
            ['title' => 'End of Term Examination Schedule Released',  'audience' => 'ALL STAFF & STUDENTS',  'body' => 'The First Term examination timetable has been uploaded to the student portal. All students in JSS 1 through SSS 3 should download and prepare accordingly. Examinations begin on the 14th of June, 2026.', 'highlight' => true],
            ['title' => 'Staff Development Workshop — June 2026',    'audience' => 'FACULTY ONLY',           'body' => 'All teaching staff are required to attend the scheduled professional development workshop on Saturday, June 7th. Attendance is compulsory. Venue: School Hall. Time: 9:00 AM.', 'highlight' => false],
            ['title' => 'WAEC Registration Deadline — SSS 3',        'audience' => 'SSS 3 STUDENTS',         'body' => 'All SSS 3 students who have not completed their WAEC registration must do so by Friday, May 30, 2026. Failure to register before the deadline may affect sitting the examinations.', 'highlight' => false],
            ['title' => 'PTA Meeting — Saturday 31st May',           'audience' => 'ALL PARENTS & STAFF',    'body' => "Parents are invited to the quarterly PTA meeting on Saturday 31st May, 2026 at 10:00 AM. Agenda includes school fees review, student performance report, and plans for the upcoming Sports Day.", 'highlight' => true],
        ];

        foreach ($notices as $n) {
            Notice::updateOrCreate(
                ['title' => $n['title'], 'school_id' => $this->school],
                ['audience' => $n['audience'], 'body' => $n['body'], 'is_highlighted' => $n['highlight'], 'school_id' => $this->school]
            );
        }
    }

    // ─────────────────────────────────────────────────────────
    private function seedLessonPlans(): void
    {
        $subject = Subject::where('code', 'PHY101')->first();
        $section = ClassSection::where('full_name', 'SSS 2 Science')->first();
        $teacher = Staff::where('staff_id', 'STF-2026-002')->first();
        if (!$subject || !$section || !$teacher) return;

        $plans = [
            [
                'title'       => 'Introduction to Electromagnetic Waves',
                'week'        => 'Week 20 (May 12–16)',
                'day'         => 'Monday',
                'period'      => 1,
                'objectives'  => ['Define electromagnetic waves and their properties', 'Identify the electromagnetic spectrum', 'Explain wave-particle duality'],
                'activities'  => ['Interactive lecture with diagrams', 'Group discussion on real-world applications', 'Short video: EM spectrum visualisation'],
                'resources'   => ['Physics Textbook Ch. 14', 'Projector', 'EM spectrum chart'],
                'homework'    => 'Read Ch. 14 pages 201–210. Answer questions 1–5.',
                'status'      => 'completed',
            ],
            [
                'title'       => 'Laws of Reflection and Plane Mirrors',
                'week'        => 'Week 20 (May 12–16)',
                'day'         => 'Wednesday',
                'period'      => 3,
                'objectives'  => ['State the laws of reflection', 'Distinguish between regular and diffuse reflection', 'Solve ray diagram problems'],
                'activities'  => ['Demonstration with mirrors and laser pointer', 'Guided practice problems', 'Pair work: ray diagrams'],
                'resources'   => ['Plane mirrors', 'Laser pointer', 'Protractor', 'Worksheet 14.2'],
                'homework'    => 'Complete worksheet 14.2. Draw 3 ray diagrams.',
                'status'      => 'published',
            ],
            [
                'title'       => "Refraction and Snell's Law",
                'week'        => 'Week 21 (May 19–23)',
                'day'         => 'Monday',
                'period'      => 1,
                'objectives'  => ['Define refraction and refractive index', "Apply Snell's law to solve problems", 'Explain total internal reflection'],
                'activities'  => ['Lab demonstration: light through glass block', "Derivation of Snell's law", 'Practice calculations'],
                'resources'   => ['Glass block', 'Ray box', 'Protractor', 'Calculator'],
                'homework'    => 'Solve problems 1–8 on page 225.',
                'status'      => 'draft',
            ],
        ];

        foreach ($plans as $p) {
            LessonPlan::updateOrCreate(
                ['title' => $p['title'], 'class_section_id' => $section->id],
                [
                    'subject_id'       => $subject->id,
                    'staff_id'         => $teacher->id,
                    'week_label'       => $p['week'],
                    'day'              => $p['day'],
                    'period_number'    => $p['period'],
                    'duration'         => '45 mins',
                    'objectives'       => $p['objectives'],
                    'activities'       => $p['activities'],
                    'resources'        => $p['resources'],
                    'homework'         => $p['homework'],
                    'status'           => $p['status'],
                    'academic_term'    => $this->term,
                    'school_id'        => $this->school,
                ]
            );
        }
    }

    // ─────────────────────────────────────────────────────────
    private function seedConversations(): void
    {
        $teacher  = Staff::where('staff_id', 'STF-2026-002')->first();
        $students = Student::where('school_id', $this->school)->active()->take(3)->get();
        if (!$teacher || $students->isEmpty()) return;

        foreach ($students as $student) {
            $conv = Conversation::updateOrCreate(
                ['staff_id' => $teacher->id, 'student_id' => $student->id],
                ['school_id' => $this->school]
            );

            Message::updateOrCreate(
                ['conversation_id' => $conv->id, 'sender_type' => 'staff'],
                [
                    'sender_id' => $teacher->id,
                    'subject'   => "Update on {$student->first_name}'s Performance",
                    'body'      => "Dear Parent,\n\nI wanted to share a brief update on {$student->first_name}'s progress in Physics this term. Overall performance has been satisfactory, though there is room for improvement in the optics section. Please encourage more study time at home.\n\nBest regards,\nMr. Okafor",
                    'is_read'   => false,
                    'school_id' => $this->school,
                ]
            );
        }
    }

    // ─────────────────────────────────────────────────────────
    private function seedActivityLogs(): void
    {
        $logs = [
            ['payment',   'Term Fee Payment Received',      'Tuition payment of ₦60,000 recorded for GWPL-2026-012 (SSS 2 Science).',  10],
            ['admission', 'New Admission Application',      'Application APP-2026-006 submitted for JSS 1. Pending review.',            70],
            ['meeting',   'Staff Meeting Scheduled',        'Principal has called a general staff meeting for Friday at 3:00 PM.',      180],
            ['system',    'System Maintenance Alert',       'Scheduled portal downtime this Sunday from 02:00 AM to 04:00 AM.',         1500],
            ['payment',   'Bulk Fee Payment Processed',     'Batch payment of ₦300,000 processed for 5 students in SSS 3 Arts.',        2880],
            ['admission', 'Admission List Published',       'The 2026/2027 admission list has been published on the portal.',           4320],
        ];

        foreach ($logs as [$type, $title, $desc, $minutesAgo]) {
            ActivityLog::create([
                'school_id'   => $this->school,
                'type'        => $type,
                'title'       => $title,
                'description' => $desc,
                'created_at'  => now()->subMinutes($minutesAgo),
                'updated_at'  => now()->subMinutes($minutesAgo),
            ]);
        }
    }
}
