<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use App\Models\Instructor;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\Attendance;
use App\Models\Grade;
use App\Models\Certificate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create 4 Trainers
        $trainersData = [
            ['name' => 'أحمد علي', 'email' => 'ahmed.trainer@lms.com', 'spec' => 'Programming'],
            ['name' => 'Sara Smith', 'email' => 'sara.biz@lms.com', 'spec' => 'Business'],
            ['name' => 'محمد حسن', 'email' => 'm.hassan@lms.com', 'spec' => 'Design'],
            ['name' => 'Elena Rodriguez', 'email' => 'elena.lang@lms.com', 'spec' => 'Language'],
        ];

        $instructors = [];
        foreach ($trainersData as $data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'login_id' => str_replace('.', '_', explode('@', $data['email'])[0]),
                'password' => Hash::make('password'),
                'role' => 'instructor',
            ]);

            $instructors[] = Instructor::create([
                'user_id' => $user->id,
                'specialization' => $data['spec'],
                'phone' => '05' . rand(10000000, 99999999),
                'address' => 'Main Street, City',
            ]);
        }

        // 2. Create 8 Courses
        $coursesData = [
            ['title' => 'Web Development with Laravel', 'desc' => 'Master full-stack dev', 'price' => 250, 'cat' => 'Programming', 'ins' => 0],
            ['title' => 'Mobile App Design (UI/UX)', 'desc' => 'Design stunning apps', 'price' => 180, 'cat' => 'Design', 'ins' => 2],
            ['title' => 'English for Professionals', 'desc' => 'Level up your English', 'price' => 120, 'cat' => 'Language', 'ins' => 3],
            ['title' => 'Strategic Business Management', 'desc' => 'Lead with confidence', 'price' => 300, 'cat' => 'Business', 'ins' => 1],
            ['title' => 'Python for Data Science', 'desc' => 'Analyze data like a pro', 'price' => 280, 'cat' => 'Programming', 'ins' => 0],
            ['title' => 'Graphic Design Masterclass', 'desc' => 'Photoshop & Illustrator', 'price' => 200, 'cat' => 'Design', 'ins' => 2],
            ['title' => 'French for Beginners', 'desc' => 'Learn French basics', 'price' => 110, 'cat' => 'Language', 'ins' => 3],
            ['title' => 'Entrepreneurship 101', 'desc' => 'Start your own business', 'price' => 150, 'cat' => 'Business', 'ins' => 1],
        ];

        $courses = [];
        foreach ($coursesData as $c) {
            $courses[] = Course::create([
                'title' => $c['title'],
                'description' => $c['desc'],
                'price' => $c['price'],
                'start_date' => now()->addDays(rand(1, 30)),
                'end_date' => now()->addMonths(3),
                'instructor_id' => $instructors[$c['ins']]->id,
                'status' => 'active',
            ]);
        }

        // 3. Create 20 Students
        $students = [];
        $arabicNames = ['عمر فاروق', 'ليلى خالد', 'ياسين منصور', 'نورة الشهري', 'خالد الحربي', 'مريم عبيد', 'سلطان القحطاني', 'ريم العتيبي', 'فهد الدوسري', 'هناء الزهراني'];
        $englishNames = ['John Doe', 'Alice Johnson', 'Robert Wilson', 'Emma Brown', 'Michael Scott', 'Olivia White', 'William King', 'Sophia Davis', 'James Miller', 'Isabella Garcia'];
        
        $names = array_merge($arabicNames, $englishNames);
        shuffle($names);

        foreach ($names as $i => $name) {
            $email = strtolower(str_replace(' ', '.', $name)) . $i . '@student.com';
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'login_id' => 'std' . ($i + 100),
                'password' => Hash::make('password'),
                'role' => 'student',
            ]);

            $students[] = Student::create([
                'user_id' => $user->id,
                'phone' => '05' . rand(10000000, 99999999),
                'address' => 'Student District, House ' . ($i + 1),
                'enrollment_year' => 2024,
                'status' => 'active',
            ]);
        }

        // 4. Enrollments & Payments
        foreach ($students as $index => $student) {
            // Enroll in 1-4 random courses
            $enrolledCourses = (array) array_rand($courses, rand(1, 4));
            if (!is_array($enrolledCourses)) $enrolledCourses = [$enrolledCourses];

            foreach ($enrolledCourses as $courseIdx) {
                $course = $courses[$courseIdx];
                
                Enrollment::create([
                    'student_id' => $student->id,
                    'course_id' => $course->id,
                    'enrolled_at' => now()->subDays(rand(1, 60)),
                    'status' => 'active',
                ]);

                Payment::create([
                    'student_id' => $student->id,
                    'course_id' => $course->id,
                    'amount' => $course->price,
                    'method' => collect(['cash', 'card', 'bank_transfer'])->random(),
                    'status' => 'paid',
                    'paid_at' => now()->subDays(rand(1, 50)),
                    'transaction_id' => 'TRX-' . Str::upper(Str::random(10)),
                ]);

                // 5. Add Stats for first 10 students
                if ($index < 10) {
                    // Attendance
                    for ($d = 0; $d < 5; $d++) {
                        Attendance::create([
                            'student_id' => $student->id,
                            'course_id' => $course->id,
                            'date' => now()->subDays($d * 7),
                            'status' => collect(['present', 'present', 'present', 'absent'])->random(),
                        ]);
                    }

                    // Grades
                    Grade::create([
                        'student_id' => $student->id,
                        'course_id' => $course->id,
                        'attendance_score' => rand(80, 100),
                        'assignment_score' => rand(70, 95),
                        'quiz_score' => rand(15, 20),
                        'midterm_score' => rand(20, 30),
                        'final_score' => rand(30, 50),
                        'grade_status' => 'pass',
                    ]);

                    // Certificates (only for 1st course they enrolled in for simplicity)
                    if ($courseIdx === $enrolledCourses[0]) {
                        Certificate::create([
                            'student_id' => $student->id,
                            'course_id' => $course->id,
                            'percentage' => rand(85, 98),
                            'grade' => collect(['A', 'A+', 'B+'])->random(),
                            'issued_at' => now()->subDays(2),
                        ]);
                    }
                }
            }
        }
    }
}
