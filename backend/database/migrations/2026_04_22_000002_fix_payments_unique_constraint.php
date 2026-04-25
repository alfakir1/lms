<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Fix payments unique constraint.
 *
 * The original payments table had UNIQUE(user_id, course_id) which blocks
 * re-payment after rejection. We remove this constraint here.
 *
 * MySQL quirk: Cannot drop a unique index whose first column is also used by
 * a FOREIGN KEY constraint (even though they are separate). The workaround is:
 *   1. Drop the FK
 *   2. Drop the unique index
 *   3. Re-create the FK (without the unique index)
 */
return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            return; // SQLite does not support these ALTER constructs natively
        }

        // 1. Drop the FK that blocks index removal
        DB::statement('ALTER TABLE payments DROP FOREIGN KEY payments_user_id_foreign');

        // 2. Drop the multi-column unique index
        $indexExists = collect(DB::select("SHOW INDEX FROM payments WHERE Key_name = 'payments_user_id_course_id_unique'"))->isNotEmpty();
        if ($indexExists) {
            DB::statement('ALTER TABLE payments DROP INDEX payments_user_id_course_id_unique');
        }

        // 3. Re-create the user_id FK using a plain (non-unique) index 
        //    MySQL will auto-create it if no supporting index exists
        DB::statement('ALTER TABLE payments ADD CONSTRAINT payments_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            return;
        }

        // Drop FK before restoring index
        DB::statement('ALTER TABLE payments DROP FOREIGN KEY payments_user_id_foreign');

        // Re-add the unique constraint
        $indexExists = collect(DB::select("SHOW INDEX FROM payments WHERE Key_name = 'payments_user_id_course_id_unique'"))->isNotEmpty();
        if (! $indexExists) {
            DB::statement('ALTER TABLE payments ADD UNIQUE INDEX payments_user_id_course_id_unique (user_id, course_id)');
        }

        // Restore FK
        DB::statement('ALTER TABLE payments ADD CONSTRAINT payments_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');
    }
};
