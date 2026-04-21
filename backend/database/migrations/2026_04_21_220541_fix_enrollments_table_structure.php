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
        Schema::table('enrollments', function (Blueprint $table) {
            // Rename student_id to user_id
            $table->renameColumn('student_id', 'user_id');
            // Change foreign key from students to users
            $table->dropForeign(['student_id']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Add unique constraint
            $table->unique(['user_id', 'course_id'], 'enrollments_user_course_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            $table->dropUnique('enrollments_user_course_unique');
            $table->dropForeign(['user_id']);
            $table->renameColumn('user_id', 'student_id');
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
        });
    }
};
