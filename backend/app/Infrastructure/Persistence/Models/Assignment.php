<?php

namespace App\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    use HasFactory;

    protected $fillable = ['course_id', 'title', 'description', 'max_grade', 'deadline', 'status'];
    protected $casts = ['deadline' => 'datetime'];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }
}
