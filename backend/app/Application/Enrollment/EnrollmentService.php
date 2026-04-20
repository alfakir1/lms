<?php

namespace App\Application\Enrollment;

use App\Infrastructure\Persistence\Models\Student;
use App\Infrastructure\Persistence\Models\Course;
use App\Infrastructure\Persistence\Models\Enrollment;
use App\Infrastructure\Persistence\Models\CourseDiscount;
use App\Infrastructure\Persistence\Models\PrerequisiteExemption;
use Illuminate\Support\Facades\DB;

class EnrollmentService
{
    /**
     * Check if a student meets prerequisites for a course.
     */
    public function meetsPrerequisites(Student $student, Course $course): bool
    {
        $prerequisites = $course->prerequisites;

        if ($prerequisites->isEmpty()) {
            return true;
        }

        // Check if there's an approved exemption
        $hasExemption = PrerequisiteExemption::where('student_id', $student->id)
            ->where('course_id', $course->id)
            ->exists();

        if ($hasExemption) {
            return true;
        }

        // Check if student completed every prerequisite course
        foreach ($prerequisites as $prereq) {
            $completed = Enrollment::where('student_id', $student->id)
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
    public function calculatePrice(Student $student, Course $course): float
    {
        $discount = CourseDiscount::where('course_id', $course->id)
            ->where(fn ($q) => $q->whereNull('student_id')->orWhere('student_id', $student->id))
            ->where('is_active', true)
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->orderByDesc('discount_percentage')
            ->first();

        if (! $discount) {
            return (float) $course->price;
        }

        return round($course->price * (1 - $discount->discount_percentage / 100), 2);
    }

    /**
     * Enroll a student in a course (wraps prerequisite check + discount).
     */
    public function enroll(Student $student, Course $course): Enrollment
    {
        if (! $this->meetsPrerequisites($student, $course)) {
            throw new \Exception('Student does not meet course prerequisites.');
        }

        $alreadyEnrolled = Enrollment::where('student_id', $student->id)
            ->where('course_id', $course->id)
            ->whereIn('status', ['pending', 'active'])
            ->exists();

        if ($alreadyEnrolled) {
            throw new \Exception('Student is already enrolled in this course.');
        }

        return DB::transaction(function () use ($student, $course) {
            $finalPrice = $this->calculatePrice($student, $course);

            return Enrollment::create([
                'student_id'     => $student->id,
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
