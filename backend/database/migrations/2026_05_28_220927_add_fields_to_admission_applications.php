<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('admission_applications', function (Blueprint $table) {
            // Personal info
            if (!Schema::hasColumn('admission_applications', 'date_of_birth'))
                $table->date('date_of_birth')->nullable()->after('phone');

            if (!Schema::hasColumn('admission_applications', 'gender'))
                $table->enum('gender', ['Male', 'Female', 'Other'])->nullable()->after('date_of_birth');

            if (!Schema::hasColumn('admission_applications', 'state_of_origin'))
                $table->string('state_of_origin')->nullable()->after('gender');

            if (!Schema::hasColumn('admission_applications', 'lga'))
                $table->string('lga')->nullable()->after('state_of_origin');

            if (!Schema::hasColumn('admission_applications', 'address'))
                $table->string('address')->nullable()->after('lga');

            if (!Schema::hasColumn('admission_applications', 'religion'))
                $table->string('religion')->nullable()->after('address');

            if (!Schema::hasColumn('admission_applications', 'nationality'))
                $table->string('nationality')->nullable()->default('Nigerian')->after('religion');

            // Academic
            if (!Schema::hasColumn('admission_applications', 'level'))
                $table->string('level')->nullable()->after('program');

            if (!Schema::hasColumn('admission_applications', 'previous_school'))
                $table->string('previous_school')->nullable()->after('level');

            // Guardian info
            if (!Schema::hasColumn('admission_applications', 'guardian_name'))
                $table->string('guardian_name')->nullable()->after('previous_school');

            if (!Schema::hasColumn('admission_applications', 'guardian_relationship'))
                $table->string('guardian_relationship')->nullable()->after('guardian_name');

            if (!Schema::hasColumn('admission_applications', 'guardian_phone'))
                $table->string('guardian_phone')->nullable()->after('guardian_relationship');

            if (!Schema::hasColumn('admission_applications', 'guardian_email'))
                $table->string('guardian_email')->nullable()->after('guardian_phone');

            if (!Schema::hasColumn('admission_applications', 'guardian_occupation'))
                $table->string('guardian_occupation')->nullable()->after('guardian_email');

            // Documents
            if (!Schema::hasColumn('admission_applications', 'documents'))
                $table->json('documents')->nullable()->after('guardian_occupation');

            // Admin notes
            if (!Schema::hasColumn('admission_applications', 'reviewed_by'))
                $table->string('reviewed_by')->nullable()->after('notes');

            if (!Schema::hasColumn('admission_applications', 'reviewed_at'))
                $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');

            if (!Schema::hasColumn('admission_applications', 'admitted_at'))
                $table->timestamp('admitted_at')->nullable()->after('reviewed_at');

            // Student link
            if (!Schema::hasColumn('admission_applications', 'student_id'))
                $table->foreignId('student_id')->nullable()->constrained('students')->nullOnDelete()->after('admitted_at');
        });
    }

    public function down(): void
    {
        Schema::table('admission_applications', function (Blueprint $table) {
            // Drop foreign key first
            if (Schema::hasColumn('admission_applications', 'student_id'))
                $table->dropForeign(['student_id']);

            $cols = [
                'date_of_birth', 'gender', 'state_of_origin', 'lga', 'address',
                'religion', 'nationality', 'level', 'previous_school',
                'guardian_name', 'guardian_relationship', 'guardian_phone',
                'guardian_email', 'guardian_occupation', 'documents',
                'reviewed_by', 'reviewed_at', 'admitted_at', 'student_id',
            ];

            $existing = array_filter($cols, fn($col) => Schema::hasColumn('admission_applications', $col));
            if (!empty($existing)) $table->dropColumn($existing);
        });
    }
};