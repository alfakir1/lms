<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required', // can be email or login_id
            'password' => 'required',
        ]);

        // Attempt to find user by login_id or email
        $user = User::where('login_id', $request->login)
                    ->orWhere('email', $request->login)
                    ->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'login' => ['بيانات الاعتماد غير صحيحة.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        // Determine dashboard URL based on role
        $dashboard = match ($user->role) {
            'admin' => '/admin/dashboard',
            'instructor' => '/instructor/dashboard',
            'student' => '/student/dashboard',
            'reception' => '/reception/dashboard',
            default => '/dashboard',
        };

        return response()->json([
            'message' => 'تم تسجيل الدخول بنجاح',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'login_id' => $user->login_id,
                'email' => $user->email,
                'role' => $user->role,
                'instructor' => $user->instructor ? ['id' => $user->instructor->id] : null,
                'student' => $user->student ? ['id' => $user->student->id] : null,
            ],

            'redirect_to' => $dashboard
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user()->load(['instructor', 'student']));
    }


    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'تم تسجيل الخروج بنجاح'
        ]);
    }
}
