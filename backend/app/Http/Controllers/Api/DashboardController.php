<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = $request->user();
        $stats = [];

        if ($user->role === 'admin') {
            $stats = [
                'total_users' => User::count(),
                'active_courses' => Course::where('status', 'active')->count(),
                'total_revenue' => Payment::sum('amount'),
                'total_enrollments' => Enrollment::count(),
            ];
        } elseif ($user->role === 'instructor') {
            $instructorId = $user->instructor->id ?? null;
            $stats = [
                'my_courses' => Course::where('instructor_id', $instructorId)->count(),
                'total_students' => Enrollment::whereHas('course', function($q) use ($instructorId) {
                    $q->where('instructor_id', $instructorId);
                })->count(),
            ];
        } elseif ($user->role === 'student') {
            $studentId = $user->student->id ?? null;
            $stats = [
                'enrolled_courses' => Enrollment::where('student_id', $studentId)->count(),
            ];
        } elseif ($user->role === 'reception') {
            $stats = [
                'today_payments' => Payment::whereDate('created_at', today())->sum('amount'),
                'today_registrations' => User::where('role', 'student')->whereDate('created_at', today())->count(),
            ];
        }

        return response()->json($stats);
    }
}
