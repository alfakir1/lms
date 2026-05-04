<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('profile_image')->nullable()->after('password');
            $table->string('linkedin_url')->nullable()->after('profile_image');
            $table->string('theme')->default('light')->after('linkedin_url');
            $table->string('language')->default('ar')->after('theme');
            $table->boolean('notifications_enabled')->default(true)->after('language');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['profile_image', 'linkedin_url', 'theme', 'language', 'notifications_enabled']);
        });
    }
};
