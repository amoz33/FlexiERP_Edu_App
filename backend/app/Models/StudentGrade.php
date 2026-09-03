<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentGrade extends Model
{
    protected $fillable = [
        'assessment_id',
        'student_id',
        'marks',
        'remarks',
        'school_id'
    ];

    protected $casts = [
        'marks' => 'float',
    ];

    public function assessment() { 
        return $this->belongsTo(Assessment::class); 
    }
    
    public function student() { 
        return $this->belongsTo(Student::class); 
    }
    
}
