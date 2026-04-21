<?php

namespace App\Interfaces\HTTP\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Application\Courses\CreateCourse;
use App\Infrastructure\Persistence\Models\Course;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    private CreateCourse $createCourseUseCase;

    public function __construct(CreateCourse $createCourseUseCase)
    {
        $this->createCourseUseCase = $createCourseUseCase;
    }

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $user = Auth::user();
        
        $query = Course::with(['chapters.lectures', 'instructor.user']);

        if ($user && $user->isRole('instructor')) {
            $courses = $query->where('instructor_id', $user->instructor->id)->paginate($perPage);
        } else {
            $courses = $query->where('status', 'published')->paginate($perPage);
        }

        return $this->apiResponse('success', $courses, 'Courses retrieved successfully');
    }

    public function show($id)
    {
        $course = Course::with(['instructor.user', 'chapters.lectures'])->findOrFail($id);
        return $this->apiResponse('success', $course);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'thumbnail' => 'nullable|image',
        ]);

        $user = Auth::user();
        if (!$user->isRole('instructor')) {
            return response()->json(['error' => 'Only instructors can create courses'], 403);
        }

        $course = $this->createCourseUseCase->execute(
            $request->except('thumbnail'),
            $user->instructor->id,
            $request->file('thumbnail')
        );

        return $this->apiResponse('success', $course, 'Course created successfully', 201);
    }

    public function update(Request $request, Course $course)
    {
        // Normally handled by a UseCase, but keep simple for MVP
        $this->authorize('update', $course);
        
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
        ]);

        $course->update($request->all());

        return $this->apiResponse('success', $course, 'Course updated successfully');
    }

    public function destroy(Course $course)
    {
        $this->authorize('delete', $course);
        $course->delete();
        return $this->apiResponse('success', null, 'Course deleted');
    }
}
