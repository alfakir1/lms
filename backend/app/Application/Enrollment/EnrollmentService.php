<?php

namespace App\Application\Enrollment;

use App\Infrastructure\Persistence\Models\User;
use App\Infrastructure\Persistence\Models\Course;
use App\Infrastructure\Persistence\Models\Enrollment;
use App\Infrastructure\Persistence\Models\CourseDiscount;
use App\Infrastructure\Persistence\Models\PrerequisiteExemption;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class EnrollmentService
{
    /**
     * Check if a user meets prerequisites for a course.
     */
    public function meetsPrerequisites(User $user, Course $course): bool
    {
        $prerequisites = $course->prerequisites;

        if ($prerequisites->isEmpty()) {
            return true;
        }

        $student = $user->student;
        if (! $student) {
            return false;
        }

        // Check if there's an approved exemption
        // Backward compatibility: older DBs might have user_id instead of student_id
        $exemptionsQuery = PrerequisiteExemption::query()->where('course_id', $course->id);
        if (Schema::hasColumn('prerequisite_exemptions', 'student_id')) {
            $exemptionsQuery->where('student_id', $student->id);
        } else {
            $exemptionsQuery->where('user_id', $user->id);
        }
        $hasExemption = $exemptionsQuery->exists();

        if ($hasExemption) {
            return true;
        }

        // Check if student completed every prerequisite course
        foreach ($prerequisites as $prereq) {
            $completed = Enrollment::where('user_id', $user->id)
                ->where('course_id', $prereq->id)
                ->where('status', 'completed')
                ->exists();

            if (! $completed) {
                return false;
            }
        }

        return true;
    }

    /**
     * Calculate the final price after any active discount.
     */
    public function calculatePrice(User $user, Course $course): float
    {
        $student = $user->student;

        $discountQuery = CourseDiscount::query()->where('course_id', $course->id)
            ->where('is_active', true)
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->orderByDesc('discount_percentage');

        // Backward compatibility: older DBs might have user_id instead of student_id
        if (Schema::hasColumn('course_discounts', 'student_id')) {
            if (! $student) {
                // Only allow global discounts (student_id NULL) if we cannot resolve student
                $discountQuery->whereNull('student_id');
            } else {
                $discountQuery->where(fn ($q) => $q->whereNull('student_id')->orWhere('student_id', $student->id));
            }
        } else {
            $discountQuery->where(fn ($q) => $q->whereNull('user_id')->orWhere('user_id', $user->id));
        }

        $discount = $discountQuery->first();

        if (! $discount) {
            return (float) $course->price;
        }

        return round($course->price * (1 - $discount->discount_percentage / 100), 2);
    }

    /**
     * Enroll a user in a course (wraps prerequisite check + discount).
     */
    public function enroll(User $user, Course $course): Enrollment
    {
        if (! $this->meetsPrerequisites($user, $course)) {
            throw new \Exception('User does not meet course prerequisites.');
        }

        $alreadyEnrolled = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->whereIn('status', ['pending', 'active'])
            ->exists();

        if ($alreadyEnrolled) {
            throw new \Exception('User is already enrolled in this course.');
        }

        return DB::transaction(function () use ($user, $course) {
            $finalPrice = $this->calculatePrice($user, $course);

            return Enrollment::create([
                'user_id'        => $user->id,
                'course_id'      => $course->id,
                'payment_status' => $finalPrice > 0 ? 'unpaid' : 'paid',
                'status'         => 'pending',
                'enrolled_at'    => now(),
            ]);
        });
    }

    /**
     * Admin approves a pending enrollment.
     */
    public function approve(Enrollment $enrollment): Enrollment
    {
        $enrollment->update(['status' => 'active']);
        return $enrollment;
    }

    /**
     * Admin bans a student from a course with a documented reason.
     */
    public function ban(Enrollment $enrollment, string $reason, ?string $documentPath = null): Enrollment
    {
        $enrollment->update([
            'status'       => 'banned',
            'ban_reason'   => $reason,
            'ban_document' => $documentPath,
        ]);

        return $enrollment;
    }
}
