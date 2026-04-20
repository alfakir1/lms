<?php

namespace App\Application\Courses;

use App\Infrastructure\Persistence\Models\Lecture;
use App\Application\Interfaces\StorageServiceInterface;
use Illuminate\Support\Str;

class CreateLecture
{
    private StorageServiceInterface $storageService;

    public function __construct(StorageServiceInterface $storageService)
    {
        $this->storageService = $storageService;
    }

    public function execute(array $data, int $chapterId, $videoFile = null): Lecture
    {
        $videoPath = null;
        if ($videoFile) {
            // Upload to Local/Firebase
            $path = 'lectures/videos/' . Str::uuid() . '.' . $videoFile->getClientOriginalExtension();
            $videoPath = $this->storageService->uploadFile($path, file_get_contents($videoFile->getRealPath()));
        }

        return Lecture::create([
            'chapter_id' => $chapterId,
            'title' => $data['title'],
            'type' => $data['type'] ?? 'video', // video, text, pdf
            'content' => $data['content'] ?? null,
            'video_url' => $videoPath, // we save the path, and generate secure URL at runtime
            'duration' => $data['duration'] ?? 0,
            'is_free' => $data['is_free'] ?? false,
            'order_index' => $data['order_index'] ?? 0,
        ]);
    }
}
