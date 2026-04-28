<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    protected $fillable = ['course_id', 'title', 'description', 'file_url', 'deadline'];

    // Expose deadline as due_date for API consumers
    protected $appends = ['due_date', 'max_grade'];

    public function getDueDateAttribute(): ?string
    {
        return $this->deadline;
    }

    public function getMaxGradeAttribute(): int
    {
        return 100; // default since column doesn't exist in DB
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }
}
