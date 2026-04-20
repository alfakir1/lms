<?php

namespace App\Interfaces\HTTP\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Infrastructure\Persistence\Models\Course;
use App\Infrastructure\Persistence\Models\Chapter;

class ChapterController extends Controller
{
    public function store(Request $request, Course $course)
    {
        $this->authorize('update', $course);

        $request->validate([
            'title' => 'required|string|max:255',
            'order_index' => 'integer|min:0',
        ]);

        $chapter = $course->chapters()->create($request->all());

        return response()->json($chapter, 201);
    }

    public function update(Request $request, Chapter $chapter)
    {
        $this->authorize('update', $chapter->course);

        $request->validate([
            'title' => 'string|max:255',
            'order_index' => 'integer|min:0',
        ]);

        $chapter->update($request->all());

        return response()->json($chapter);
    }

    public function destroy(Chapter $chapter)
    {
        $this->authorize('update', $chapter->course);
        $chapter->delete();
        return response()->json(['message' => 'Chapter deleted']);
    }
}
