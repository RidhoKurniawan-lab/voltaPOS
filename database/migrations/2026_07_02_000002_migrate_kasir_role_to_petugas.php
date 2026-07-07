<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('users')
            ->where('role', 'kasir')
            ->update(['role' => 'petugas']);
    }

    public function down(): void
    {
        DB::table('users')
            ->where('role', 'petugas')
            ->update(['role' => 'kasir']);
    }
};
