<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use Illuminate\Http\Request;

class GradeController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Grade::with(['course', 'student.user']);

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        if ($user->role === 'student') {
            $query->where('student_id', $user->student->id ?? 0);
        } elseif ($user->role === 'instructor') {
            $instructorId = $user->instructor->id ?? 0;
            $query->whereHas('course', function($q) use ($instructorId) {
                $q->where('instructor_id', $instructorId);
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'instructor') abort(403);

        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'course_id' => 'required|exists:courses,id',
            'grade_type' => 'required|string|in:attendance_score,assignment_score,quiz_score,midterm_score,final_score',
            'score' => 'required|numeric|min:0',
        ]);

        $grade = Grade::firstOrNew([
            'student_id' => $validated['student_id'],
            'course_id' => $validated['course_id']
        ]);

        $grade->{$validated['grade_type']} = $validated['score'];
        
        $grade->total_score = $grade->attendance_score + $grade->assignment_score + $grade->quiz_score + $grade->midterm_score + $grade->final_score;
        $grade->grade_status = $grade->total_score >= 60 ? 'pass' : 'fail';
        $grade->save();

        // Auto-generate Certificate based on updated total score
        $percentage = min($grade->total_score, 100);
        if ($percentage >= 90) $letterGrade = 'A';
        elseif ($percentage >= 80) $letterGrade = 'B';
        elseif ($percentage >= 70) $letterGrade = 'C';
        elseif ($percentage >= 60) $letterGrade = 'D';
        else $letterGrade = 'F';

        \App\Models\Certificate::updateOrCreate(
            ['student_id' => $grade->student_id, 'course_id' => $grade->course_id],
            ['percentage' => $percentage, 'grade' => $letterGrade]
        );

        return response()->json($grade, 201);
    }
}
