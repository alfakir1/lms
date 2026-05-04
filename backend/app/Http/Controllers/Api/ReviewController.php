<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Course;

class ReviewController extends Controller
{
    public function store(Request $request, Course $course)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $userId = $request->user()->id;

        $existingReview = Review::where('user_id', $userId)->where('course_id', $course->id)->first();
        
        if ($existingReview) {
            return response()->json([
                'status' => 'error',
                'message' => 'You have already reviewed this course.'
            ], 400);
        }

        $review = Review::create([
            'user_id' => $userId,
            'course_id' => $course->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $review->load('user:id,name,profile_image'),
            'message' => 'Review submitted successfully'
        ], 201);
    }

    public function index(Course $course)
    {
        $reviews = $course->reviews()->with('user:id,name,profile_image')->latest()->get();
        return response()->json([
            'status' => 'success',
            'data' => $reviews,
            'message' => 'Reviews retrieved successfully'
        ]);
    }
}
