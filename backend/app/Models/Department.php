<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = ['name', 'code', 'school_id'];

    public function staff() { 
        return $this->hasMany(Staff::class); 
    }

    public function subjects() { 
        return $this->hasMany(Subject::class); 
    }


}
