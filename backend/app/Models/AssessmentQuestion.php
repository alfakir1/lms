<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssessmentQuestion extends Model
{
    protected $fillable = [
        'assessment_id', 
        'lesson_id', 
        'question_text', 
        'question_type', 
        'options', 
        'correct_answer'
    ];

    protected $casts = [
        'options' => 'json',
    ];

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}
