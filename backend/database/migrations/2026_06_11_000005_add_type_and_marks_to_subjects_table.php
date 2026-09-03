<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('subjects')) {
            return;
        }

        Schema::table('subjects', function (Blueprint $table) {
            if (!Schema::hasColumn('subjects', 'type')) {
                $table->string('type')->nullable()->after('name');
            }

            if (!Schema::hasColumn('subjects', 'max_theory_marks')) {
                $table->unsignedInteger('max_theory_marks')->nullable()->after('type');
            }

            if (!Schema::hasColumn('subjects', 'max_practical_marks')) {
                $table->unsignedInteger('max_practical_marks')->nullable()->after('max_theory_marks');
            }
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('subjects')) {
            return;
        }

        Schema::table('subjects', function (Blueprint $table) {
            if (Schema::hasColumn('subjects', 'max_practical_marks')) {
                $table->dropColumn('max_practical_marks');
            }

            if (Schema::hasColumn('subjects', 'max_theory_marks')) {
                $table->dropColumn('max_theory_marks');
            }

            if (Schema::hasColumn('subjects', 'type')) {
                $table->dropColumn('type');
            }
        });
    }
};

