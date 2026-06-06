<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AdmissionApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_no',
        'first_name',
        'last_name',
        'email',
        'phone',
        'date_of_birth',
        'gender',
        'state_of_origin',
        'lga',
        'address',
        'religion',
        'nationality',
        'program',
        'level',
        'previous_school',
        'guardian_name',
        'guardian_relationship',
        'guardian_phone',
        'guardian_email',
        'guardian_occupation',
        'documents',
        'notes',
        'reviewed_by',
        'reviewed_at',
        'admitted_at',
        'student_id',
        'date_applied',
        'status',
        'school_id',
    ];

    protected $casts = [
        'date_applied' => 'date',
        'date_of_birth'=> 'date',
        'reviewed_at'  => 'datetime',
        'admitted_at'  => 'datetime',
        'documents'    => 'array',
    ];

    // Relationship to the student created on admission
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    // Route model binding uses application_no not id
    public function getRouteKeyName(): string
    {
        return 'application_no';
    }

    public function scopeForSchool($query, $schoolId)
    {
        return $query->where('school_id', $schoolId);
    }
}
