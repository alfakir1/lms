<?php

namespace App\Interfaces\HTTP\Controllers;

use App\Application\Users\AuthService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function register(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'required|email|unique:users,email',
            'phone'       => 'nullable|string|max:20',
            'password'    => 'required|string|min:8|confirmed',
            'role'        => 'nullable|in:student,instructor',
            'device_uuid' => 'nullable|string',
        ]);

        $result = $this->authService->register($data);

        return response()->json([
            'message' => 'Registered successfully.',
            'user'    => $result['user'],
            'token'   => $result['token'],
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email'       => 'required|email',
            'password'    => 'required|string',
            'device_uuid' => 'nullable|string',
        ]);

        try {
            $result = $this->authService->login(
                $data['email'],
                $data['password'],
                $data['device_uuid'] ?? null
            );

            return response()->json([
                'message' => 'Login successful.',
                'user'    => $result['user'],
                'token'   => $result['token'],
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 401);
        }
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request->user());
        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }

    public function updateFingerprint(Request $request)
    {
        $data = $request->validate(['fingerprint_hash' => 'required|string']);
        $this->authService->updateFingerprint($request->user(), $data['fingerprint_hash']);
        return response()->json(['message' => 'Fingerprint updated.']);
    }
}
