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
        $query = Course::with(['instructor.user', 'parent']);

        if ($user) {
            if ($user->role === 'instructor') {
                // Instructors see only their assigned teaching groups (Instances)
                $query->where('instructor_id', $user->instructor->id ?? 0);
            } elseif ($user->role === 'student' && $request->has('my_courses')) {
                // Student dashboard - see their enrolled instances
                $query->whereHas('enrollments', function($q) use ($user) {
                    $q->where('student_id', $user->student->id ?? 0);
                });
            } elseif ($user->role === 'admin' || $user->role === 'reception') {
                // Admins/Reception see all, but can filter by master
                if ($request->has('master_only')) {
                    $query->whereNull('parent_id');
                }
            } else {
                // Browsing/Public - show Master Courses only
                $query->whereNull('parent_id');
            }
        } else {
            // Public - Master Courses only
            $query->whereNull('parent_id');
        }

        return response()->json([
            'success' => true,
            'data' => $query->get()
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $user->role !== 'instructor') {
            abort(403, 'Unauthorized.');
        }

        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'status' => 'required|string|in:active,draft,archived,upcoming,completed',
            'parent_id' => 'nullable|exists:courses,id',
            'group_name' => 'nullable|string|max:255',
            'duration_days' => 'nullable|integer',
            'min_students' => 'nullable|integer',
            'max_students' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ];

        if ($user->role === 'admin') {
            $rules['instructor_id'] = 'nullable|exists:instructors,id';
        }

        $validated = $request->validate($rules);

        if ($user->role === 'instructor') {
            $validated['instructor_id'] = $user->instructor->id;
        }

        $course = Course::create($validated);
        return response()->json([
            'success' => true,
            'data' => $course
        ], 201);
    }

    public function show(Course $course)
    {
        $course->load([
            'instructor.user', 
            'lessons' => function($q) {
                $q->orderBy('order');
            },
            'instances.instructor.user',
            'assignments'
        ]);

        // If this is an instance, also load assignments from the master course
        if ($course->parent_id) {
            $masterAssignments = \App\Models\Assignment::where('course_id', $course->parent_id)->get();
            $course->setRelation('assignments', $course->assignments->concat($masterAssignments));
        }
        
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
            'status' => 'sometimes|string|in:active,draft,archived,upcoming,completed',
            'duration_days' => 'sometimes|nullable|integer',
            'min_students' => 'sometimes|nullable|integer',
            'max_students' => 'sometimes|nullable|integer',
            'start_date' => 'sometimes|nullable|date',
            'end_date' => 'sometimes|nullable|date',
            'instructor_id' => 'sometimes|nullable|exists:instructors,id',
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
