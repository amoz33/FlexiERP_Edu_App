<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimetableSlot extends Model
{

    protected $fillable = [
        'class_section_id',
        'subject_id','staff_id',
        'day',
        'period_number',
        'start_time','end_time',
        'room',
        'slot_type',
        'label',
        'academic_term',
        'school_id'
    ];

    public function section() { 
        return $this->belongsTo(ClassSection::class, 'class_section_id'); 
    }

    public function subject() { 
        return $this->belongsTo(Subject::class); 
    }

    public function staff() {
        return $this->belongsTo(Staff::class); 
    }

}
