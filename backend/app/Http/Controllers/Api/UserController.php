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
        ]);

        if ($user->role === 'reception' && $validated['role'] !== 'student') {
            abort(403, 'Unauthorized to create this role.');
        }

        $validated['password'] = Hash::make($validated['password']);
        
        $newUser = User::create($validated);

        if ($newUser->role === 'student') {
            Student::create(['user_id' => $newUser->id, 'enrollment_year' => date('Y')]);
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
        return response()->json($user);
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
            'role' => 'sometimes|string', // Only admin can change role realistically, but ignoring that complex logic for now and just protecting reception.
        ]);

        if ($authUser->role === 'reception' && isset($validated['role']) && $validated['role'] !== 'student') {
            abort(403, 'Unauthorized to change to this role.');
        }

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json($user);
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
}
