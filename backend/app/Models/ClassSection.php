<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassSection extends Model
{
    protected $fillable = ['class_id', 'name', 'full_name', 'capacity', 'form_teacher_id', 'school_id'];

    public function academicClass() { 
        return $this->belongsTo(AcademicClass::class, 'class_id'); 
    }

    public function section()
    {
        return $this->belongsTo(ClassSection::class, 'class_section_id');
    }

    public function formTeacher() { 
        return $this->belongsTo(Staff::class, 'form_teacher_id'); 
    }

    public function timetableSlots() { 
        return $this->hasMany(TimetableSlot::class); 
    }

    public function assignments() { 
        return $this->hasMany(StaffSubjectAssignment::class); 
    }
}
