<?php

use Illuminate\Support\Facades\Route;
use App\Interfaces\HTTP\Controllers\AuthController;
use App\Interfaces\HTTP\Controllers\EnrollmentController;
use App\Interfaces\HTTP\Controllers\AttendanceController;

/*
|--------------------------------------------------------------------------
| LMS API Routes
| Base URL: /api/v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    /* ─────────────────────────────────────────
    |  Auth (Public)
    ───────────────────────────────────────── */
    Route::prefix('auth')->group(function () {
        Route::post('register',  [AuthController::class, 'register']);
        Route::post('login',     [AuthController::class, 'login']);
    });

    /* ─────────────────────────────────────────
    |  Protected Routes (Sanctum)
    ───────────────────────────────────────── */
    Route::middleware('auth:sanctum')->group(function () {

        // Auth utilities
        Route::prefix('auth')->group(function () {
            Route::post('logout',              [AuthController::class, 'logout']);
            Route::get('me',                   [AuthController::class, 'me']);
            Route::post('update-fingerprint',  [AuthController::class, 'updateFingerprint']);
        });

        /* ── Enrollments ── */
        Route::prefix('enrollments')->group(function () {
            Route::get('my',                           [EnrollmentController::class, 'myEnrollments']);
            Route::post('courses/{course}',            [EnrollmentController::class, 'enroll']);
            Route::get('pending',                      [EnrollmentController::class, 'pending']);
            Route::post('{enrollment}/approve',        [EnrollmentController::class, 'approve']);
            Route::post('{enrollment}/ban',            [EnrollmentController::class, 'ban']);
        });

        /* ── Admin Management ── */
        Route::prefix('admin')->group(function () {
            Route::get('stats',                        [\App\Interfaces\HTTP\Controllers\DashboardController::class, 'stats']);
            Route::get('users',                        [\App\Interfaces\HTTP\Controllers\UserManagementController::class, 'index']);
            Route::put('users/{user}',                 [\App\Interfaces\HTTP\Controllers\UserManagementController::class, 'update']);
        });

        /* ── Smart QR Attendance ── */
        Route::prefix('attendance')->group(function () {
            // Instructor actions
            Route::post('sessions/courses/{course}/start',  [AttendanceController::class, 'startSession']);
            Route::post('sessions/{session}/close',         [AttendanceController::class, 'closeSession']);
            Route::post('sessions/{session}/manual',        [AttendanceController::class, 'recordManual']);
            Route::get('sessions/{session}/report',         [AttendanceController::class, 'sessionReport']);

            // Student actions
            Route::post('sessions/{session}/request-token', [AttendanceController::class, 'requestToken']);
            Route::post('scan',                             [AttendanceController::class, 'scanToken']);
        });

        /* ── Courses, Chapters, Lectures ── */
        Route::apiResource('courses', \App\Interfaces\HTTP\Controllers\CourseController::class);
        Route::apiResource('courses.chapters', \App\Interfaces\HTTP\Controllers\ChapterController::class)->shallow();
        Route::apiResource('chapters.lectures', \App\Interfaces\HTTP\Controllers\LectureController::class)->shallow();
        Route::post('lectures/{lecture}/progress', [\App\Interfaces\HTTP\Controllers\LectureController::class, 'trackProgress']);

        /* ── Payments ── */
        Route::prefix('payments')->group(function () {
            Route::get('/', [\App\Interfaces\HTTP\Controllers\PaymentController::class, 'index']);
            Route::post('/', [\App\Interfaces\HTTP\Controllers\PaymentController::class, 'store']);
        });

        /* ── Admin Payments ── */
        Route::prefix('admin/payments')->group(function () {
            Route::get('/', [\App\Interfaces\HTTP\Controllers\AdminPaymentController::class, 'index']);
            Route::post('{id}/approve', [\App\Interfaces\HTTP\Controllers\AdminPaymentController::class, 'approve']);
            Route::post('{id}/reject', [\App\Interfaces\HTTP\Controllers\AdminPaymentController::class, 'reject']);
        });

    }); // end auth:sanctum

}); // end v1
