<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Instructor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = User::query();

        // Reception can only see students
        if ($user->role === 'reception') {
            $query->where('role', 'student');
        }

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        return response()->json($query->with(['instructor', 'student'])->get());
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $allowedRoles = $user->role === 'admin' 
            ? ['admin', 'instructor', 'student', 'reception'] 
            : ['student']; // Reception can only create students

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'login_id' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => ['required', Rule::in($allowedRoles)],
            'is_active' => 'sometimes|boolean',
        ]);

        if ($user->role === 'reception' && $validated['role'] !== 'student') {
            abort(403, 'Unauthorized to create this role.');
        }

        $validated['password'] = Hash::make($validated['password']);
        
        $newUser = User::create($validated);

        if ($newUser->role === 'student') {
            Student::create(['user_id' => $newUser->id, 'enrollment_year' => date('Y')]);
            
            // Notify Admins
            $admins = User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                \App\Models\Notification::create([
                    'user_id' => $admin->id,
                    'type' => 'student_registered',
                    'title' => 'طالب جديد مسجل',
                    'message' => 'تم تسجيل طالب جديد: ' . $newUser->name,
                ]);
            }
        } elseif ($newUser->role === 'instructor') {
            Instructor::create(['user_id' => $newUser->id, 'specialization' => 'General']);
        }

        // Load relationships so frontend can access student.id / instructor.id
        $newUser->load(['student', 'instructor']);

        return response()->json($newUser, 201);
    }

    public function show(Request $request, User $user)
    {
        if ($request->user()->role === 'reception' && $user->role !== 'student') {
            abort(403, 'Unauthorized.');
        }
        return response()->json($user->load(['student', 'instructor']));
    }

    public function update(Request $request, User $user)
    {
        $authUser = $request->user();

        if ($authUser->role === 'reception' && $user->role !== 'student') {
            abort(403, 'Unauthorized.');
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'login_id' => ['sometimes', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|string|min:6',
            'role' => 'sometimes|string',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($authUser->role === 'reception' && isset($validated['role']) && $validated['role'] !== 'student') {
            abort(403, 'Unauthorized to change to this role.');
        }

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json($user->load(['student', 'instructor']));
    }

    public function destroy(Request $request, User $user)
    {
        $authUser = $request->user();
        if ($authUser->role !== 'admin') {
            abort(403, 'Only admins can delete users.');
        }
        $user->delete();
        return response()->json(null, 204);
    }

    public function financialStatement(Request $request, User $user)
    {
        if ($user->role !== 'student') {
            abort(422, 'User is not a student.');
        }

        $student = $user->student;
        if (!$student) {
            abort(404, 'Student profile not found.');
        }

        $enrollments = \App\Models\Enrollment::with(['course'])
            ->where('student_id', $student->id)
            ->get();

        $payments = \App\Models\Payment::with(['course'])
            ->where('student_id', $student->id)
            ->get();

        $totalDue = $enrollments->sum(fn($e) => $e->course->price ?? 0);
        $totalPaid = $payments->where('status', 'completed')->sum('amount');

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'student' => $student,
                'enrollments' => $enrollments,
                'payments' => $payments,
                'summary' => [
                    'total_due' => $totalDue,
                    'total_paid' => $totalPaid,
                    'balance' => $totalDue - $totalPaid,
                ]
            ]
        ]);
    }

    public function academicReport(Request $request, User $user)
    {
        if ($user->role !== 'student') {
            abort(422, 'User is not a student.');
        }

        $student = $user->student;
        if (!$student) {
            abort(404, 'Student profile not found.');
        }

        $enrollments = \App\Models\Enrollment::with(['course'])
            ->where('student_id', $student->id)
            ->get();

        $grades = \App\Models\Grade::with(['assignment', 'course'])
            ->where('student_id', $student->id)
            ->get();

        $attendance = \App\Models\Attendance::where('student_id', $student->id)->get();
        
        $certificates = \App\Models\Certificate::with(['course'])
            ->where('student_id', $student->id)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'student' => $student,
                'enrollments' => $enrollments,
                'grades' => $grades,
                'attendance' => [
                    'total' => $attendance->count(),
                    'present' => $attendance->where('status', 'present')->count(),
                    'absent' => $attendance->where('status', 'absent')->count(),
                ],
                'certificates' => $certificates
            ]
        ]);
    }
}
