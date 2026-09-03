<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('students', 'user_id')) {
            Schema::table('students', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('school_id')->constrained('users')->nullOnDelete();
                $table->unique('user_id');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('students', 'user_id')) {
            Schema::table('students', function (Blueprint $table) {
                $table->dropUnique(['user_id']);
                $table->dropConstrainedForeignId('user_id');
            });
        }
    }
};
