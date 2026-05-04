<?php

namespace App\Application\AI;

use App\Application\Services\GeminiService;
use App\Models\Course;
use Illuminate\Support\Facades\Log;

class SendMessageToAI
{
    protected GeminiService $gemini;

    public function __construct(GeminiService $gemini)
    {
        $this->gemini = $gemini;
    }

    /**
     * Send message to AI Tutor with course context
     *
     * @param string $message
     * @param int|null $courseId
     * @return array
     */
    public function execute(string $message, ?int $courseId = null): array
    {
        try {
            $context = "";
            if ($courseId) {
                $course = Course::with('lessons')->find($courseId);
                if ($course) {
                    $context = "You are an expert AI Tutor for the course: '" . $course->title . "'.\n";
                    $context .= "Course Context:\n" . $course->description . "\n\n";
                    $context .= "Lessons in this course:\n";
                    foreach ($course->lessons as $lesson) {
                        $context .= "- " . $lesson->title . "\n";
                    }
                    $context .= "\nStudent Instruction: Answer the question below as a helpful tutor. Use the course context to provide relevant examples. Be encouraging and clear.\n\n";
                }
            } else {
                $context = "You are a helpful AI Education Assistant for an LMS platform. Answer the student's questions concisely and professionally.\n\n";
            }

            $prompt = $context . "Student Question: " . $message;

            $response = $this->gemini->generateContent($prompt);

            return $response;

        } catch (\Exception $e) {
            Log::error('SendMessageToAI Error: ' . $e->getMessage());
            return [
                'status' => 'error',
                'message' => 'Failed to get AI response: ' . $e->getMessage()
            ];
        }
    }
}
