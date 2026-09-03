<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('inventory_categories')) {
            Schema::create('inventory_categories', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('school_id');
                $table->timestamps();

                $table->unique(['school_id', 'name']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_categories');
    }
};
