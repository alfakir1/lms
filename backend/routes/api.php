<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\AssignmentController;
use App\Http\Controllers\Api\SubmissionController;
use App\Http\Controllers\Api\GradeController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\LessonProgressController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\AssessmentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/* ══════════════════════════════════════════
   PUBLIC
══════════════════════════════════════════ */
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Courses — public read
Route::get('/courses',          [CourseController::class, 'index']);
Route::get('/courses/{course}', [CourseController::class, 'show']);

/* ══════════════════════════════════════════
   ALL AUTHENTICATED USERS
══════════════════════════════════════════ */
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user',    [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/profile/password', [AuthController::class, 'updatePassword']);
    Route::get('/notifications', [App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::put('/notifications/{notification}/read', [App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead']);
    Route::get('/stats',   [DashboardController::class, 'stats']);

    // Certificates
    Route::get('/certificates', [\App\Http\Controllers\Api\CertificateController::class, 'index']);
    Route::get('/certificates/{certificate}', [\App\Http\Controllers\Api\CertificateController::class, 'show']);

    // User profile view
    Route::get('/users/{user}', [UserController::class, 'show']);

    // Payments — read filtered by role inside controller
    Route::get('/payments', [PaymentController::class, 'index']);

    // Receipt stub
    Route::get('/payments/{payment}/receipt', function ($payment) {
        $p = \App\Models\Payment::with(['student.user', 'course'])->findOrFail($payment);
        return response()->json(['success' => true, 'data' => [
            'transaction_id' => $p->transaction_id,
            'student_name'   => $p->student?->user?->name,
            'course_title'   => $p->course?->title,
            'amount'         => $p->amount,
            'method'         => $p->method,
            'paid_at'        => $p->paid_at,
        ]]);
    });

    /* ── Admin only ── */
    Route::middleware('role:admin')->group(function () {
        Route::get('/users',              [UserController::class, 'index']);
        Route::delete('/users/{user}',    [UserController::class, 'destroy']);
        Route::post('/payments/{id}/approve', [PaymentController::class, 'approve']);
        Route::get('/reports', [DashboardController::class, 'reports']);
    });

    /* ── Admin + Instructor ── */
    Route::middleware('role:admin,instructor')->group(function () {
        Route::post('/courses',              [CourseController::class, 'store']);
        Route::put('/courses/{course}',      [CourseController::class, 'update']);
        Route::delete('/courses/{course}',   [CourseController::class, 'destroy']);

        Route::post('/assignments',             [AssignmentController::class, 'store']);
        Route::put('/assignments/{assignment}', [AssignmentController::class, 'update']);
        Route::delete('/assignments/{assignment}', [AssignmentController::class, 'destroy']);

        Route::post('/lessons',             [LessonController::class, 'store']);
        Route::put('/lessons/{lesson}',      [LessonController::class, 'update']);
        Route::delete('/lessons/{lesson}',   [LessonController::class, 'destroy']);
        Route::post('/lessons/reorder',      [LessonController::class, 'reorder']);

        Route::post('/grades', [GradeController::class, 'store']);

        // Instructor Assessments
        Route::post('/assessments',                 [AssessmentController::class, 'store']);
        Route::post('/assessments/{assessment}/generate', [AssessmentController::class, 'generateQuestions']);
        Route::put('/assessments/{assessment}',     [AssessmentController::class, 'update']);
        Route::put('/assessments/{assessment}/questions/{question}', [AssessmentController::class, 'updateQuestion']);
        Route::delete('/assessments/{assessment}/questions/{question}', [AssessmentController::class, 'destroyQuestion']);
        Route::get('/assessments/{assessment}/submissions', [AssessmentController::class, 'showSubmissions']);
        Route::post('/assessments/{assessment}/submissions/{submission}/grade', [AssessmentController::class, 'gradeSubmission']);
    });

    /* ── Admin + Reception ── */
    Route::middleware('role:admin,reception')->group(function () {
        Route::get('/users',                     [UserController::class, 'index']);
        Route::post('/users',                    [UserController::class, 'store']);
        Route::get('/users/{user}/financial-statement', [UserController::class, 'financialStatement']);
        Route::get('/users/{user}/academic-report', [UserController::class, 'academicReport']);
        Route::put('/users/{user}',              [UserController::class, 'update']);
        Route::post('/payments',                 [PaymentController::class, 'store']);
    });

    /* ── Admin + Instructor + Reception ── */
    Route::middleware('role:admin,instructor,reception')->group(function () {
        Route::get('/enrollments', [EnrollmentController::class, 'index']);
        Route::get('/attendance',  [\App\Http\Controllers\Api\AttendanceController::class, 'index']);
        Route::post('/attendance', [\App\Http\Controllers\Api\AttendanceController::class, 'store']);
    });

    /* ── Instructor + Student ── */
    Route::middleware('role:admin,instructor,student')->group(function () {
        Route::get('/assignments',                              [AssignmentController::class, 'index']);
        Route::get('/assignments/{assignment}',                 [AssignmentController::class, 'show']);
        Route::get('/assignments/{assignment}/submissions',     [SubmissionController::class, 'index']);
        Route::get('/submissions',                              [SubmissionController::class, 'index']);
        Route::get('/submissions/{submission}',                 [SubmissionController::class, 'show']);
        Route::get('/grades',                                   [GradeController::class, 'index']);

        // Shared Assessments Route
        Route::get('/courses/{course}/assessments', [AssessmentController::class, 'indexByCourse']);
    });

    /* ── Student only ── */
    Route::middleware('role:student')->group(function () {
        Route::post('/enrollments', [EnrollmentController::class, 'store']);
        Route::post('/submissions', [SubmissionController::class, 'store']);
        Route::post('/lesson-progress', [LessonProgressController::class, 'update']);
        Route::get('/lesson-progress/course/{courseId}', [LessonProgressController::class, 'getCourseProgress']);

        // Student Assessments
        Route::get('/assessments/{assessment}',     [AssessmentController::class, 'showStudent']);
        Route::post('/assessments/{assessment}/submit', [AssessmentController::class, 'submit']);
    });

    /* ── Instructor/Admin Grading ── */
    Route::middleware('role:admin,instructor')->group(function () {
        Route::put('/submissions/{submission}/grade',           [SubmissionController::class, 'grade']);
    });
});
