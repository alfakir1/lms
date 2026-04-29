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
        Schema::table('courses', function (Blueprint $table) {
            $table->foreignId('parent_id')->nullable()->constrained('courses')->onDelete('cascade')->after('id');
            $table->string('group_name')->nullable()->after('title');
            $table->foreignId('instructor_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropColumn(['parent_id', 'group_name']);
            $table->foreignId('instructor_id')->nullable(false)->change();
        });
    }
};
