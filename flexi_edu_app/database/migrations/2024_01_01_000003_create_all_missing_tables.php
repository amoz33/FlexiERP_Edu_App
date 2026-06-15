<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // -- 1. departments --
        if (!Schema::hasTable('departments')) {
            Schema::create('departments', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('school_id');
                $table->timestamps();
            });
        }

        // -- 2. classes --
        if (!Schema::hasTable('classes')) {
            Schema::create('classes', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('level');
                $table->integer('order')->default(0);
                $table->string('school_id');
                $table->timestamps();
            });
        }

        // -- 3. subjects --
        if (!Schema::hasTable('subjects')) {
            Schema::create('subjects', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('code')->nullable();
                $table->unsignedBigInteger('department_id')->nullable();
                $table->string('school_id')->default('SCH-001');
                $table->timestamps();
            });
        }

        // -- 4. class_sections (NO staff foreign key yet — staff table not created yet) --
        if (!Schema::hasTable('class_sections')) {
            Schema::create('class_sections', function (Blueprint $table) {
                $table->id();
                $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();
                $table->string('name');
                $table->string('full_name');
                $table->integer('capacity')->default(40);
                $table->unsignedBigInteger('form_teacher_id')->nullable(); // added as plain column, FK added later
                $table->string('school_id');
                $table->timestamps();
            });
        }

        // -- 5. admission_applications --
        if (!Schema::hasTable('admission_applications')) {
            Schema::create('admission_applications', function (Blueprint $table) {
                $table->id();
                $table->string('application_no')->unique();
                $table->string('first_name');
                $table->string('last_name');
                $table->string('email')->nullable();
                $table->string('phone')->nullable();
                $table->date('date_of_birth')->nullable();
                $table->enum('gender', ['Male', 'Female', 'Other'])->nullable();
                $table->string('state_of_origin')->nullable();
                $table->string('lga')->nullable();
                $table->string('address')->nullable();
                $table->string('religion')->nullable();
                $table->string('nationality')->nullable()->default('Nigerian');
                $table->string('program');
                $table->string('level')->nullable();
                $table->string('previous_school')->nullable();
                $table->string('guardian_name')->nullable();
                $table->string('guardian_relationship')->nullable();
                $table->string('guardian_phone')->nullable();
                $table->string('guardian_email')->nullable();
                $table->string('guardian_occupation')->nullable();
                $table->json('documents')->nullable();
                $table->date('date_applied');
                $table->enum('status', ['pending', 'under_evaluation', 'admitted', 'rejected'])->default('pending');
                $table->text('notes')->nullable();
                $table->string('reviewed_by')->nullable();
                $table->timestamp('reviewed_at')->nullable();
                $table->timestamp('admitted_at')->nullable();
                $table->unsignedBigInteger('student_id')->nullable(); // FK added after students table
                $table->string('school_id');
                $table->timestamps();
            });
        }

        // -- 6. school_settings --
        if (!Schema::hasTable('school_settings')) {
            Schema::create('school_settings', function (Blueprint $table) {
                $table->id();
                $table->string('school_id')->unique();
                $table->string('school_name')->default('FlexiERP School');
                $table->string('current_term')->default('2026/Term 1');
                $table->string('current_session')->default('2025/2026');
                $table->string('address')->nullable();
                $table->string('phone')->nullable();
                $table->string('email')->nullable();
                $table->string('logo')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('admission_applications');
        Schema::dropIfExists('class_sections');
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('classes');
        Schema::dropIfExists('departments');
        Schema::dropIfExists('school_settings');
    }
};
