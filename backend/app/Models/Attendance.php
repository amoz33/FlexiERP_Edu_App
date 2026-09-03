<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory;

    protected $table = 'attendance';

    protected $fillable = [
        'student_id',
        'subject_id',
        'staff_id',
        'class_section_id',
        'date',
        'period_number',
        'status',
        'note',
        'school_id'
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function scopeForSchool($query, string $schoolId)
    {
        return $query->where('school_id', $schoolId);
    }

    public function scopeToday($query)
    {
        return $query->whereDate('date', today());
    }
   
    public function subject() { 
        return $this->belongsTo(Subject::class); 
    }

    public function staff() { 
        return $this->belongsTo(Staff::class); 
    }
}
