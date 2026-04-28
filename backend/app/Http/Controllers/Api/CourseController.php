<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $user = auth('sanctum')->user();
        $query = Course::with('instructor.user');


        if ($user && $user->role === 'instructor') {
            // Instructor sees only their courses
            $query->where('instructor_id', $user->instructor->id ?? 0);
        }

        return response()->json([
            'success' => true,
            'data' => $query->get()
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            abort(403, 'Unauthorized. Only admins can create courses.');
        }


        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'status' => 'required|string|in:active,draft,archived',
        ];

        if ($user->role === 'admin') {
            $rules['instructor_id'] = 'required|exists:instructors,id';
        }

        $validated = $request->validate($rules);

        if ($user->role === 'instructor') {
            $validated['instructor_id'] = $user->instructor->id;
        } else {
            $validated['instructor_id'] = $request->instructor_id;
        }

        $course = Course::create($validated);
        return response()->json([
            'success' => true,
            'data' => $course
        ], 201);
    }

    public function show(Course $course)
    {
        $course->load(['instructor.user', 'lessons' => function($q) {
            $q->orderBy('order');
        }]);
        return response()->json([
            'success' => true,
            'data' => $course
        ]);
    }

    public function update(Request $request, Course $course)
    {
        $user = $request->user();
        if ($user->role === 'instructor' && $course->instructor_id !== $user->instructor->id) {
            abort(403, 'Unauthorized.');
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'price' => 'sometimes|numeric',
            'status' => 'sometimes|string|in:active,draft,archived',
        ]);

        $course->update($validated);
        return response()->json([
            'success' => true,
            'data' => $course
        ]);
    }

    public function destroy(Request $request, Course $course)
    {
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'instructor'])) {
            abort(403, 'Unauthorized.');
        }
        if ($user->role === 'instructor' && $course->instructor_id !== $user->instructor->id) {
            abort(403, 'Unauthorized.');
        }
        
        $course->delete();
        return response()->json([
            'success' => true,
            'message' => 'Course deleted successfully'
        ]);
    }
}
