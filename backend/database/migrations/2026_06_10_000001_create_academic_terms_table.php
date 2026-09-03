<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('academic_terms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('academic_year')->nullable();
            $table->string('start_date');
            $table->string('end_date');
            $table->unsignedInteger('weeks')->default(0);
            $table->string('status')->default('Upcoming');
            $table->boolean('is_active')->default(false);
            $table->string('school_id');
            $table->timestamps();

            $table->index(['school_id', 'academic_year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('academic_terms');
    }
};
