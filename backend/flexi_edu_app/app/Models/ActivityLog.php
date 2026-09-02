<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'type',
        'title',
        'description',
    ];

    public function scopeForSchool($query, string $schoolId)
    {
        return $query->where('school_id', $schoolId);
    }

    /*
    |--------------------------------------------------------------------------
    | Helper: log an activity from anywhere in the app
    |--------------------------------------------------------------------------
    | Usage:
    |   ActivityLog::record('SCH-001', 'payment', 'Fee Received', 'Details here');
    */
    public static function record(
        string $schoolId,
        string $type,
        string $title,
        string $description
    ): self {
        return self::create([
            'school_id'   => $schoolId,
            'type'        => $type,
            'title'       => $title,
            'description' => $description,
        ]);
    }

}
