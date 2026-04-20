<?php

namespace App\Interfaces\HTTP\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Application\Courses\CreateLecture;
use App\Application\Courses\TrackLectureProgress;
use App\Infrastructure\Persistence\Models\Chapter;
use App\Infrastructure\Persistence\Models\Lecture;
use App\Application\Interfaces\StorageServiceInterface;
use Illuminate\Support\Facades\Auth;

class LectureController extends Controller
{
    private CreateLecture $createLectureUseCase;
    private TrackLectureProgress $trackProgressUseCase;
    private StorageServiceInterface $storageService;

    public function __construct(
        CreateLecture $createLectureUseCase, 
        TrackLectureProgress $trackProgressUseCase,
        StorageServiceInterface $storageService
    ) {
        $this->createLectureUseCase = $createLectureUseCase;
        $this->trackProgressUseCase = $trackProgressUseCase;
        $this->storageService = $storageService;
    }

    public function store(Request $request, Chapter $chapter)
    {
        $this->authorize('update', $chapter->course);

        $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:video,text,pdf',
            'video_file' => 'nullable|mimes:mp4,mov,avi|max:500000',
        ]);

        $lecture = $this->createLectureUseCase->execute(
            $request->except('video_file'),
            $chapter->id,
            $request->file('video_file')
        );

        return response()->json($lecture, 201);
    }

    public function show(Lecture $lecture)
    {
        $this->authorize('view', $lecture);
        
        $lectureArray = $lecture->toArray();
        if ($lecture->video_url) {
            $lectureArray['secure_video_url'] = $this->storageService->generateSecureUrl($lecture->video_url);
        }

        return response()->json($lectureArray);
    }

    public function trackProgress(Request $request, Lecture $lecture)
    {
        $this->authorize('view', $lecture);

        $request->validate([
            'watch_time' => 'required|integer',
            'last_position' => 'required|integer',
            'mark_completed' => 'boolean'
        ]);

        $progress = $this->trackProgressUseCase->execute(
            Auth::id(),
            $lecture->id,
            $request->input('watch_time'),
            $request->input('last_position'),
            $request->input('mark_completed', false)
        );

        return response()->json($progress);
    }
}
