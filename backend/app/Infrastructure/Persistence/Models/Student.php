<?php

namespace App\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'status'];

    /* ---------- Relations ---------- */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'user_id', 'user_id');
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'enrollments', 'user_id', 'course_id', 'user_id', 'id');
    }

    public function attendanceRecords()
    {
        return $this->hasMany(Attendance::class);
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }

    public function courseProgress()
    {
        return $this->hasMany(CourseProgress::class);
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class);
    }

    public function prerequisiteExemptions()
    {
        return $this->hasMany(PrerequisiteExemption::class);
    }
}
