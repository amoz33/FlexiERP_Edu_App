<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StaffSubjectAssignment extends Model
{

     protected $fillable = [
        'staff_id',
        'subject_id',
        'class_section_id',
        'academic_term',
        'school_id'
    ];

    public function staff() { 
        return $this->belongsTo(Staff::class); 
    }

    public function subject() { 
        return $this->belongsTo(Subject::class); 
    }

    public function section() { 
        return $this->belongsTo(ClassSection::class, 'class_section_id'); 
    }
}
