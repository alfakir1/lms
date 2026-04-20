<?php

namespace App\Policies;

use App\Infrastructure\Persistence\Models\Course;
use App\Infrastructure\Persistence\Models\User;

class CoursePolicy
{
    public function update(User $user, Course $course)
    {
        return $user->isRole('instructor') && $course->instructor_id === $user->instructor->id;
    }

    public function delete(User $user, Course $course)
    {
        return $user->isRole('instructor') && $course->instructor_id === $user->instructor->id;
    }
}
