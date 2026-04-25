<?php

namespace App\Interfaces\HTTP\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Application\Courses\CreateLecture;
use App\Application\Courses\TrackLectureProgress;
use App\Infrastructure\Persistence\Models\Chapter;
use App\Infrastructure\Persistence\Models\Lecture;
use App\Infrastructure\Persistence\Models\LectureProgress;
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
            'type' => 'required|in:video,text,pdf,document',
            'duration' => 'nullable|integer|min:0',
            'order_index' => 'nullable|integer|min:0',
            'content_file' => 'nullable|file|mimes:mp4,mov,avi,pdf|max:500000',
        ]);

        $lecture = $this->createLectureUseCase->execute(
            $request->except('content_file'),
            $chapter->id,
            $request->file('content_file')
        );

        return $this->apiResponse('success', $lecture, 'Lecture created successfully', 201);
    }

    public function index(Chapter $chapter)
    {
        $this->authorize('view', $chapter->course);
        $lectures = $chapter->lectures()->orderBy('order_index')->get();
        return $this->apiResponse('success', $lectures);
    }

    public function show(Lecture $lecture)
    {
        $this->authorize('view', $lecture);
        
        $lectureArray = $lecture->toArray();
        if ($lecture->content_url) {
            $lectureArray['secure_content_url'] = $this->storageService->generateSecureUrl($lecture->content_url);
        }

        $progress = LectureProgress::where('user_id', Auth::id())
            ->where('lecture_id', $lecture->id)
            ->first();
        $lectureArray['progress'] = $progress;

        return $this->apiResponse('success', $lectureArray);
    }

    public function update(Request $request, Lecture $lecture)
    {
        $this->authorize('update', $lecture);

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'duration' => 'sometimes|nullable|integer|min:0',
            'order_index' => 'sometimes|integer|min:0',
            'status' => 'sometimes|string',
        ]);

        $lecture->update($data);
        return $this->apiResponse('success', $lecture, 'Lecture updated successfully');
    }

    public function destroy(Lecture $lecture)
    {
        $this->authorize('delete', $lecture);
        $lecture->delete();
        return $this->apiResponse('success', null, 'Lecture deleted');
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

        return $this->apiResponse('success', $progress, 'Progress tracked successfully');
    }
}
