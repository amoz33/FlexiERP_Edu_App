<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicTerm extends Model
{
    protected $fillable = [
        'name',
        'academic_year',
        'start_date',
        'end_date',
        'weeks',
        'status',
        'is_active',
        'school_id',
    ];

    protected $casts = [
        'weeks'     => 'integer',
        'is_active' => 'boolean',
    ];
}
