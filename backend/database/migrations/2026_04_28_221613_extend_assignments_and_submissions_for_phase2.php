<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('assignments', function (Blueprint $table) {
            if (!Schema::hasColumn('assignments', 'max_grade')) {
                $table->integer('max_grade')->default(100)->after('deadline');
            }
            if (!Schema::hasColumn('assignments', 'lesson_id')) {
                $table->foreignId('lesson_id')->nullable()->constrained()->onDelete('set null')->after('course_id');
            }
        });

        Schema::table('submissions', function (Blueprint $table) {
            if (!Schema::hasColumn('submissions', 'content')) {
                $table->text('content')->nullable()->after('file_url');
            }
            if (!Schema::hasColumn('submissions', 'submitted_at')) {
                $table->timestamp('submitted_at')->nullable()->after('content');
            }
        });
    }

    public function down()
    {
        Schema::table('assignments', function (Blueprint $table) {
            $table->dropColumn(['max_grade', 'lesson_id']);
        });
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropColumn(['content', 'submitted_at']);
        });
    }
};
