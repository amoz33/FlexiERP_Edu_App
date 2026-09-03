<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = [
        'code',
        'name',
        'type',
        'department_id',
        'max_theory_marks',
        'max_practical_marks',
        'school_id'
    ];

    public function department() { 
        return $this->belongsTo(Department::class); 
    }

    public function assignments() { 
        return $this->hasMany(StaffSubjectAssignment::class); 
    }

    public function assessments() { 
        return $this->hasMany(Assessment::class); 
    }
    
}
