<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // -- Add form_teacher_id FK to class_sections now that staff exists --
        Schema::table('class_sections', function (Blueprint $table) {
            $table->foreign('form_teacher_id')->references('id')->on('staff')->nullOnDelete();
        });

        // -- Add student_id FK to admission_applications now that students exists --
        Schema::table('admission_applications', function (Blueprint $table) {
            $table->foreign('student_id')->references('id')->on('students')->nullOnDelete();
        });

        // -- Add school_id to subjects if missing --
        if (!Schema::hasColumn('subjects', 'school_id')) {
            Schema::table('subjects', function (Blueprint $table) {
                $table->string('school_id')->default('SCH-001');
            });
        }

        // -- Add department_name to staff if missing --
        if (!Schema::hasColumn('staff', 'department_name')) {
            Schema::table('staff', function (Blueprint $table) {
                $table->string('department_name')->nullable()->after('role');
            });
        }

        // -- Add avatar to staff if missing --
        if (!Schema::hasColumn('staff', 'avatar')) {
            Schema::table('staff', function (Blueprint $table) {
                $table->string('avatar')->nullable()->after('phone');
            });
        }

        // -- staff_subject_assignments --
        if (!Schema::hasTable('staff_subject_assignments')) {
            Schema::create('staff_subject_assignments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('staff_id')->nullable()->constrained('staff')->nullOnDelete();
                $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
                $table->foreignId('class_section_id')->constrained('class_sections')->cascadeOnDelete();
                $table->string('academic_term');
                $table->string('school_id');
                $table->timestamps();
            });
        }

        // -- lesson_plans --
        if (!Schema::hasTable('lesson_plans')) {
            Schema::create('lesson_plans', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
                $table->foreignId('class_section_id')->constrained('class_sections')->cascadeOnDelete();
                $table->foreignId('staff_id')->constrained('staff')->cascadeOnDelete();
                $table->string('week_label');
                $table->enum('day', ['Monday','Tuesday','Wednesday','Thursday','Friday']);
                $table->integer('period_number');
                $table->string('duration')->default('45 mins');
                $table->json('objectives')->nullable();
                $table->json('activities')->nullable();
                $table->json('resources')->nullable();
                $table->text('homework')->nullable();
                $table->enum('status', ['draft','published','completed'])->default('draft');
                $table->string('academic_term');
                $table->string('school_id');
                $table->timestamps();
            });
        }

        // -- messages --
        if (!Schema::hasTable('messages')) {
            Schema::create('messages', function (Blueprint $table) {
                $table->id();
                $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('receiver_id')->constrained('users')->cascadeOnDelete();
                $table->text('body');
                $table->boolean('read')->default(false);
                $table->string('school_id');
                $table->timestamps();
            });
        }

        // -- payslips --
        if (!Schema::hasTable('payslips')) {
            Schema::create('payslips', function (Blueprint $table) {
                $table->id();
                $table->foreignId('staff_id')->constrained('staff')->cascadeOnDelete();
                $table->string('month');
                $table->string('year');
                $table->decimal('basic_salary', 12, 2)->default(0);
                $table->decimal('allowances',   12, 2)->default(0);
                $table->decimal('deductions',   12, 2)->default(0);
                $table->decimal('net_pay',       12, 2)->default(0);
                $table->enum('status', ['pending','paid'])->default('pending');
                $table->date('pay_date')->nullable();
                $table->string('school_id');
                $table->timestamps();
            });
        }

        // -- Add class_section_id to attendance if missing --
        if (!Schema::hasColumn('attendance', 'class_section_id')) {
            Schema::table('attendance', function (Blueprint $table) {
                $table->foreignId('class_section_id')
                    ->nullable()->after('staff_id')
                    ->constrained('class_sections')->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('payslips');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('lesson_plans');
        Schema::dropIfExists('staff_subject_assignments');
    }
};
