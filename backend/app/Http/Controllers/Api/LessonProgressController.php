<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Http\Request;

class LessonProgressController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'student') abort(403);

        $validated = $request->validate([
            'lesson_id' => 'required|exists:lessons,id',
            'last_position' => 'required|numeric',
            'percent_watched' => 'required|integer|min:0|max:100',
        ]);

        $studentId = $user->student->id;
        $lesson = Lesson::findOrFail($validated['lesson_id']);

        // Check if student is enrolled in the course
        if (!$user->student->enrollments()->where('course_id', $lesson->course_id)->exists()) {
            abort(403, 'Not enrolled in this course.');
        }

        // Sequential Access Validation
        if ($lesson->order > 1) {
            $previousLesson = Lesson::where('course_id', $lesson->course_id)
                ->where('order', '<', $lesson->order)
                ->orderBy('order', 'desc')
                ->first();

            if ($previousLesson) {
                $prevProgress = LessonProgress::where('student_id', $studentId)
                    ->where('lesson_id', $previousLesson->id)
                    ->first();

                if (!$prevProgress || !$prevProgress->completed) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Please complete the previous lesson first.'
                    ], 403);
                }
            }
        }

        $progress = LessonProgress::firstOrNew([
            'student_id' => $studentId, 
            'lesson_id' => $validated['lesson_id']
        ]);

        $progress->last_position = $validated['last_position'];
        
        if ($validated['percent_watched'] > $progress->percent_watched) {
            $progress->percent_watched = $validated['percent_watched'];
        }

        if ($validated['percent_watched'] >= 90) {
            $progress->completed = true;
        }

        $progress->save();

        return response()->json([
            'success' => true,
            'data' => $progress
        ]);
    }

    public function getCourseProgress(Request $request, $courseId)
    {
        $user = $request->user();
        if ($user->role !== 'student') abort(403);

        $progress = LessonProgress::where('student_id', $user->student->id)
            ->whereHas('lesson', function($q) use ($courseId) {
                $q->where('course_id', $courseId);
            })
            ->get();

        return response()->json([
            'success' => true,
            'data' => $progress
        ]);
    }
}
