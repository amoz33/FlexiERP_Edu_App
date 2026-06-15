<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    if (!Schema::hasTable('school_settings')) {
        Schema::create('school_settings', function (Blueprint $table) {
            $table->id();
            $table->string('school_id');
            $table->string('school_name')->nullable();
            $table->string('school_logo_path')->nullable();
            $table->string('main_address')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('email')->nullable();
            $table->string('website_url')->nullable();
            $table->timestamps();
        });
    } else {
        // Table exists — add any NEW columns that may be missing
        Schema::table('school_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('school_settings', 'website_url'))
                $table->string('website_url')->nullable();
            // add guards for any other new columns here
        });
    }
}

public function down(): void
{
    Schema::dropIfExists('school_settings');
}
};
