<?php

namespace App\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lecture extends Model
{
    use HasFactory;

    protected $fillable = [
        'chapter_id', 'title', 'slug', 'content_type',
        'content_url', 'duration', 'order_index', 'status',
    ];

    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }

    public function course()
    {
        return $this->hasOneThrough(Course::class, Chapter::class, 'id', 'id', 'chapter_id', 'course_id');
    }

    public function progress()
    {
        return $this->hasMany(CourseProgress::class);
    }
}
