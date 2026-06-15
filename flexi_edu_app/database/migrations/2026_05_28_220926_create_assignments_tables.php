<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── assignments (teacher creates) ─────────────────────────────────
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('subject_id')->constrained('subjects');
            $table->foreignId('class_section_id')->constrained('class_sections');
            $table->foreignId('staff_id')->constrained('staff');
            $table->date('due_date');
            $table->string('academic_term');
            $table->enum('status', ['active', 'closed', 'draft'])->default('active');
            $table->string('school_id');
            $table->timestamps();

            $table->index(['class_section_id', 'school_id']);
            $table->index(['staff_id', 'school_id']);
        });

        // ── assignment_submissions (student submits) ──────────────────────
        Schema::create('assignment_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')->constrained('assignments')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students');
            $table->text('note')->nullable();
            $table->string('file_name')->nullable();        // original filename shown to user
            $table->string('file_path')->nullable();        // storage path: schools/{school_id}/assignments/{student_id}/{uuid}.ext
            $table->string('file_size')->nullable();        // e.g. "2.4 MB"
            $table->string('file_mime')->nullable();        // mime type
            $table->enum('status', ['submitted', 'reviewed', 'returned'])->default('submitted');
            $table->text('teacher_feedback')->nullable();
            $table->string('school_id');
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();

            $table->unique(['assignment_id', 'student_id']);  // one submission per student per assignment
            $table->index(['student_id', 'school_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assignment_submissions');
        Schema::dropIfExists('assignments');
    }
};
