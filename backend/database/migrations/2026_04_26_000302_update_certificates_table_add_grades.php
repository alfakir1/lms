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
        Schema::table('certificates', function (Blueprint $table) {
            $table->dropColumn('file_url');
            $table->decimal('percentage', 5, 2)->after('course_id')->default(0);
            $table->string('grade', 2)->after('percentage')->nullable(); // A, B, C, D, F
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('certificates', function (Blueprint $table) {
            $table->string('file_url')->nullable();
            $table->dropColumn('percentage');
            $table->dropColumn('grade');
        });
    }
};
