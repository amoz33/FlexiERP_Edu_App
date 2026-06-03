<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GradingScale extends Model
{

    protected $fillable = [
        'grade',
        'lower_bound',
        'upper_bound',
        'remark',
        'color',
        'school_id'
    ];
    
        
}
