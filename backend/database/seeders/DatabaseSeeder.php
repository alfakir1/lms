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
            'password' => 'password',
            'role' => 'admin',
        ]);

        // 2. Instructor
        $instructorUser = User::create([
            'name' => 'Dr. Ahmed',
            'login_id' => 'inst01',
            'email' => 'ahmed@lms.com',
            'password' => 'password',
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
            'password' => 'password',
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
            'password' => 'password',
            'role' => 'reception',
        ]);

        $course1 = \App\Models\Course::create([
            'title' => 'أساسيات البرمجة بلغة PHP',
            'description' => 'دورة تدريبية تغطي أساسيات لغة PHP والتعامل مع قواعد البيانات.',
            'price' => 50.00,
            'instructor_id' => $instructorUser->instructor->id,
            'status' => 'active',
        ]);

        \App\Models\Lesson::create([
            'course_id' => $course1->id,
            'title' => 'مقدمة عن PHP',
            'order' => 1,
            'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        ]);

        $course2 = \App\Models\Course::create([
            'title' => 'تطوير واجهات المستخدم باستخدام React',
            'description' => 'تعلم بناء تطبيقات ويب حديثة وتفاعلية باستخدام React.',
            'price' => 75.00,
            'instructor_id' => $instructorUser->instructor->id,
            'status' => 'active',
        ]);

        \App\Models\Lesson::create([
            'course_id' => $course2->id,
            'title' => 'مقدمة عن React',
            'order' => 1,
            'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        ]);

        // 6. Enrollments for testing
        $studentUser = User::where('role', 'student')->first();
        if ($studentUser) {
            Enrollment::create([
                'course_id' => $course1->id,
                'student_id' => $studentUser->student->id,
                'status' => 'active',
                'payment_status' => 'paid',
            ]);
        }
    }
}

