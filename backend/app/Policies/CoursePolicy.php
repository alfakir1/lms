<?php

namespace App\Policies;

use App\Infrastructure\Persistence\Models\Course;
use App\Infrastructure\Persistence\Models\User;

class CoursePolicy
{
    public function view(User $user, Course $course)
    {
        if ($user->isRole('admin') || $user->isRole('super_admin')) {
            return true;
        }

        if ($user->isRole('instructor') && $user->instructor) {
            return $course->instructor_id === $user->instructor->id;
        }

        if ($user->isRole('student')) {
            return \App\Infrastructure\Persistence\Models\Enrollment::where('user_id', $user->id)
                ->where('course_id', $course->id)
                ->whereIn('status', ['active', 'completed'])
                ->exists();
        }

        return false;
    }

    public function update(User $user, Course $course)
    {
        return $user->isRole('instructor') && $course->instructor_id === $user->instructor->id;
    }

    public function delete(User $user, Course $course)
    {
        return $user->isRole('instructor') && $course->instructor_id === $user->instructor->id;
    }
}
