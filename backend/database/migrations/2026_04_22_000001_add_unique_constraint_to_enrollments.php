<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Add UNIQUE(user_id, course_id) constraint to enrollments table.
 * This enforces data integrity at the DB level preventing duplicate enrollments
 * even under concurrent requests (race conditions).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            $table->unique(['user_id', 'course_id'], 'enrollments_user_course_unique');
        });
    }

    public function down(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            $table->dropUnique('enrollments_user_course_unique');
        });
    }
};
