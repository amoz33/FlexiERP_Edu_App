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

        if (!Schema::hasColumn('school_settings', 'school_logo_path')) {
            Schema::table('school_settings', function (Blueprint $table) {
                $table->string('school_logo_path')->nullable();
            });
        }

        if (!Schema::hasColumn('school_settings', 'school_seal_path')) {
            Schema::table('school_settings', function (Blueprint $table) {
                $table->string('school_seal_path')->nullable();
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('school_settings')) {
            return;
        }

        if (Schema::hasColumn('school_settings', 'school_seal_path')) {
            Schema::table('school_settings', function (Blueprint $table) {
                $table->dropColumn('school_seal_path');
            });
        }

    }
};
