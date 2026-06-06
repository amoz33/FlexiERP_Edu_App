<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            // Passport photo — school-scoped storage path
            $table->string('avatar')->nullable()->after('phone');

            // Medical records
            $table->string('blood_group')->nullable()->after('avatar');
            $table->string('genotype')->nullable()->after('blood_group');
            $table->text('allergies')->nullable()->after('genotype');
            $table->text('medical_conditions')->nullable()->after('allergies');
            $table->text('medications')->nullable()->after('medical_conditions');
            $table->text('medical_notes')->nullable()->after('medications');
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'avatar', 'blood_group', 'genotype',
                'allergies', 'medical_conditions', 'medications', 'medical_notes',
            ]);
        });
    }
};
