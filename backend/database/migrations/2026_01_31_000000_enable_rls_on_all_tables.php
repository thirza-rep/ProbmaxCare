<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tables = [
            'migrations',
            'roles',
            'users',
            'password_reset_tokens',
            'failed_jobs',
            'personal_access_tokens',
            'consultant_schedules',
            'daily_feedback',
            'user_feedback',
            'appointments',
        ];

        foreach ($tables as $table) {
            DB::statement("ALTER TABLE \"public\".\"$table\" ENABLE ROW LEVEL SECURITY;");
            // By default, enabling RLS without policies denies all access to non-owners.
            // Laravel connects via the 'postgres' superuser/role which bypasses RLS.
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = [
            'migrations',
            'roles',
            'users',
            'password_reset_tokens',
            'failed_jobs',
            'personal_access_tokens',
            'consultant_schedules',
            'daily_feedback',
            'user_feedback',
            'appointments',
        ];

        foreach ($tables as $table) {
            DB::statement("ALTER TABLE \"public\".\"$table\" DISABLE ROW LEVEL SECURITY;");
        }
    }
};
