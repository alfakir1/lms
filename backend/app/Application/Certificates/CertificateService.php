<?php

namespace App\Application\Certificates;

use App\Infrastructure\Persistence\Models\Student;
use App\Infrastructure\Persistence\Models\Course;
use App\Infrastructure\Persistence\Models\Enrollment;
use App\Infrastructure\Persistence\Models\Certificate;
use Illuminate\Support\Facades\Storage;

class CertificateService
{
    /**
     * Check if a student is eligible for a certificate.
     * Eligibility: enrollment is 'completed' + all assignments graded.
     */
    public function isEligible(Student $student, Course $course): bool
    {
        $enrollment = Enrollment::where('user_id', $student->user_id)
            ->where('course_id', $course->id)
            ->where('status', 'completed')
            ->first();

        return (bool) $enrollment;
    }

    /**
     * Issue a certificate for a student (idempotent — safe to call multiple times).
     */
    public function issue(Student $student, Course $course): Certificate
    {
        if (! $this->isEligible($student, $course)) {
            throw new \Exception('Student has not completed this course.');
        }

        // Return existing certificate if already issued
        $existing = Certificate::where('student_id', $student->id)
            ->where('course_id', $course->id)
            ->first();

        if ($existing) {
            return $existing;
        }

        // In a real system: generate PDF here using Barryvdh/DomPDF or Spatie/Browsershot
        $filePath = "certificates/student_{$student->id}_course_{$course->id}.pdf";

        // For now, store a placeholder path
        return Certificate::create([
            'student_id' => $student->id,
            'course_id'  => $course->id,
            'file_url'   => Storage::url($filePath),
            'issued_at'  => now(),
        ]);
    }

    /**
     * Auto-issue certificate when an enrollment is marked completed.
     */
    public function autoIssueOnCompletion(Student $student, Course $course): ?Certificate
    {
        if ($this->isEligible($student, $course)) {
            return $this->issue($student, $course);
        }

        return null;
    }
}
