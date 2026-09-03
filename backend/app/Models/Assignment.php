<?php
// ── app/Models/Assignment.php ─────────────────────────────────────────────

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'subject_id', 'class_section_id',
        'staff_id', 'due_date', 'academic_term', 'status', 'school_id',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    public function subject()       { return $this->belongsTo(Subject::class); }
    public function section()       { return $this->belongsTo(ClassSection::class, 'class_section_id'); }
    public function staff()         { return $this->belongsTo(Staff::class); }
    public function submissions()   { return $this->hasMany(AssignmentSubmission::class); }

    public function scopeForSchool($q, $id) { return $q->where('school_id', $id); }
    public function scopeActive($q)          { return $q->where('status', 'active'); }
}
