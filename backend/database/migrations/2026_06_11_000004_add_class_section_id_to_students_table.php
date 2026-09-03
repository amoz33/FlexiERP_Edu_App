<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('students', 'class_section_id')) {
            Schema::table('students', function (Blueprint $table) {
                $table->foreignId('class_section_id')
                    ->nullable()
                    ->after('section')
                    ->constrained('class_sections')
                    ->nullOnDelete();
                $table->index(['school_id', 'class_section_id']);
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('students', 'class_section_id')) {
            Schema::table('students', function (Blueprint $table) {
                $table->dropConstrainedForeignId('class_section_id');
                $table->dropIndex(['school_id', 'class_section_id']);
            });
        }
    }
};
