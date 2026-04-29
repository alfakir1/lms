<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\Submission;
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
                'total_revenue' => Payment::sum('amount') ?: 0,
                'total_enrollments' => Enrollment::count(),
            ];
        } elseif ($user->role === 'instructor') {
            $instructorId = $user->instructor->id ?? null;
            $stats = [
                'my_courses' => Course::where('instructor_id', $instructorId)->count(),
                'total_students' => Enrollment::whereHas('course', function($q) use ($instructorId) {
                    $q->where('instructor_id', $instructorId);
                })->count(),
                'pending_submissions' => Submission::where('status', 'submitted')
                    ->whereHas('assignment.course', function($q) use ($instructorId) {
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
                'today_payments' => Payment::whereDate('created_at', today())->sum('amount') ?: 0,
                'today_registrations' => User::where('role', 'student')->whereDate('created_at', today())->count(),
            ];
        }

        return response()->json($stats);
    }

    public function reports(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            abort(403, 'Unauthorized.');
        }

        $data = [
            'users' => [
                'total' => User::count(),
                'students' => User::where('role', 'student')->count(),
                'instructors' => User::where('role', 'instructor')->count(),
                'reception' => User::where('role', 'reception')->count(),
                'admins' => User::where('role', 'admin')->count(),
            ],
            'courses' => [
                'total' => Course::count(),
                'active' => Course::where('status', 'active')->count(),
                'upcoming' => Course::where('status', 'upcoming')->count(),
                'completed' => Course::where('status', 'completed')->count(),
                'archived' => Course::where('status', 'archived')->count(),
                'master' => Course::whereNull('parent_id')->count(),
                'instances' => Course::whereNotNull('parent_id')->count(),
            ],
            'enrollments' => [
                'total' => Enrollment::count(),
                'active' => Enrollment::where('status', 'active')->count(),
            ],
            'financial' => [
                'total_revenue' => Payment::sum('amount') ?: 0,
                'revenue_by_course' => Course::whereNull('parent_id')
                    ->withSum('payments as total_revenue', 'amount')
                    ->get(['id', 'title']),
                'recent_payments' => Payment::with(['student.user', 'course'])
                    ->latest()
                    ->limit(10)
                    ->get(),
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
}
