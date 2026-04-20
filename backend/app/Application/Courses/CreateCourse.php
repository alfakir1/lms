<?php

namespace App\Application\Courses;

use App\Infrastructure\Persistence\Models\Course;
use App\Application\Interfaces\StorageServiceInterface;
use Illuminate\Support\Str;

class CreateCourse
{
    private StorageServiceInterface $storageService;

    public function __construct(StorageServiceInterface $storageService)
    {
        $this->storageService = $storageService;
    }

    public function execute(array $data, int $instructorId, $thumbnailFile = null): Course
    {
        $thumbnailPath = null;
        if ($thumbnailFile) {
            $path = 'courses/thumbnails/' . Str::uuid() . '.' . $thumbnailFile->getClientOriginalExtension();
            $thumbnailPath = $this->storageService->uploadFile($path, file_get_contents($thumbnailFile->getRealPath()));
        }

        return Course::create([
            'instructor_id' => $instructorId,
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'price' => $data['price'] ?? 0,
            'slug' => Str::slug($data['title']) . '-' . uniqid(),
            'release_date' => $data['release_date'] ?? null,
            'status' => 'draft',
            // Ideally we'd store thumbnail path if the model had it; for now we assume it could be added if needed
        ]);
    }
}
