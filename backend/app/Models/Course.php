<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = ['title', 'description', 'price', 'start_date', 'end_date', 'duration_days', 'min_students', 'max_students', 'instructor_id', 'status', 'parent_id', 'group_name'];
    
    public function parent()
    {
        return $this->belongsTo(Course::class, 'parent_id');
    }

    public function instances()
    {
        return $this->hasMany(Course::class, 'parent_id');
    }

    public function instructor()
    {
        return $this->belongsTo(Instructor::class);
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }


    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'enrollments');
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    public function attendance()
    {
        return $this->hasMany(Attendance::class);
    }

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    public function assessments()
    {
        return $this->hasMany(Assessment::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
