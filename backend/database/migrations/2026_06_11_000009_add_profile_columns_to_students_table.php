<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            if (! Schema::hasColumn('students', 'admission_no')) {
                $table->string('admission_no')->nullable()->after('student_id');
            }

            if (! Schema::hasColumn('students', 'gender')) {
                $table->enum('gender', ['Male', 'Female', 'Other'])->nullable()->after('phone');
            }

            if (! Schema::hasColumn('students', 'date_of_birth')) {
                $table->date('date_of_birth')->nullable()->after('gender');
            }

            if (! Schema::hasColumn('students', 'address')) {
                $table->string('address')->nullable()->after('date_of_birth');
            }

            if (! Schema::hasColumn('students', 'parent_name')) {
                $table->string('parent_name')->nullable()->after('address');
            }

            if (! Schema::hasColumn('students', 'parent_phone')) {
                $table->string('parent_phone')->nullable()->after('parent_name');
            }

            if (! Schema::hasColumn('students', 'parent_email')) {
                $table->string('parent_email')->nullable()->after('parent_phone');
            }
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $dropColumns = [];

            foreach ([
                'admission_no',
                'gender',
                'date_of_birth',
                'address',
                'parent_name',
                'parent_phone',
                'parent_email',
            ] as $column) {
                if (Schema::hasColumn('students', $column)) {
                    $dropColumns[] = $column;
                }
            }

            if ($dropColumns !== []) {
                $table->dropColumn($dropColumns);
            }
        });
    }
};
