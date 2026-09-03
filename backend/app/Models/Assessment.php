<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    protected $fillable = [
        'title',
        'type',
        'category',
        'subject_id',
        'class_section_id',
        'staff_id',
        'date',
        'max_marks',
        'weight',
        'status',
        'academic_term',
        'school_id'
    ];

    protected $casts = ['date' => 'date'];
    
    public function subject() { 
        return $this->belongsTo(Subject::class); 
    }
    
    public function section() { 
        return $this->belongsTo(ClassSection::class, 'class_section_id'); 
    }
    
    public function staff() { 
        return $this->belongsTo(Staff::class); 
    }
    
    public function grades() { 
        return $this->hasMany(StudentGrade::class); 
    }
}
