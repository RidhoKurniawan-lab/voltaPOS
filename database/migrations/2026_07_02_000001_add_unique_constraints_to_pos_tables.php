<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->unique('name');
            $table->unique('slug');
        });

        Schema::table('suppliers', function (Blueprint $table) {
            $table->unique('name');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->unique('sku');
        });

        Schema::table('sales', function (Blueprint $table) {
            $table->unique('invoice_number');
        });

        Schema::table('purchases', function (Blueprint $table) {
            $table->unique('invoice_number');
        });
    }

    public function down(): void
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->dropUnique(['invoice_number']);
        });

        Schema::table('sales', function (Blueprint $table) {
            $table->dropUnique(['invoice_number']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropUnique(['sku']);
        });

        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropUnique(['name']);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropUnique(['name']);
            $table->dropUnique(['slug']);
        });
    }
};
