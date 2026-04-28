<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->integer('attendance_score')->default(0);
            $table->integer('assignment_score')->default(0);
            $table->integer('quiz_score')->default(0);
            $table->integer('midterm_score')->default(0);
            $table->integer('final_score')->default(0);
            $table->integer('total_score')->default(0);
            $table->enum('grade_status', ['pass', 'fail'])->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'course_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
