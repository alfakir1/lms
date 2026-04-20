<?php

namespace Database\Seeders;

use App\Infrastructure\Persistence\Models\User;
use App\Infrastructure\Persistence\Models\Instructor;
use App\Infrastructure\Persistence\Models\Student;
use App\Infrastructure\Persistence\Models\Admin;
use App\Infrastructure\Persistence\Models\SuperAdmin;
use App\Infrastructure\Persistence\Models\Course;
use App\Infrastructure\Persistence\Models\Chapter;
use App\Infrastructure\Persistence\Models\Lecture;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Super Admin
        $superAdminUser = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('password123'),
            'role' => 'super_admin',
            'status' => 'active'
        ]);
        SuperAdmin::create(['user_id' => $superAdminUser->id]);

        // 2. Create Admin
        $adminUser = User::create([
            'name' => 'Admin Manager',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'status' => 'active'
        ]);
        Admin::create(['user_id' => $adminUser->id]);

        // 3. Create Instructor
        $instructorUser = User::create([
            'name' => 'Dr. John Doe',
            'email' => 'instructor@example.com',
            'password' => Hash::make('password123'),
            'role' => 'instructor',
            'status' => 'active'
        ]);
        $instructor = Instructor::create([
            'user_id' => $instructorUser->id,
            'bio' => 'Professional Developer with 10 years experience.',
        ]);

        // 4. Create Student
        $studentUser = User::create([
            'name' => 'Jane Student',
            'email' => 'student@example.com',
            'password' => Hash::make('password123'),
            'role' => 'student',
            'status' => 'active'
        ]);
        Student::create(['user_id' => $studentUser->id]);

        // 5. Create a Mock Course for the Instructor
        $course = Course::create([
            'instructor_id' => $instructor->id,
            'title' => 'Mastering Laravel Clean Architecture',
            'slug' => 'mastering-laravel-clean-architecture-' . Str::uuid(),
            'description' => 'A complete guide to building enterprise applications.',
            'price' => 199.99,
            'status' => 'published',
        ]);

        // 6. Create Chapters
        $chapter1 = Chapter::create([
            'course_id' => $course->id,
            'title' => 'Introduction to Clean Architecture',
            'order_index' => 1,
        ]);

        $chapter2 = Chapter::create([
            'course_id' => $course->id,
            'title' => 'Building the Domain Layer',
            'order_index' => 2,
        ]);

        // 7. Create Lectures
        Lecture::create([
            'chapter_id' => $chapter1->id,
            'title' => 'What is Clean Architecture?',
            'content_type' => 'video',
            'content_url' => 'lectures/videos/mock_video_1.mp4',
            'duration' => 600, // 10 mins
            'order_index' => 1,
        ]);

        Lecture::create([
            'chapter_id' => $chapter2->id,
            'title' => 'Entities and Value Objects',
            'content_type' => 'video',
            'content_url' => 'lectures/videos/mock_video_2.mp4',
            'duration' => 1200, // 20 mins
            'order_index' => 1,
        ]);
    }
}
