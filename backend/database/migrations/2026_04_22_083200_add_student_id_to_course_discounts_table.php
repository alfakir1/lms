<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('course_discounts')) {
            return;
        }

        // Add student_id column if missing (older DBs may have user_id)
        if (! Schema::hasColumn('course_discounts', 'student_id')) {
            Schema::table('course_discounts', function (Blueprint $table) {
                $table->foreignId('student_id')->nullable()->constrained('students')->nullOnDelete();
                $table->index(['course_id', 'student_id'], 'course_discounts_course_student_idx');
            });
        }

        // Best-effort backfill from user_id -> students.id (MySQL only; safe no-op elsewhere)
        if (DB::getDriverName() === 'mysql'
            && Schema::hasColumn('course_discounts', 'user_id')
            && Schema::hasColumn('course_discounts', 'student_id')
        ) {
            DB::statement("
                UPDATE course_discounts cd
                JOIN students s ON s.user_id = cd.user_id
                SET cd.student_id = s.id
                WHERE cd.user_id IS NOT NULL AND cd.student_id IS NULL
            ");
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('course_discounts')) {
            return;
        }

        if (Schema::hasColumn('course_discounts', 'student_id')) {
            Schema::table('course_discounts', function (Blueprint $table) {
                // Drop index + FK + column (best-effort)
                try { $table->dropIndex('course_discounts_course_student_idx'); } catch (\Throwable $e) {}
                try { $table->dropConstrainedForeignId('student_id'); } catch (\Throwable $e) {}
                try { $table->dropColumn('student_id'); } catch (\Throwable $e) {}
            });
        }
    }
};

