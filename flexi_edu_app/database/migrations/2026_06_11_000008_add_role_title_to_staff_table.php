<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('staff', 'role_title')) {
            Schema::table('staff', function (Blueprint $table) {
                $table->string('role_title')->nullable()->after('role');
            });
        }

        DB::table('staff')
            ->whereNull('role_title')
            ->update([
                'role_title' => DB::raw("
                    CASE
                        WHEN role = 'teacher' THEN 'Teaching Staff'
                        WHEN role = 'admin' THEN 'Administrative Staff'
                        WHEN role = 'support' THEN 'Support Staff'
                        WHEN role = 'parent' THEN 'Parent'
                        ELSE role
                    END
                "),
            ]);
    }

    public function down(): void
    {
        if (Schema::hasColumn('staff', 'role_title')) {
            Schema::table('staff', function (Blueprint $table) {
                $table->dropColumn('role_title');
            });
        }
    }
};
