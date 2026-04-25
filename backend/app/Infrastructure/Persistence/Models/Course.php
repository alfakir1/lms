<?php

namespace App\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'instructor_id', 'title', 'description', 'price',
        'slug', 'release_date', 'status',
    ];

    protected $casts = ['release_date' => 'datetime'];

    /* ---------- Relations ---------- */
    public function instructor()
    {
        return $this->belongsTo(Instructor::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'course_category');
    }

    public function chapters()
    {
        return $this->hasMany(Chapter::class)->orderBy('order_index');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'enrollments', 'course_id', 'user_id', 'id', 'user_id');
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    public function attendanceSessions()
    {
        return $this->hasMany(AttendanceSession::class);
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class);
    }

    public function prerequisites()
    {
        return $this->belongsToMany(Course::class, 'course_prerequisites', 'course_id', 'prerequisite_course_id');
    }

    public function requiredBy()
    {
        return $this->belongsToMany(Course::class, 'course_prerequisites', 'prerequisite_course_id', 'course_id');
    }

    public function discounts()
    {
        return $this->hasMany(CourseDiscount::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
