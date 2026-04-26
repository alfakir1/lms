<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Instructor;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Admin
        $admin = User::create([
            'name' => 'System Admin',
            'login_id' => 'admin01',
            'email' => 'admin@lms.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // 2. Instructor
        $instructorUser = User::create([
            'name' => 'Dr. Ahmed',
            'login_id' => 'inst01',
            'email' => 'ahmed@lms.com',
            'password' => Hash::make('password'),
            'role' => 'instructor',
        ]);
        Instructor::create([
            'user_id' => $instructorUser->id,
            'specialization' => 'Computer Science',
        ]);

        // 3. Student
        $studentUser = User::create([
            'name' => 'Ali Student',
            'login_id' => 'std01',
            'email' => 'ali@lms.com',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);
        Student::create([
            'user_id' => $studentUser->id,
            'enrollment_year' => 2024,
        ]);

        // 4. Reception
        User::create([
            'name' => 'Sara Reception',
            'login_id' => 'rec01',
            'email' => 'sara@lms.com',
            'password' => Hash::make('password'),
            'role' => 'reception',
        ]);
    }
}
