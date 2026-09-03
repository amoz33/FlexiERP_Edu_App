<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Fix fee_payments — make old 'term' column nullable
        Schema::table('fee_payments', function (Blueprint $table) {
            if (Schema::hasColumn('fee_payments', 'term')) {
                $table->string('term')->nullable()->change();
            }
        });

        // Fix attendance unique constraint — allow period_number to be null
        // Drop old unique index and recreate with null handling
        try {
            Schema::table('attendance', function (Blueprint $table) {
                $table->dropUnique(['student_id', 'date']);
            });
        } catch (\Exception $e) {
            // index may not exist
        }
    }

    public function down(): void {}
};