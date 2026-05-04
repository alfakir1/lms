<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

use App\Http\Resources\Api\CourseResource;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $user = auth('sanctum')->user();
        $query = Course::query()
            ->with([
                'instructor:id,user_id',
                'instructor.user:id,name,email',
                'parent:id,title',
            ])
            ->withCount(['lessons', 'enrollments']);

        if ($user) {
            if ($user->role === 'instructor') {
                $query->where('instructor_id', $user->instructor->id ?? 0);
            } elseif ($user->role === 'student' && $request->has('my_courses')) {
                $query->whereHas('enrollments', function($q) use ($user) {
                    $q->where('student_id', $user->student->id ?? 0);
                });
            } elseif ($user->role === 'admin' || $user->role === 'reception') {
                if ($request->has('master_only')) {
                    $query->whereNull('parent_id');
                }
            } else {
                $query->whereNull('parent_id');
            }
        } else {
            $query->whereNull('parent_id');
        }

        return response()->json([
            'status' => 'success',
            'data' => CourseResource::collection($query->paginate(15))->response()->getData(true)
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
            'status' => 'success',
            'data' => new CourseResource($course),
            'message' => 'Course created successfully'
        ]);
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

        // If this is an instance and has no lessons, inherit from master
        if ($course->parent_id && $course->lessons->isEmpty()) {
            $masterLessons = \App\Models\Lesson::where('course_id', $course->parent_id)
                ->orderBy('order')
                ->get();
            $course->setRelation('lessons', $masterLessons);
        }

        // If this is an instance, also load assignments from the master course
        if ($course->parent_id) {
            $masterAssignments = \App\Models\Assignment::where('course_id', $course->parent_id)->get();
            $course->setRelation('assignments', $course->assignments->concat($masterAssignments));
        }
        
        return response()->json([
            'status' => 'success',
            'data' => new CourseResource($course)
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
            'status' => 'success',
            'data' => new CourseResource($course)
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
