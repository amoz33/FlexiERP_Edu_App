<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('school_settings')) {
            return;
        }

        Schema::table('school_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('school_settings', 'main_address')) {
                $table->string('main_address')->nullable();
            }

            if (!Schema::hasColumn('school_settings', 'phone_number')) {
                $table->string('phone_number')->nullable();
            }

            if (!Schema::hasColumn('school_settings', 'school_logo_path')) {
                $table->string('school_logo_path')->nullable();
            }

            if (!Schema::hasColumn('school_settings', 'website_url')) {
                $table->string('website_url')->nullable();
            }
        });

        if (Schema::hasColumn('school_settings', 'address')) {
            DB::statement("
                UPDATE school_settings
                SET main_address = COALESCE(NULLIF(main_address, ''), address)
                WHERE address IS NOT NULL AND address != ''
            ");
        }

        if (Schema::hasColumn('school_settings', 'phone')) {
            DB::statement("
                UPDATE school_settings
                SET phone_number = COALESCE(NULLIF(phone_number, ''), phone)
                WHERE phone IS NOT NULL AND phone != ''
            ");
        }

        if (Schema::hasColumn('school_settings', 'logo')) {
            DB::statement("
                UPDATE school_settings
                SET school_logo_path = COALESCE(NULLIF(school_logo_path, ''), logo)
                WHERE logo IS NOT NULL AND logo != ''
            ");
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('school_settings')) {
            return;
        }

        Schema::table('school_settings', function (Blueprint $table) {
            if (Schema::hasColumn('school_settings', 'website_url')) {
                $table->dropColumn('website_url');
            }

            if (Schema::hasColumn('school_settings', 'school_logo_path')) {
                $table->dropColumn('school_logo_path');
            }

            if (Schema::hasColumn('school_settings', 'phone_number')) {
                $table->dropColumn('phone_number');
            }

            if (Schema::hasColumn('school_settings', 'main_address')) {
                $table->dropColumn('main_address');
            }
        });
    }
};

