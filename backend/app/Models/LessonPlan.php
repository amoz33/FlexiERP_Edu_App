<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LessonPlan extends Model
{
    protected $fillable = [
        'title',
        'subject_id',
        'class_section_id',
        'staff_id',
        'week_label',
        'day',
        'period_number',
        'duration',
        'objectives',
        'activities',
        'resources',
        'homework',
        'status',
        'academic_term',
        'school_id'
    ];

    protected $casts = [
        'objectives' => 'array', 
        'activities' => 'array', 
        'resources' => 'array'
    ];

    public function subject() { 
        return $this->belongsTo(Subject::class); 
    }

    public function section() { 
        return $this->belongsTo(ClassSection::class, 'class_section_id');
    }

    public function staff() { 
        return $this->belongsTo(Staff::class); 
    }
    
}
