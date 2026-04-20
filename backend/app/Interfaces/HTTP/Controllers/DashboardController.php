<?php

namespace App\Interfaces\HTTP\Controllers;

use App\Infrastructure\Persistence\Models\User;
use App\Infrastructure\Persistence\Models\Course;
use App\Infrastructure\Persistence\Models\Enrollment;
use App\Infrastructure\Persistence\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class DashboardController extends Controller
{
    /**
     * Get aggregate statistics for the admin dashboard.
     */
    public function stats(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => User::count(),
                'total_courses' => Course::count(),
                'total_revenue' => (float) Payment::sum('amount'),
                'active_students' => User::where('role', 'student')->count(),
                'pending_enrollments' => Enrollment::where('status', 'pending')->count(),
                'recent_activities' => $this->getRecentActivities(),
            ]
        ]);
    }

    /**
     * Map some recent database changes to an activity feed format.
     */
    private function getRecentActivities(): array
    {
        // Get the last 5 users as an example of activity
        return User::latest()->take(5)->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'type' => 'user_registration',
                'message' => "New user registered: {$user->email}",
                'time' => $user->created_at->diffForHumans(),
            ];
        })->toArray();
    }
}
