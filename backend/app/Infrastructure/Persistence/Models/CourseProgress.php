<?php

namespace App\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseProgress extends Model
{
    use HasFactory;

    protected $table = 'course_progress';
    protected $fillable = [
        'student_id', 'course_id', 'chapter_id',
        'lecture_id', 'progress_percentage', 'last_accessed_at',
    ];
    protected $casts = ['last_accessed_at' => 'datetime'];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }

    public function lecture()
    {
        return $this->belongsTo(Lecture::class);
    }
}
