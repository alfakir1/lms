<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Submission;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $query = Assignment::with(['course', 'lesson']);

            // Simple filtering by role to ensure stability
            if ($user->role === 'student') {
                $studentId = $user->student?->id ?? 0;
                $query->whereHas('course.enrollments', function($q) use ($studentId) {
                    $q->where('student_id', $studentId);
                })->orWhereHas('course.instances.enrollments', function($q) use ($studentId) {
                    $q->where('student_id', $studentId);
                });
            } elseif ($user->role === 'instructor') {
                $instructorId = $user->instructor?->id ?? 0;
                $query->whereHas('course', function($q) use ($instructorId) {
                    $q->where('instructor_id', $instructorId)
                      ->orWhereHas('parent', function($pq) use ($instructorId) {
                          $pq->where('instructor_id', $instructorId);
                      });
                })->orWhereHas('course.instances', function($q) use ($instructorId) {
                    $q->where('instructor_id', $instructorId);
                });
            }

            $assignments = $query->latest()->get();

            return response()->json([
                'success' => true,
                'data' => $assignments
            ]);

        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Assignments Index Fatal Error', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'خطأ في جلب المهام: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(Assignment $assignment)
    {
        return response()->json([
            'success' => true,
            'data' => $assignment->load(['course', 'lesson'])
        ]);
    }

    public function store(Request $request)
    {
        try {
            $user = $request->user();
            if ($user->role !== 'instructor' && $user->role !== 'admin') {
                return response()->json(['success' => false, 'message' => 'Unauthorized role: ' . $user->role], 403);
            }

            \Illuminate\Support\Facades\Log::info('Store Assignment Request Data', $request->all());

            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'course_id'   => 'required|exists:courses,id',
                'lesson_id'   => 'nullable|exists:lessons,id',
                'title'       => 'required|string|max:255',
                'description' => 'required|string',
                'deadline'    => 'required|date',
                'max_grade'   => 'required|integer|min:1',
                'assignment_file' => 'nullable|file|max:51200',
            ]);

            if ($validator->fails()) {
                $errs = $validator->errors()->toArray();
                \Illuminate\Support\Facades\Log::error('Assignment Validation Failed', $errs);
                return response()->json([
                    'success' => false, 
                    'message' => 'بيانات غير صالحة: ' . implode(', ', array_map(fn($k, $v) => "$k: " . implode('|', $v), array_keys($errs), $errs)),
                    'errors' => $errs
                ], 422);
            }

            $validated = $validator->validated();

            // Authorization check
            if ($user->role === 'instructor') {
                $instructorId = $user->instructor->id ?? 0;
                $hasAccess = \App\Models\Course::where('id', $validated['course_id'])
                    ->where(function($q) use ($instructorId) {
                        $q->where('instructor_id', $instructorId)
                          ->orWhereHas('parent', function($pq) use ($instructorId) {
                              $pq->where('instructor_id', $instructorId);
                          });
                    })->exists();

                if (!$hasAccess) {
                    \Illuminate\Support\Facades\Log::warning('Instructor unauthorized for course', ['course_id' => $validated['course_id'], 'instructor_id' => $instructorId]);
                    return response()->json(['success' => false, 'message' => 'أنت لست المحاضر المسؤول عن هذا الكورس.'], 403);
                }
            }

            if ($request->hasFile('assignment_file')) {
                $file = $request->file('assignment_file');
                $path = $file->store('assignments', 'public');
                $validated['file_url'] = asset('storage/' . $path);
                \Illuminate\Support\Facades\Log::info('Assignment file stored', ['path' => $path]);
            }

            $dataToSave = collect($validated)->except(['assignment_file'])->toArray();
            $assignment = Assignment::create($dataToSave);

            \Illuminate\Support\Facades\Log::info('Assignment created successfully', ['id' => $assignment->id]);

            // Notify enrolled students
            try {
                $courseIds = [$validated['course_id']];
                $masterCourse = \App\Models\Course::with('instances')->find($validated['course_id']);
                if ($masterCourse && $masterCourse->instances->count() > 0) {
                    $courseIds = array_merge($courseIds, $masterCourse->instances->pluck('id')->toArray());
                }

                $studentsToNotify = \App\Models\User::whereHas('student.enrollments', function($q) use ($courseIds) {
                    $q->whereIn('course_id', $courseIds);
                })->get();

                foreach ($studentsToNotify as $studentUser) {
                    \App\Models\Notification::create([
                        'user_id' => $studentUser->id,
                        'type' => 'assignment_created',
                        'title' => 'مهمة جديدة: ' . $assignment->title,
                        'message' => 'تمت إضافة مهمة جديدة في كورس ' . ($masterCourse->title ?? ''),
                    ]);
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Failed to send assignment notifications: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'data' => $assignment
            ], 201);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Assignment Store Exception: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false, 
                'message' => 'حدث خطأ غير متوقع أثناء حفظ المهمة: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Assignment $assignment)
    {
        $user = $request->user();
        if ($user->role === 'instructor') {
            $instructorId = $user->instructor->id ?? 0;
            if ($assignment->course->instructor_id !== $instructorId) abort(403);
        } elseif ($user->role !== 'admin') {
            abort(403);
        }

        $validated = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'deadline'    => 'sometimes|date',
            'max_grade'   => 'sometimes|integer|min:1',
            'lesson_id'   => 'sometimes|nullable|exists:lessons,id',
            'assignment_file' => 'nullable|file|max:51200',
        ]);

        if ($request->hasFile('assignment_file')) {
            // Delete old file if exists
            if ($assignment->file_url && str_contains($assignment->file_url, '/storage/assignments/')) {
                $oldPath = str_replace(asset('storage/'), '', $assignment->file_url);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('assignment_file')->store('assignments', 'public');
            $validated['file_url'] = asset('storage/' . $path);
        }

        $assignment->update($validated);

        return response()->json([
            'success' => true,
            'data' => $assignment
        ]);
    }

    public function destroy(Assignment $assignment)
    {
        $user = auth()->user();
        if ($user->role === 'instructor') {
            if ($assignment->course->instructor_id !== $user->instructor->id) abort(403);
        } elseif ($user->role !== 'admin') {
            abort(403);
        }

        // Delete file
        if ($assignment->file_url && str_contains($assignment->file_url, '/storage/assignments/')) {
            $oldPath = str_replace(asset('storage/'), '', $assignment->file_url);
            \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
        }

        $assignment->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف المهمة بنجاح'
        ]);
    }
}
