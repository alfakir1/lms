<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssessmentSubmission extends Model
{
    protected $fillable = [
        'assessment_id', 
        'student_id', 
        'answers', 
        'started_at', 
        'submitted_at', 
        'grade', 
        'feedback'
    ];

    protected $casts = [
        'answers' => 'json',
        'started_at' => 'datetime',
        'submitted_at' => 'datetime',
    ];

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
