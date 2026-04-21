<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Fix payments table unique constraint.
 *
 * The original payments table had UNIQUE(user_id, course_id) which blocks
 * students from submitting a new payment after their previous one was rejected.
 * This migration removes that constraint. The reference_code column already
 * has its own unique constraint, which is sufficient.
 *
 * Duplicate payment prevention is handled at the application level in
 * CreatePaymentRequest::execute() by checking for existing 'pending' payments.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // Drop the restrictive unique constraint that blocked re-payments after rejection
            // The constraint name in MySQL for unique(['user_id','course_id']) is typically
            // 'payments_user_id_course_id_unique'
            try {
                $table->dropUnique(['user_id', 'course_id']);
            } catch (\Exception $e) {
                // Constraint may not exist if this is a fresh install
                \Illuminate\Support\Facades\Log::warning('payments user_course unique constraint not found, skipping drop.', ['error' => $e->getMessage()]);
            }
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // Restore the old constraint on rollback
            $table->unique(['user_id', 'course_id']);
        });
    }
};
