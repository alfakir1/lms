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
        $contentType = $data['type'] ?? $data['content_type'] ?? 'video'; // video, text, pdf/document
        if ($contentType === 'pdf') {
            $contentType = 'document';
        }

        $contentUrl = null;
        if ($videoFile) {
            $folder = $contentType === 'document' ? 'lectures/docs' : 'lectures/videos';
            $path = $folder . '/' . Str::uuid() . '.' . $videoFile->getClientOriginalExtension();
            $contentUrl = $this->storageService->uploadFile($path, file_get_contents($videoFile->getRealPath()));
        }

        return Lecture::create([
            'chapter_id' => $chapterId,
            'title' => $data['title'],
            'slug' => $data['slug'] ?? null,
            'content_type' => $contentType,
            'content_url' => $contentUrl,
            // DB stores duration as integer minutes
            'duration' => isset($data['duration']) ? (int) $data['duration'] : null,
            'order_index' => isset($data['order_index']) ? (int) $data['order_index'] : 0,
            'status' => $data['status'] ?? 'active',
        ]);
    }
}
