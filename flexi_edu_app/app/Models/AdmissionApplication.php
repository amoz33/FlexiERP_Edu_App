<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdmissionApplication extends Model
{
    protected $fillable = [
        'application_no',
        'first_name',
        'last_name',
        'email',
        'phone',
        'program',
        'date_applied',
        'status',
        'notes',
        'school_id'
    ];

    protected $casts = [
        'date_applied' => 'date'
    ];

    public function getFullNameAttribute() { 
        return "{$this->first_name} {$this->last_name}"; 
    }
    
}
