<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeePayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'fee_type_id',
        'amount',
        'expected_amount',
        'status',
        'payment_method',
        'payment_reference',
        'description',
        'academic_term',
        'school_id',
        'paid_at'
    ];

    protected $casts = [
        'amount'          => 'float',
        'expected_amount' => 'float',
        'paid_at'         => 'datetime',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function scopeForSchool($query, string $schoolId)
    {
        return $query->where('school_id', $schoolId);
    }

    public function scopeForTerm($query, string $term)
    {
        return $query->where('term', $term);
    }

    
    public function feeType() { 
        return $this->belongsTo(FeeType::class); 
    }

}
