<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update payments table
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['enrollment_id']);
            $table->dropColumn('enrollment_id');
            
            $table->foreignId('student_id')->after('id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('course_id')->after('student_id')->constrained('courses')->cascadeOnDelete();
            
            $table->string('status')->default('pending')->change(); // Change to string for more flexibility or enum
        });

        // Create outbox_events table
        Schema::create('outbox_events', function (Blueprint $table) {
            $table->id();
            $table->string('event_type');
            $table->json('payload');
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('outbox_events');

        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['student_id']);
            $table->dropForeign(['course_id']);
            $table->dropColumn(['student_id', 'course_id']);
            
            $table->foreignId('enrollment_id')->constrained('enrollments')->cascadeOnDelete();
        });
    }
};
