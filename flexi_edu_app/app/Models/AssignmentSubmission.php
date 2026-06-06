<?php
// ── app/Models/AssignmentSubmission.php ───────────────────────────────────

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssignmentSubmission extends Model
{
    protected $fillable = [
        'assignment_id', 'student_id', 'note', 'file_name',
        'file_path', 'file_size', 'file_mime', 'status',
        'teacher_feedback', 'school_id', 'submitted_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function assignment() { return $this->belongsTo(Assignment::class); }
    public function student()    { return $this->belongsTo(Student::class); }

    /*
     * Returns the public URL to download/view the file.
     * Uses the school-scoped storage path.
     */
    public function getFileUrlAttribute(): ?string
    {
        if (!$this->file_path) return null;
        return asset('storage/' . $this->file_path);
    }
}
