<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('role');
        });

        Schema::table('courses', function (Blueprint $table) {
            $table->integer('duration_days')->nullable()->after('end_date');
            $table->integer('min_students')->default(0)->after('duration_days');
            $table->integer('max_students')->nullable()->after('min_students');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_active');
        });

        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn(['duration_days', 'min_students', 'max_students']);
        });
    }
};
