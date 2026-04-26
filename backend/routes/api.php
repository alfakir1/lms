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
    });

    /* ── Admin + Instructor ── */
    Route::middleware('role:admin,instructor')->group(function () {
        Route::post('/courses',              [CourseController::class, 'store']);
        Route::put('/courses/{course}',      [CourseController::class, 'update']);
        Route::delete('/courses/{course}',   [CourseController::class, 'destroy']);

        Route::post('/assignments',             [AssignmentController::class, 'store']);
        Route::put('/assignments/{assignment}', [AssignmentController::class, 'update']);
        Route::delete('/assignments/{assignment}', [AssignmentController::class, 'destroy']);

        Route::post('/grades', [GradeController::class, 'store']);
    });

    /* ── Admin + Reception ── */
    Route::middleware('role:admin,reception')->group(function () {
        Route::get('/users',                     [UserController::class, 'index']);
        Route::post('/users',                    [UserController::class, 'store']);
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
        Route::put('/submissions/{submission}/grade',           [SubmissionController::class, 'grade']);
        Route::get('/grades',                                   [GradeController::class, 'index']);
    });

    /* ── Student only ── */
    Route::middleware('role:student')->group(function () {
        Route::post('/enrollments', [EnrollmentController::class, 'store']);
        Route::post('/submissions', [SubmissionController::class, 'store']);
    });
});
