<?php

namespace App\Application\AI;

use App\Application\Services\GeminiService;
use App\Models\Course;
use Illuminate\Support\Facades\Log;

class GenerateAssessmentFromCourse
{
    protected GeminiService $gemini;

    public function __construct(GeminiService $gemini)
    {
        $this->gemini = $gemini;
    }

    /**
     * Generate assessment from course content
     *
     * @param int $courseId
     * @return array
     */
    public function execute(int $courseId): array
    {
        try {
            $course = Course::with('lessons')->findOrFail($courseId);

            $content = "Course Title: " . $course->title . "\n";
            $content .= "Course Description: " . $course->description . "\n\n";
            $content .= "Lessons:\n";

            foreach ($course->lessons as $lesson) {
                // Take a snippet of lesson content to stay within token limits if needed
                $content .= "- " . $lesson->title . ": " . substr(strip_tags($lesson->content), 0, 500) . "...\n";
            }

            $prompt = "Based on the following course content, generate a comprehensive assessment with 5-10 multiple-choice questions. 
            Each question should have 4 options and 1 correct answer (index 0-3).
            Return the response ONLY as a valid JSON object with the following structure:
            {
              \"title\": \"Assessment Title\",
              \"description\": \"Assessment Description\",
              \"questions\": [
                {
                  \"question_text\": \"Question text\",
                  \"options\": [\"Option 0\", \"Option 1\", \"Option 2\", \"Option 3\"],
                  \"correct_option_index\": 0
                }
              ]
            }
            
            Course Content:
            " . $content;

            $response = $this->gemini->generateContent($prompt);

            if ($response['status'] === 'success') {
                $text = $response['content'];
                
                // Clean up markdown if AI returned it
                if (preg_match('/```json\s*(.*?)\s*```/s', $text, $matches)) {
                    $text = $matches[1];
                }
                
                $decoded = json_decode(trim($text), true);
                
                if (json_last_error() === JSON_ERROR_NONE) {
                    return [
                        'status' => 'success',
                        'data' => $decoded
                    ];
                }

                Log::warning('AI generated invalid JSON for assessment: ' . $text);
                return [
                    'status' => 'error',
                    'message' => 'AI generated an invalid format. Please try again.',
                    'raw_content' => $text
                ];
            }

            return $response;

        } catch (\Exception $e) {
            Log::error('GenerateAssessmentFromCourse Error: ' . $e->getMessage());
            return [
                'status' => 'error',
                'message' => 'Failed to generate assessment: ' . $e->getMessage()
            ];
        }
    }
}
