<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Infrastructure\Persistence\Models\User;
use App\Infrastructure\Persistence\Models\SuperAdmin;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@lms.com',
            'password' => Hash::make('password123'),
            'role' => 'super_admin',
            'status' => 'active',
            'phone' => '0123456789',
        ]);

        SuperAdmin::create([
            'user_id' => $user->id,
            'can_manage_admins' => true,
        ]);
    }
}
