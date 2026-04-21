<?php

namespace App\Interfaces\HTTP\Controllers;

use App\Application\Users\AuthService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
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

        return $this->apiResponse('success', [
            'user'    => $result['user'],
            'token'   => $result['token'],
        ], 'Registered successfully.', 201);
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

            return $this->apiResponse('success', [
                'user'    => $result['user'],
                'token'   => $result['token'],
            ], 'Login successful.');
        } catch (\Exception $e) {
            return $this->apiResponse('error', null, $e->getMessage(), 401);
        }
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request->user());
        return $this->apiResponse('success', null, 'Logged out successfully.');
    }

    public function me(Request $request)
    {
        return $this->apiResponse('success', $request->user());
    }

    public function updateFingerprint(Request $request)
    {
        $data = $request->validate(['fingerprint_hash' => 'required|string']);
        $this->authService->updateFingerprint($request->user(), $data['fingerprint_hash']);
        return $this->apiResponse('success', null, 'Fingerprint updated.');
    }
}
