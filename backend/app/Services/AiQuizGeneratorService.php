<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Models\Lesson;

class AiQuizGeneratorService
{
    /**
     * Generate quiz questions from lesson content using Gemini API.
     */
    public function generateForLesson(Lesson $lesson, int $numQuestions = 5)
    {
        $apiKey = env('GEMINI_API_KEY');
        
        $contentToAnalyze = "Title: {$lesson->title}\nDescription: {$lesson->description}\n";
        
        // If it's a local file, we might have notes or transcript. 
        // For YouTube, getting a transcript natively in PHP without an API key is unreliable.
        // We will pass the available lesson metadata.
        if ($lesson->content) {
            $contentToAnalyze .= "Additional Content/Notes: {$lesson->content}\n";
        }

        if (!$apiKey) {
            // Fallback mock if no API key is provided, to ensure safe mode and not crash the app
            return $this->mockResponse($numQuestions, $lesson->id);
        }

        $prompt = "You are an expert instructor. Based on the following lesson content, generate exactly {$numQuestions} quiz questions. Half should be multiple choice (MCQ) and half should be short answer text questions.\n\n" .
                  "Lesson Content:\n{$contentToAnalyze}\n\n" .
                  "Return ONLY a valid JSON array where each object has this structure:\n" .
                  "{\n" .
                  "  \"question_text\": \"The question?\",\n" .
                  "  \"question_type\": \"mcq\" (or \"text\"),\n" .
                  "  \"options\": [\"Option A\", \"Option B\", \"Option C\"] (only if mcq, otherwise null),\n" .
                  "  \"correct_answer\": \"The exact correct option string, or the short answer key phrase\"\n" .
                  "}";

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.2,
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '[]';
                // Clean markdown JSON block if present
                $text = str_replace(['```json', '```'], '', $text);
                $questions = json_decode(trim($text), true);
                
                if (is_array($questions) && count($questions) > 0) {
                    return $this->formatQuestions($questions, $lesson->id);
                }
            }
        } catch (\Exception $e) {
            \Log::error('AI Quiz Gen Error: ' . $e->getMessage());
        }

        // Fallback on error
        return $this->mockResponse($numQuestions, $lesson->id);
    }

    private function formatQuestions(array $rawQuestions, int $lessonId)
    {
        return array_map(function ($q) use ($lessonId) {
            return [
                'lesson_id' => $lessonId,
                'question_text' => $q['question_text'] ?? 'Auto-generated question',
                'question_type' => in_array($q['question_type'] ?? 'text', ['mcq', 'text']) ? $q['question_type'] : 'text',
                'options' => isset($q['options']) ? json_encode($q['options']) : null,
                'correct_answer' => $q['correct_answer'] ?? '',
            ];
        }, $rawQuestions);
    }

    private function mockResponse($count, $lessonId)
    {
        $questions = [];
        for ($i = 1; $i <= $count; $i++) {
            $type = $i % 2 === 0 ? 'mcq' : 'text';
            $questions[] = [
                'lesson_id' => $lessonId,
                'question_text' => "Auto-generated sample question {$i} based on lesson content?",
                'question_type' => $type,
                'options' => $type === 'mcq' ? json_encode(["Option A", "Option B", "Option C"]) : null,
                'correct_answer' => $type === 'mcq' ? "Option A" : "Sample expected answer key",
            ];
        }
        return $questions;
    }
}
