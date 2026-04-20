<?php

namespace App\Application\Users;

use App\Infrastructure\Persistence\Models\User;
use App\Infrastructure\Persistence\Models\Student;
use App\Infrastructure\Persistence\Models\Instructor;
use App\Infrastructure\Persistence\Models\Admin;
use App\Infrastructure\Persistence\Models\SuperAdmin;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    /**
     * Register a new user and attach the appropriate profile.
     *
     * @param array{name: string, email: string, phone: string, password: string, role: string, device_uuid: string} $data
     */
    public function register(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name'        => $data['name'],
                'email'       => $data['email'],
                'phone'       => $data['phone'] ?? null,
                'password'    => Hash::make($data['password']),
                'role'        => $data['role'] ?? 'student',
                'status'      => 'active',
                'device_uuid' => $data['device_uuid'] ?? null,
            ]);

            // Create role-specific profile
            match ($user->role) {
                'student'     => Student::create(['user_id' => $user->id]),
                'instructor'  => Instructor::create(['user_id' => $user->id]),
                'admin'       => Admin::create(['user_id' => $user->id]),
                'super_admin' => SuperAdmin::create(['user_id' => $user->id, 'can_manage_admins' => true]),
                default       => null,
            };

            $token = $user->createToken('lms_token')->plainTextToken;

            return ['user' => $user->load($user->role), 'token' => $token];
        });
    }

    /**
     * Authenticate and return a Sanctum token.
     */
    public function login(string $email, string $password, ?string $deviceUuid = null): array
    {
        $user = User::where('email', $email)->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            throw new \Exception('Invalid credentials.');
        }

        if ($user->status !== 'active') {
            throw new \Exception('Account is suspended.');
        }

        // Device Binding check
        if ($deviceUuid && $user->device_uuid && $user->device_uuid !== $deviceUuid) {
            throw new \Exception('This account is bound to a different device. Contact administrator.');
        }

        // Bind device on first login
        if ($deviceUuid && ! $user->device_uuid) {
            $user->update(['device_uuid' => $deviceUuid]);
        }

        // Revoke old tokens to enforce single-session policy
        $user->tokens()->delete();

        $token = $user->createToken('lms_token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    /**
     * Update fingerprint hash (called after mobile biometric validation).
     */
    public function updateFingerprint(User $user, string $fingerprintHash): void
    {
        $user->update(['fingerprint_hash' => $fingerprintHash]);
    }

    /**
     * Revoke all tokens (logout).
     */
    public function logout(User $user): void
    {
        $user->tokens()->delete();
    }
}
