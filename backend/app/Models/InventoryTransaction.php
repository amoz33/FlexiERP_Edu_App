<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryTransaction extends Model
{
    protected $fillable = [
        'inventory_item_id',
        'action_type',
        'quantity',
        'balance_before',
        'balance_after',
        'item_code',
        'item_name',
        'category',
        'recipient_type',
        'recipient_name',
        'reference',
        'note',
        'action_date',
        'actor_user_id',
        'actor_name',
        'school_id',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'balance_before' => 'integer',
        'balance_after' => 'integer',
        'action_date' => 'date',
        'actor_user_id' => 'integer',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
    }
}
