<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── attendance: add missing columns ────────────────────────────
        Schema::table('attendance', function (Blueprint $table) {
            if (!Schema::hasColumn('attendance', 'subject_id')) {
                $table->foreignId('subject_id')->nullable()->after('student_id')->constrained()->nullOnDelete();
            }
            if (!Schema::hasColumn('attendance', 'staff_id')) {
                $table->foreignId('staff_id')->nullable()->after('subject_id')->constrained('staff')->nullOnDelete();
            }
            if (!Schema::hasColumn('attendance', 'class_section_id')) {
                $table->foreignId('class_section_id')->nullable()->after('staff_id')->constrained()->nullOnDelete();
            }
            if (!Schema::hasColumn('attendance', 'period_number')) {
                $table->integer('period_number')->nullable()->after('date');
            }
        });

        // ── staff: add bank info columns ────────────────────────────────
        Schema::table('staff', function (Blueprint $table) {
            if (!Schema::hasColumn('staff', 'bank_name')) {
                $table->string('bank_name')->nullable()->after('hire_date');
            }
            if (!Schema::hasColumn('staff', 'account_number')) {
                $table->string('account_number')->nullable()->after('bank_name');
            }
            if (!Schema::hasColumn('staff', 'base_pay')) {
                $table->decimal('base_pay', 12, 2)->nullable()->after('account_number');
            }
        });

        // ── timetable_slots ─────────────────────────────────────────────
        if (!Schema::hasTable('timetable_slots')) {
            Schema::create('timetable_slots', function (Blueprint $table) {
                $table->id();
                $table->foreignId('class_section_id')->constrained()->cascadeOnDelete();
                $table->foreignId('subject_id')->nullable()->constrained()->nullOnDelete();
                $table->foreignId('staff_id')->nullable()->constrained('staff')->nullOnDelete();
                $table->enum('day', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
                $table->integer('period_number');
                $table->time('start_time');
                $table->time('end_time');
                $table->string('room')->nullable();
                $table->enum('slot_type', ['lesson', 'break', 'free'])->default('lesson');
                $table->string('label')->nullable();
                $table->string('academic_term');
                $table->string('school_id');
                $table->timestamps();
            });
        }

        // ── assessments ─────────────────────────────────────────────────
        if (!Schema::hasTable('assessments')) {
            Schema::create('assessments', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->enum('type', ['Exam', 'Quiz', 'Assignment', 'Lab', 'CA'])->default('CA');
                $table->enum('category', ['CA', 'Exam'])->default('CA');
                $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
                $table->foreignId('class_section_id')->constrained()->cascadeOnDelete();
                $table->foreignId('staff_id')->constrained('staff')->cascadeOnDelete();
                $table->date('date');
                $table->integer('max_marks');
                $table->integer('weight')->default(10);
                $table->enum('status', ['upcoming', 'grading', 'completed'])->default('upcoming');
                $table->string('academic_term');
                $table->string('school_id');
                $table->timestamps();
            });
        }

        // ── student_grades ──────────────────────────────────────────────
        if (!Schema::hasTable('student_grades')) {
            Schema::create('student_grades', function (Blueprint $table) {
                $table->id();
                $table->foreignId('assessment_id')->constrained()->cascadeOnDelete();
                $table->foreignId('student_id')->constrained()->cascadeOnDelete();
                $table->decimal('marks', 5, 2)->nullable();
                $table->text('remarks')->nullable();
                $table->string('school_id');
                $table->timestamps();
                $table->unique(['assessment_id', 'student_id']);
            });
        }

        // ── grading_scales ──────────────────────────────────────────────
        if (!Schema::hasTable('grading_scales')) {
            Schema::create('grading_scales', function (Blueprint $table) {
                $table->id();
                $table->string('grade');
                $table->integer('lower_bound');
                $table->integer('upper_bound');
                $table->string('remark');
                $table->string('color')->nullable();
                $table->string('school_id');
                $table->timestamps();
            });
        }

        // ── fee_types ───────────────────────────────────────────────────
        if (!Schema::hasTable('fee_types')) {
            Schema::create('fee_types', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('applicable_class')->default('All');
                $table->decimal('amount', 12, 2);
                $table->enum('status', ['active', 'pending', 'overdue'])->default('active');
                $table->string('academic_term');
                $table->string('school_id');
                $table->timestamps();
            });
        }

        // ── fee_payments: add fee_type_id if missing ────────────────────
        Schema::table('fee_payments', function (Blueprint $table) {
            if (!Schema::hasColumn('fee_payments', 'fee_type_id')) {
                $table->foreignId('fee_type_id')->nullable()->after('student_id')->constrained()->nullOnDelete();
            }
            if (!Schema::hasColumn('fee_payments', 'payment_method')) {
                $table->enum('payment_method', ['cash', 'bank_transfer', 'card', 'automated', 'other'])->nullable()->after('status');
            }
            if (!Schema::hasColumn('fee_payments', 'description')) {
                $table->text('description')->nullable()->after('payment_method');
            }
            if (!Schema::hasColumn('fee_payments', 'academic_term')) {
                $table->string('academic_term')->nullable()->after('description');
            }
            if (!Schema::hasColumn('fee_payments', 'paid_at')) {
                $table->timestamp('paid_at')->nullable()->after('academic_term');
            }
        });

        // ── admission_applications ──────────────────────────────────────
        if (!Schema::hasTable('admission_applications')) {
            Schema::create('admission_applications', function (Blueprint $table) {
                $table->id();
                $table->string('application_no')->unique();
                $table->string('first_name');
                $table->string('last_name');
                $table->string('email')->nullable();
                $table->string('phone')->nullable();
                $table->string('program');
                $table->date('date_applied');
                $table->enum('status', ['pending', 'under_evaluation', 'admitted', 'rejected'])->default('pending');
                $table->text('notes')->nullable();
                $table->string('school_id');
                $table->timestamps();
            });
        }

        // ── inventory_items ─────────────────────────────────────────────
        if (!Schema::hasTable('inventory_items')) {
            Schema::create('inventory_items', function (Blueprint $table) {
                $table->id();
                $table->string('item_code')->unique();
                $table->string('name');
                $table->string('category');
                $table->integer('stock_quantity')->default(0);
                $table->integer('reorder_level')->default(10);
                $table->enum('status', ['optimal', 'low_stock', 'out_of_stock'])->default('optimal');
                $table->string('school_id');
                $table->timestamps();
            });
        }

        // ── notices ─────────────────────────────────────────────────────
        if (!Schema::hasTable('notices')) {
            Schema::create('notices', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('audience');
                $table->text('body');
                $table->boolean('is_highlighted')->default(false);
                $table->string('school_id');
                $table->timestamps();
            });
        }

        // ── lesson_plans ────────────────────────────────────────────────
        if (!Schema::hasTable('lesson_plans')) {
            Schema::create('lesson_plans', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
                $table->foreignId('class_section_id')->constrained()->cascadeOnDelete();
                $table->foreignId('staff_id')->constrained('staff')->cascadeOnDelete();
                $table->string('week_label');
                $table->enum('day', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
                $table->integer('period_number');
                $table->string('duration')->default('45 mins');
                $table->json('objectives');
                $table->json('activities');
                $table->json('resources');
                $table->text('homework')->nullable();
                $table->enum('status', ['draft', 'published', 'completed'])->default('draft');
                $table->string('academic_term');
                $table->string('school_id');
                $table->timestamps();
            });
        }

        // ── conversations ───────────────────────────────────────────────
        if (!Schema::hasTable('conversations')) {
            Schema::create('conversations', function (Blueprint $table) {
                $table->id();
                $table->foreignId('staff_id')->constrained('staff')->cascadeOnDelete();
                $table->foreignId('student_id')->constrained()->cascadeOnDelete();
                $table->string('school_id');
                $table->timestamps();
            });
        }

        // ── messages ────────────────────────────────────────────────────
        if (!Schema::hasTable('messages')) {
            Schema::create('messages', function (Blueprint $table) {
                $table->id();
                $table->foreignId('conversation_id')->constrained()->cascadeOnDelete();
                $table->string('sender_type');
                $table->unsignedBigInteger('sender_id');
                $table->string('subject');
                $table->text('body');
                $table->boolean('is_read')->default(false);
                $table->string('school_id');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
        Schema::dropIfExists('conversations');
        Schema::dropIfExists('lesson_plans');
        Schema::dropIfExists('notices');
        Schema::dropIfExists('inventory_items');
        Schema::dropIfExists('admission_applications');
        Schema::dropIfExists('grading_scales');
        Schema::dropIfExists('student_grades');
        Schema::dropIfExists('assessments');
        Schema::dropIfExists('timetable_slots');
        Schema::dropIfExists('fee_types');
    }
};