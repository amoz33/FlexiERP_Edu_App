<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = [
        'staff_id',
        'student_id',
        'school_id'
    ];

    public function staff() { 
        return $this->belongsTo(Staff::class); 
    }

    public function student() { 
        return $this->belongsTo(Student::class); 
    }

    public function messages() { 
        return $this->hasMany(Message::class); 
    }

    public function latestMessage() { 
        return $this->hasOne(Message::class)->latestOfMany(); 
    }

}
