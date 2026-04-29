<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\AssessmentQuestion;
use App\Models\AssessmentSubmission;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Services\AiQuizGeneratorService;
use Illuminate\Http\Request;

class AssessmentController extends Controller
{
    // --- INSTRUCTOR ENDPOINTS ---

    public function indexByCourse(Request $request, $courseId)
    {
        $user = $request->user();
        if ($user->role === 'student') {
            return $this->studentCourseAssessments($request, $courseId);
        }
        if ($user->role !== 'instructor' && $user->role !== 'admin') abort(403);

        $assessments = Assessment::with('questions')->where('course_id', $courseId)->get();
        return response()->json(['success' => true, 'data' => $assessments]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'instructor') abort(403);

        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'type' => 'required|in:quiz,midterm,final',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'duration_minutes' => 'integer|min:1',
        ]);

        $assessment = Assessment::create([
            ...$validated,
            'instructor_id' => $user->instructor->id,
            'status' => 'draft',
        ]);

        return response()->json(['success' => true, 'data' => $assessment]);
    }

    public function generateQuestions(Request $request, $id, AiQuizGeneratorService $aiService)
    {
        $user = $request->user();
        if ($user->role !== 'instructor') abort(403);

        $assessment = Assessment::findOrFail($id);
        if ($assessment->instructor_id !== $user->instructor->id) abort(403);

        $validated = $request->validate([
            'lesson_ids' => 'required|array',
            'lesson_ids.*' => 'exists:lessons,id'
        ]);

        // Clear existing generated questions for these lessons? Or just append. We'll append.
        $generatedCount = 0;
        foreach ($validated['lesson_ids'] as $lessonId) {
            $lesson = Lesson::find($lessonId);
            $questionsData = $aiService->generateForLesson($lesson, 3); // 3 per lesson
            
            foreach ($questionsData as $qData) {
                $assessment->questions()->create($qData);
                $generatedCount++;
            }
        }

        $assessment->update(['auto_generated' => true]);

        return response()->json(['success' => true, 'message' => "$generatedCount questions generated.", 'data' => $assessment->load('questions')]);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        if ($user->role !== 'instructor') abort(403);

        $assessment = Assessment::findOrFail($id);
        if ($assessment->instructor_id !== $user->instructor->id) abort(403);

        $validated = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:draft,published',
            'duration_minutes' => 'sometimes|integer',
        ]);

        $assessment->update($validated);

        return response()->json(['success' => true, 'data' => $assessment]);
    }

    public function updateQuestion(Request $request, $id, $questionId)
    {
        $user = $request->user();
        $assessment = Assessment::findOrFail($id);
        if ($assessment->instructor_id !== $user->instructor->id) abort(403);

        $question = AssessmentQuestion::where('assessment_id', $id)->findOrFail($questionId);
        $question->update($request->all());

        return response()->json(['success' => true]);
    }

    public function destroyQuestion(Request $request, $id, $questionId)
    {
        $user = $request->user();
        $assessment = Assessment::findOrFail($id);
        if ($assessment->instructor_id !== $user->instructor->id) abort(403);

        AssessmentQuestion::where('assessment_id', $id)->findOrFail($questionId)->delete();

        return response()->json(['success' => true]);
    }

    public function showSubmissions(Request $request, $id)
    {
        $user = $request->user();
        $assessment = Assessment::with('questions')->findOrFail($id);
        if ($assessment->instructor_id !== $user->instructor->id && $user->role !== 'admin') abort(403);

        $submissions = AssessmentSubmission::with('student.user')->where('assessment_id', $id)->get();
        return response()->json(['success' => true, 'data' => [
            'assessment' => $assessment,
            'submissions' => $submissions
        ]]);
    }

    public function gradeSubmission(Request $request, $id, $submissionId)
    {
        $user = $request->user();
        $assessment = Assessment::findOrFail($id);
        if ($assessment->instructor_id !== $user->instructor->id) abort(403);

        $request->validate([
            'grade' => 'required|numeric|min:0'
        ]);

        $submission = AssessmentSubmission::where('assessment_id', $id)->findOrFail($submissionId);
        
        $submission->grade = $request->grade;
        $submission->save();

        return response()->json(['success' => true, 'data' => $submission]);
    }

    // --- STUDENT ENDPOINTS ---

    private function studentCourseAssessments(Request $request, $courseId)
    {
        $user = $request->user();
        $assessments = Assessment::where('course_id', $courseId)
                                 ->where('status', 'published')
                                 ->with('questions:id,assessment_id,lesson_id') // only needed to check locks
                                 ->get();

        // Calculate locks based on LessonProgress
        $studentId = $user->student->id;
        $progress = LessonProgress::where('student_id', $studentId)
                                  ->whereHas('lesson', fn($q) => $q->where('course_id', $courseId))
                                  ->get()->keyBy('lesson_id');

        $result = $assessments->map(function ($assessment) use ($progress) {
            $requiredLessonIds = $assessment->questions->pluck('lesson_id')->filter()->unique();
            $isLocked = false;
            foreach ($requiredLessonIds as $lid) {
                if (!isset($progress[$lid]) || !$progress[$lid]->completed) {
                    $isLocked = true;
                    break;
                }
            }
            
            $submission = AssessmentSubmission::where('assessment_id', $assessment->id)
                                              ->where('student_id', $studentId)
                                              ->first();

            return [
                'id' => $assessment->id,
                'title' => $assessment->title,
                'type' => $assessment->type,
                'duration_minutes' => $assessment->duration_minutes,
                'is_locked' => $isLocked,
                'has_submitted' => !!$submission,
                'grade' => $submission?->grade,
            ];
        });

        return response()->json(['success' => true, 'data' => $result]);
    }

    public function showStudent(Request $request, $id)
    {
        $user = $request->user();
        if ($user->role !== 'student') abort(403);

        $assessment = Assessment::with('course')->where('status', 'published')->findOrFail($id);
        
        // Hide correct answers from student
        $questions = $assessment->questions->map(function ($q) {
            return [
                'id' => $q->id,
                'question_text' => $q->question_text,
                'question_type' => $q->question_type,
                'options' => $q->options ? json_decode($q->options) : null,
                'lesson_id' => $q->lesson_id,
            ];
        });

        return response()->json(['success' => true, 'data' => [
            'assessment' => $assessment,
            'questions' => $questions
        ]]);
    }

    public function submit(Request $request, $id)
    {
        $user = $request->user();
        if ($user->role !== 'student') abort(403);
        $studentId = $user->student->id;

        $assessment = Assessment::with('questions')->where('status', 'published')->findOrFail($id);

        // Prevent resubmission
        if (AssessmentSubmission::where('assessment_id', $id)->where('student_id', $studentId)->exists()) {
            return response()->json(['success' => false, 'message' => 'Already submitted'], 400);
        }

        $validated = $request->validate([
            'answers' => 'required|array', // key: question_id, value: answer
            'violation_count' => 'integer',
            'student_name' => 'required|string|max:255'
        ]);

        $answers = $validated['answers'];
        
        // Auto-grade MCQs
        $autoGrade = 0;
        $maxMcqScore = 0;
        foreach ($assessment->questions as $question) {
            if ($question->question_type === 'mcq') {
                $maxMcqScore += 1;
                if (isset($answers[$question->id]) && strtolower(trim($answers[$question->id])) === strtolower(trim($question->correct_answer))) {
                    $autoGrade += 1;
                }
            }
        }

        // Store submission
        $submissionData = [
            'answers' => json_encode([
                'responses' => $answers,
                'violation_count' => $validated['violation_count'] ?? 0,
                'auto_mcq_score' => $autoGrade,
                'max_mcq_score' => $maxMcqScore,
                'student_name' => $validated['student_name']
            ]),
            'started_at' => now()->subMinutes($assessment->duration_minutes), // Approximate
            'submitted_at' => now(),
        ];

        // If it's ONLY MCQs, we can set the final grade immediately
        $hasTextQuestions = $assessment->questions->where('question_type', 'text')->count() > 0;
        if (!$hasTextQuestions && $maxMcqScore > 0) {
            $submissionData['grade'] = ($autoGrade / $maxMcqScore) * 100;
        }

        $submission = AssessmentSubmission::create([
            'assessment_id' => $id,
            'student_id' => $studentId,
            ...$submissionData
        ]);

        return response()->json(['success' => true, 'data' => $submission]);
    }
}
