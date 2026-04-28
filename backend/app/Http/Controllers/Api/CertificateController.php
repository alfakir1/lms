<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Certificate::with(['student.user', 'course']);

        if ($user->role === 'student') {
            $query->where('student_id', $user->student->id ?? 0);
        } elseif ($user->role === 'instructor') {
            $instructorId = $user->instructor->id ?? 0;
            $query->whereHas('course', function($q) use ($instructorId) {
                $q->where('instructor_id', $instructorId);
            });
        }
        // admin and reception see all.

        return response()->json([
            'success' => true,
            'data' => $query->get()
        ]);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();
        $certificate = Certificate::with(['student.user', 'course'])->findOrFail($id);
        
        if ($user->role === 'student' && $certificate->student_id !== ($user->student->id ?? 0)) {
            abort(403);
        } elseif ($user->role === 'instructor') {
            if ($certificate->course->instructor_id !== ($user->instructor->id ?? 0)) {
                abort(403);
            }
        }

        return response()->json([
            'success' => true,
            'data' => $certificate
        ]);
    }
}
