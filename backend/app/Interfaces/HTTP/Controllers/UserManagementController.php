<?php

namespace App\Interfaces\HTTP\Controllers;

use App\Infrastructure\Persistence\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

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

        return $this->apiResponse('success', $users, 'Users retrieved successfully');
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

        return $this->apiResponse('success', $user, 'User updated successfully');
    }
}
