<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    protected $fillable = ['course_id', 'lesson_id', 'title', 'description', 'file_url', 'deadline', 'max_grade'];
    
    protected $casts = [
        'deadline' => 'datetime',
        'max_grade' => 'integer'
    ];

    protected $appends = ['due_date'];

    public function getDueDateAttribute(): ?string
    {
        return $this->deadline;
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }
}
