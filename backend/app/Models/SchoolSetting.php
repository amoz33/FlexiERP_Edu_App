<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolSetting extends Model
{
    protected $fillable = [
        'school_id',
        'school_name',
        'school_logo_path',
        'school_seal_path',
        'main_address',
        'phone_number',
        'email',
        'website_url',
        'allow_assessment_entry',
    ];

    protected $casts = [
        'allow_assessment_entry' => 'boolean',
    ];
}
