<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();
        $course = Course::findOrFail($request->course_id);

        // Authorization: Admin or the course's instructor
        if ($user->role !== 'admin' && ($user->role !== 'instructor' || $course->instructor_id !== ($user->instructor->id ?? 0))) {
            abort(403, 'Unauthorized.');
        }

        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'video_url' => 'nullable|string',
            'video_type' => 'nullable|string|in:html5,youtube,vimeo,file',
            'duration' => 'nullable|integer',
            'order' => 'nullable|integer',
            'video_file' => 'nullable|file|mimes:mp4,webm,mov,ogg|max:102400', // 100MB limit
        ]);

        if ($request->hasFile('video_file')) {
            $path = $request->file('video_file')->store('lessons/videos', 'public');
            $validated['video_url'] = asset('storage/' . str_replace('public/', '', $path));
            $validated['video_type'] = 'html5';
        }

        if (!isset($validated['order'])) {
            $validated['order'] = $course->lessons()->max('order') + 1;
        }

        unset($validated['video_file']);
        $lesson = Lesson::create($validated);

        return response()->json([
            'success' => true,
            'data' => $lesson
        ], 201);
    }

    public function update(Request $request, Lesson $lesson)
    {
        $user = $request->user();
        $course = $lesson->course;

        if ($user->role !== 'admin' && ($user->role !== 'instructor' || $course->instructor_id !== ($user->instructor->id ?? 0))) {
            abort(403, 'Unauthorized.');
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|nullable|string',
            'video_url' => 'sometimes|nullable|string',
            'video_type' => 'sometimes|nullable|string|in:html5,youtube,vimeo,file',
            'duration' => 'sometimes|nullable|integer',
            'order' => 'sometimes|integer',
            'video_file' => 'nullable|file|mimes:mp4,webm,mov,ogg|max:102400',
        ]);

        if ($request->hasFile('video_file')) {
            // Delete old file if exists in storage
            if ($lesson->video_url && str_contains($lesson->video_url, '/lessons/videos/')) {
                $oldPath = 'lessons/videos/' . basename($lesson->video_url);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('video_file')->store('lessons/videos', 'public');
            $validated['video_url'] = asset('storage/' . str_replace('public/', '', $path));
            $validated['video_type'] = 'html5';
        }

        unset($validated['video_file']);
        $lesson->update($validated);

        return response()->json([
            'success' => true,
            'data' => $lesson
        ]);
    }

    public function destroy(Request $request, Lesson $lesson)
    {
        $user = $request->user();
        $course = $lesson->course;

        if ($user->role !== 'admin' && ($user->role !== 'instructor' || $course->instructor_id !== $user->instructor->id)) {
            abort(403, 'Unauthorized.');
        }

        $lesson->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lesson deleted successfully'
        ]);
    }

    public function reorder(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:lessons,id',
            'orders.*.order' => 'required|integer',
        ]);

        $course = Course::findOrFail($request->course_id);

        if ($user->role !== 'admin' && ($user->role !== 'instructor' || $course->instructor_id !== $user->instructor->id)) {
            abort(403, 'Unauthorized.');
        }

        foreach ($request->orders as $item) {
            Lesson::where('id', $item['id'])->where('course_id', $course->id)->update(['order' => $item['order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Lessons reordered successfully'
        ]);
    }
}
