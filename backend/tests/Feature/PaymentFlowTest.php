<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use App\Infrastructure\Persistence\Models\User;
use App\Infrastructure\Persistence\Models\Course;
use App\Infrastructure\Persistence\Models\Payment;
use App\Infrastructure\Persistence\Models\Enrollment;
use App\Infrastructure\Persistence\Models\Instructor;
use Illuminate\Support\Facades\Event;
use App\Application\Events\PaymentApproved;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class PaymentFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_student_can_create_payment_request(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        $instructorUser = User::factory()->create(['role' => 'instructor']);
        $instructor = Instructor::create(['user_id' => $instructorUser->id, 'status' => 'active']);
        
        $course = Course::create([
            'title' => 'Test Course',
            'slug' => 'test-course-' . \Illuminate\Support\Str::random(5),
            'price' => 100,
            'status' => 'published',
            'instructor_id' => $instructor->id
        ]);

        $response = $this->actingAs($student)
            ->postJson('/api/v1/payments', [
                'course_id' => $course->id,
                'amount' => 100,
                'proof_file' => UploadedFile::fake()->create('proof.pdf', 100)
            ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'status',
            'data' => ['id', 'reference_code', 'proof_image'],
            'message'
        ]);

        $this->assertDatabaseHas('payments', [
            'user_id' => $student->id,
            'course_id' => $course->id,
            'status' => 'pending'
        ]);
        
        $payment = Payment::first();
        $this->assertNotNull($payment->reference_code);
        $this->assertStringStartsWith('PAY-', $payment->reference_code);
    }

    public function test_admin_can_approve_payment_and_creates_enrollment(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $student = User::factory()->create(['role' => 'student']);
        $instructorUser = User::factory()->create(['role' => 'instructor']);
        $instructor = Instructor::create(['user_id' => $instructorUser->id, 'status' => 'active']);
        
        $course = Course::create([
            'title' => 'Test Course Approval',
            'slug' => 'test-course-approval-' . \Illuminate\Support\Str::random(5),
            'instructor_id' => $instructor->id
        ]);
        
        $payment = Payment::create([
            'user_id' => $student->id,
            'course_id' => $course->id,
            'amount' => 100,
            'status' => 'pending',
            'reference_code' => 'PAY-TEST123'
        ]);

        $response = $this->actingAs($admin)
            ->postJson("/api/v1/admin/payments/{$payment->id}/approve");

        $response->assertStatus(200);
        
        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'approved',
            'reviewed_by' => $admin->id
        ]);

        $this->assertDatabaseHas('enrollments', [
            'user_id' => $student->id,
            'course_id' => $course->id,
            'status' => 'active'
        ]);
    }

    public function test_unauthorized_user_cannot_approve_payment(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        $otherStudent = User::factory()->create(['role' => 'student']);
        $instructorUser = User::factory()->create(['role' => 'instructor']);
        $instructor = Instructor::create(['user_id' => $instructorUser->id, 'status' => 'active']);
        
        $course = Course::create([
            'title' => 'Test Course Unauthorized',
            'slug' => 'test-course-unauth-' . \Illuminate\Support\Str::random(5),
            'instructor_id' => $instructor->id
        ]);
        
        $payment = Payment::create([
            'user_id' => $student->id,
            'course_id' => $course->id,
            'amount' => 100,
            'status' => 'pending',
            'reference_code' => 'PAY-TEST456'
        ]);

        $response = $this->actingAs($otherStudent)
            ->postJson("/api/v1/admin/payments/{$payment->id}/approve");

        $response->assertStatus(403);
    }

    public function test_concurrent_payment_approvals_do_not_duplicate_enrollment(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $student = User::factory()->create(['role' => 'student']);
        \App\Infrastructure\Persistence\Models\Student::create(['user_id' => $student->id, 'status' => 'active']);
        $instructorUser = User::factory()->create(['role' => 'instructor']);
        $instructor = Instructor::create(['user_id' => $instructorUser->id, 'status' => 'active']);
        
        $course = Course::create([
            'title' => 'Test Course Concurrency',
            'slug' => 'test-course-concurr-' . \Illuminate\Support\Str::random(5),
            'instructor_id' => $instructor->id
        ]);
        
        $payment = Payment::create([
            'user_id' => $student->id,
            'course_id' => $course->id,
            'amount' => 100,
            'status' => 'pending',
            'reference_code' => 'PAY-CONCUR'
        ]);

        // Manually trigger the listener multiple times to simulate race condition safety
        $event = new PaymentApproved($payment);
        $listener = new \App\Infrastructure\Listeners\CreateEnrollmentListener();
        
        $listener->handle($event);
        $listener->handle($event);
        $listener->handle($event);

        $this->assertEquals(1, Enrollment::where('user_id', $student->id)->where('course_id', $course->id)->count());
    }

    public function test_approve_already_approved_payment_is_idempotent(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $student = User::factory()->create(['role' => 'student']);
        $instructorUser = User::factory()->create(['role' => 'instructor']);
        $instructor = Instructor::create(['user_id' => $instructorUser->id, 'status' => 'active']);
        
        $course = Course::create([
            'title' => 'Test Course Idempotent',
            'slug' => 'test-course-idempotent-' . \Illuminate\Support\Str::random(5),
            'instructor_id' => $instructor->id
        ]);
        
        $payment = Payment::create([
            'user_id' => $student->id,
            'course_id' => $course->id,
            'amount' => 100,
            'status' => 'approved', // already approved
            'reference_code' => 'PAY-IDEMPO'
        ]);

        $response = $this->actingAs($admin)
            ->postJson("/api/v1/admin/payments/{$payment->id}/approve");

        $response->assertStatus(400);
        $response->assertJsonFragment(['message' => 'Payment is already approved.']);
    }

    public function test_cannot_approve_rejected_payment(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $student = User::factory()->create(['role' => 'student']);
        $instructorUser = User::factory()->create(['role' => 'instructor']);
        $instructor = Instructor::create(['user_id' => $instructorUser->id, 'status' => 'active']);
        
        $course = Course::create([
            'title' => 'Test Course Rejected',
            'slug' => 'test-course-rejected-' . \Illuminate\Support\Str::random(5),
            'instructor_id' => $instructor->id
        ]);
        
        $payment = Payment::create([
            'user_id' => $student->id,
            'course_id' => $course->id,
            'amount' => 100,
            'status' => 'rejected', // rejected status
            'reference_code' => 'PAY-REJECTED'
        ]);

        $response = $this->actingAs($admin)
            ->postJson("/api/v1/admin/payments/{$payment->id}/approve");

        $response->assertStatus(400);
        $response->assertJsonFragment(['message' => 'Invalid payment state']);
    }
}
