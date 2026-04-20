<?php

namespace App\Application\Courses;

use App\Infrastructure\Persistence\Models\LectureProgress;
use Carbon\Carbon;

class TrackLectureProgress
{
    public function execute(int $userId, int $lectureId, int $watchTime, int $lastPosition, bool $markCompleted = false): LectureProgress
    {
        $progress = LectureProgress::firstOrCreate(
            ['user_id' => $userId, 'lecture_id' => $lectureId],
            ['watch_time' => 0, 'last_position' => 0]
        );

        $progress->watch_time += $watchTime;
        $progress->last_position = $lastPosition;

        if ($markCompleted && is_null($progress->completed_at)) {
            $progress->completed_at = Carbon::now();
        }

        $progress->save();

        return $progress;
    }
}
