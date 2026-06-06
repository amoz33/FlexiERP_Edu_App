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
            $table->date('date_of_birth')->nullable()->after('phone');
            $table->enum('gender', ['Male', 'Female', 'Other'])->nullable()->after('date_of_birth');
            $table->string('state_of_origin')->nullable()->after('gender');
            $table->string('lga')->nullable()->after('state_of_origin');
            $table->string('address')->nullable()->after('lga');
            $table->string('religion')->nullable()->after('address');
            $table->string('nationality')->nullable()->default('Nigerian')->after('religion');

            // Academic
            $table->string('level')->nullable()->after('program');      // JSS 1, SS 2 etc.
            $table->string('previous_school')->nullable()->after('level');

            // Guardian info
            $table->string('guardian_name')->nullable()->after('previous_school');
            $table->string('guardian_relationship')->nullable()->after('guardian_name');
            $table->string('guardian_phone')->nullable()->after('guardian_relationship');
            $table->string('guardian_email')->nullable()->after('guardian_phone');
            $table->string('guardian_occupation')->nullable()->after('guardian_email');

            // Documents — stored as JSON array of file paths
            $table->json('documents')->nullable()->after('guardian_occupation');

            // Admin notes / reviewed by
            $table->string('reviewed_by')->nullable()->after('notes');
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            $table->timestamp('admitted_at')->nullable()->after('reviewed_at');

            // Link to student record after promotion
            $table->foreignId('student_id')->nullable()->constrained('students')->nullOnDelete()->after('admitted_at');
        });
    }

    public function down(): void
    {
        Schema::table('admission_applications', function (Blueprint $table) {
            $table->dropColumn([
                'date_of_birth', 'gender', 'state_of_origin', 'lga', 'address',
                'religion', 'nationality', 'level', 'previous_school',
                'guardian_name', 'guardian_relationship', 'guardian_phone',
                'guardian_email', 'guardian_occupation', 'documents',
                'reviewed_by', 'reviewed_at', 'admitted_at', 'student_id',
            ]);
        });
    }
};
