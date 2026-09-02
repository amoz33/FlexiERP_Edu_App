<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    protected $fillable = [
        'title',
        'audience',
        'body',
        'is_highlighted',
        'school_id'
    ];

    protected $casts = [
        'is_highlighted' => 'boolean'
    ];
    
}
