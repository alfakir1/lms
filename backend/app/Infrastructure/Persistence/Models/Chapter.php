<?php

namespace App\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{
    use HasFactory;

    protected $fillable = ['course_id', 'title', 'slug', 'order_index', 'status'];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function lectures()
    {
        return $this->hasMany(Lecture::class)->orderBy('order_index');
    }

    public function progress()
    {
        return $this->hasMany(CourseProgress::class);
    }
}
