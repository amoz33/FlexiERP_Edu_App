<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('classes', function (Blueprint $table) {
            $table->unsignedInteger('capacity_total')->nullable()->after('order');
            $table->string('lead_faculty')->nullable()->after('capacity_total');
        });
    }

    public function down(): void
    {
        Schema::table('classes', function (Blueprint $table) {
            $table->dropColumn(['capacity_total', 'lead_faculty']);
        });
    }
};
