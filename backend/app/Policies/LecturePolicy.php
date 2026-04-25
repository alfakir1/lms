<?php

namespace App\Policies;

use App\Infrastructure\Persistence\Models\Lecture;
use App\Infrastructure\Persistence\Models\User;
use App\Infrastructure\Persistence\Models\Enrollment;

class LecturePolicy
{
    public function view(User $user, Lecture $lecture)
    {
        $courseId = $lecture->chapter->course_id;

        // Instructor owns course
        if ($user->isRole('instructor')) {
            return $lecture->chapter->course->instructor_id === $user->instructor->id;
        }

        // Admin can view all
        if ($user->isRole('admin') || $user->isRole('super_admin')) {
            return true;
        }

        // Student must be enrolled
        if ($user->isRole('student')) {
            return Enrollment::where('user_id', $user->id)
                ->where('course_id', $courseId)
                ->whereIn('status', ['active', 'completed'])
                ->exists();
        }

        return false;
    }

    public function update(User $user, Lecture $lecture)
    {
        if ($user->isRole('admin') || $user->isRole('super_admin')) {
            return true;
        }

        if ($user->isRole('instructor') && $user->instructor) {
            return $lecture->chapter->course->instructor_id === $user->instructor->id;
        }

        return false;
    }

    public function delete(User $user, Lecture $lecture)
    {
        return $this->update($user, $lecture);
    }
}
