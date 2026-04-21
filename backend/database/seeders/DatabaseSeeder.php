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

        // 5. Create Multiple Instructors and Courses
        $categories = ['web-development', 'programming', 'data-science', 'design', 'marketing'];
        $instructorNames = ['Dr. Sarah Ahmed', 'Eng. Mohammed Ali', 'Prof. David Chen', 'Expert Lisa Ray'];

        foreach ($instructorNames as $name) {
            $user = User::create([
                'name' => $name,
                'email' => strtolower(str_replace(' ', '.', $name)) . '@example.com',
                'password' => Hash::make('password123'),
                'role' => 'instructor',
                'status' => 'active'
            ]);
            $inst = Instructor::create(['user_id' => $user->id, 'bio' => "Expert in " . $categories[array_rand($categories)]]);

            // Create 2 courses for each instructor
            for ($i = 1; $i <= 2; $i++) {
                $category = $categories[array_rand($categories)];
                $course = Course::create([
                    'instructor_id' => $inst->id,
                    'title' => "Mastering {$category} Vol. {$i}",
                    'slug' => Str::slug("Mastering {$category} Vol. {$i}") . '-' . Str::random(5),
                    'description' => "A comprehensive guide to {$category} techniques and best practices.",
                    'price' => rand(99, 299),
                    'status' => 'published',
                ]);

                // Create a basic chapter and lecture for each
                $chapter = Chapter::create([
                    'course_id' => $course->id,
                    'title' => 'Getting Started',
                    'order_index' => 1,
                ]);

                Lecture::create([
                    'chapter_id' => $chapter->id,
                    'title' => 'Introduction to the Course',
                    'content_type' => 'video',
                    'content_url' => 'lectures/videos/intro.mp4',
                    'duration' => 600,
                    'order_index' => 1,
                ]);
            }
        }

        // 6. Create Multiple Students
        for ($i = 1; $i <= 5; $i++) {
            $user = User::create([
                'name' => "Student $i",
                'email' => "student$i@example.com",
                'password' => Hash::make('password123'),
                'role' => 'student',
                'status' => 'active'
            ]);
            Student::create(['user_id' => $user->id]);
        }
    }
}
