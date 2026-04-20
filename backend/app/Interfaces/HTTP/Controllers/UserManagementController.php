<?php

namespace App\Interfaces\HTTP\Controllers;

use App\Infrastructure\Persistence\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class UserManagementController extends Controller
{
    /**
     * List all users with pagination and simple filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        // Search by name or email
        if ($request->has('search')) {
            $search = $request->query('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->has('role')) {
            $query->where('role', $request->query('role'));
        }

        $users = $query->latest()->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Update user role or basic info.
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'role' => 'in:student,instructor,admin,super_admin',
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'data' => $user
        ]);
    }
}
