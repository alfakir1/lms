<?php

namespace App\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrerequisiteExemption extends Model
{
    use HasFactory;

    protected $fillable = ['student_id', 'course_id', 'reason', 'document_path', 'approved_by'];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
