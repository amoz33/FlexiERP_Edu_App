<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('school_settings')) {
            return;
        }

        if (!Schema::hasColumn('school_settings', 'allow_assessment_entry')) {
            Schema::table('school_settings', function (Blueprint $table) {
                $table->boolean('allow_assessment_entry')->default(true)->after('website_url');
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('school_settings')) {
            return;
        }

        if (Schema::hasColumn('school_settings', 'allow_assessment_entry')) {
            Schema::table('school_settings', function (Blueprint $table) {
                $table->dropColumn('allow_assessment_entry');
            });
        }
    }
};
