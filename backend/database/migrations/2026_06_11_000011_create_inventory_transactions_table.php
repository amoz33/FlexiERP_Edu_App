<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('inventory_transactions')) {
            Schema::create('inventory_transactions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('inventory_item_id')->constrained('inventory_items')->cascadeOnDelete();
                $table->enum('action_type', ['stock_in', 'stock_out']);
                $table->integer('quantity');
                $table->integer('balance_before');
                $table->integer('balance_after');
                $table->string('item_code');
                $table->string('item_name');
                $table->string('category');
                $table->string('recipient_type')->nullable();
                $table->string('recipient_name')->nullable();
                $table->string('reference')->nullable();
                $table->text('note')->nullable();
                $table->date('action_date')->nullable();
                $table->unsignedBigInteger('actor_user_id')->nullable();
                $table->string('actor_name')->nullable();
                $table->string('school_id');
                $table->timestamps();

                $table->index(['school_id', 'action_type']);
                $table->index(['school_id', 'action_date']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_transactions');
    }
};
