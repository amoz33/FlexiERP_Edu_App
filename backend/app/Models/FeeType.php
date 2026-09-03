<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeType extends Model
{
    protected $fillable = [
        'name',
        'applicable_class',
        'amount',
        'status',
        'academic_term',
        'school_id'
    ];
    
    public function payments() { 
        return $this->hasMany(FeePayment::class); 
    }

}
