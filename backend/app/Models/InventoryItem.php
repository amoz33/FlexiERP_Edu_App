<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    protected $fillable = [
        'item_code',
        'name',
        'category',
        'stock_quantity',
        'reorder_level',
        'status',
        'school_id'
    ];

}
