<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Staff extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'staff';

    protected $fillable = [
        'user_id',
        'staff_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'avatar',
        'address',
        'department_id',
        'role_title',
        'role',
        'status',
        'school_id',
        'hire_date',
        'bank_name', 
        'account_number', 
        'base_pay'
    ];

    protected $casts = [
        'hire_date' => 'date',
    ];

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeForSchool($query, string $schoolId)
    {
        return $query->where('school_id', $schoolId);
    }

    public function department() { 
        return $this->belongsTo(Department::class); 
    }

    public function user() { 
        return $this->belongsTo(User::class); 
    }

    public function subjectAssignments() { 
        return $this->hasMany(StaffSubjectAssignment::class); 
    }

    public function assessments() { 
        return $this->hasMany(Assessment::class); 
    }

    public function lessonPlans() { 
        return $this->hasMany(LessonPlan::class); 
    }

}
