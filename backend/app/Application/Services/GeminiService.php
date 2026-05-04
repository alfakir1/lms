<?php

namespace App\Application\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected string $apiKey;
    protected string $model;
    protected string $baseUrl = 'https://generativelanguage.googleapis.com/v1/models/';

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key');
        $this->model = config('services.gemini.model', 'gemini-1.5-flash');
    }

    /**
     * Generate content using Gemini API
     *
     * @param string $prompt
     * @return array
     */
    public function generateContent(string $prompt): array
    {
        try {
            $url = "{$this->baseUrl}{$this->model}:generateContent?key={$this->apiKey}";

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($url, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;

                if ($text) {
                    return [
                        'status' => 'success',
                        'content' => $text,
                        'raw' => $data
                    ];
                }
            }

            Log::error('Gemini API Error: ' . $response->body());
            return [
                'status' => 'error',
                'message' => 'I am sorry, but I encountered an error while generating content. Please try again later.',
                'details' => $response->json()
            ];

        } catch (\Exception $e) {
            Log::error('Gemini Service Exception: ' . $e->getMessage());
            return [
                'status' => 'error',
                'message' => 'An unexpected error occurred. Please try again later.',
                'error' => $e->getMessage()
            ];
        }
    }
}
