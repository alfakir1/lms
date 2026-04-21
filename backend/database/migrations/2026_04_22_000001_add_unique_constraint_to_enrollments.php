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
            // Drop any existing duplicate rows before adding constraint
            \Illuminate\Support\Facades\DB::statement('
                DELETE e1 FROM enrollments e1
                INNER JOIN enrollments e2
                WHERE e1.id > e2.id
                  AND e1.user_id = e2.user_id
                  AND e1.course_id = e2.course_id
            ');

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
