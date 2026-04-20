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

    public function index()
    {
        // For phase 1, list all published, or if instructor, list their own
        $user = Auth::user();
        if ($user && $user->isRole('instructor')) {
            return Course::where('instructor_id', $user->instructor->id)->paginate(15);
        }
        return Course::where('status', 'published')->paginate(15);
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

        return response()->json($course, 201);
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

        return response()->json($course);
    }

    public function destroy(Course $course)
    {
        $this->authorize('delete', $course);
        $course->delete();
        return response()->json(['message' => 'Course deleted']);
    }
}
