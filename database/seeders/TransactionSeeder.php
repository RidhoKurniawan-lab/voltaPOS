<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil data yang sudah di-generate oleh seeder sebelumnya
        $admin = User::where('role', 'admin')->first();
        $kasir = User::where('role', 'petugas')->first();
        $suppliers = Supplier::all();
        $products = Product::all();

        // Antisipasi jika data master kosong
        if ($products->isEmpty() || $suppliers->isEmpty()) {
            return;
        }

        // ==========================================
        // 1. GENERATE TRANSAKSI PEMBELIAN (RESTOCK)
        // ==========================================
        for ($i = 1; $i <= 5; $i++) {
            $purchase = Purchase::create([
                'supplier_id' => $suppliers->random()->id,
                'user_id' => $admin->id,
                'invoice_number' => 'INV-IN-' . date('Ymd') . sprintf('%03d', $i),
                'total_price' => 0,
            ]);

            $totalPurchase = 0;
            $sampledProducts = $products->random(rand(1, 3));

            foreach ($sampledProducts as $product) {
                $qty = rand(5, 15);
                $subtotal = $qty * $product->price_buy;
                $totalPurchase += $subtotal;

                $purchase->products()->attach($product->id, [
                    'quantity' => $qty,
                    'price' => $product->price_buy,
                    'subtotal' => $subtotal,
                ]);
            }
            $purchase->update(['total_price' => $totalPurchase]);
        }

        // ==========================================
        // 2. GENERATE TRANSAKSI PENJUALAN (KASIR)
        // ==========================================
        for ($j = 1; $j <= 15; $j++) {
            $user = rand(0, 1) ? $admin : $kasir;

            $sale = Sale::create([
                'user_id' => $user->id,
                'invoice_number' => 'INV-OUT-' . date('Ymd') . sprintf('%03d', $j),
                'total_price' => 0,
                'money_received' => 0,
                'money_change' => 0,
            ]);

            $totalSale = 0;
            $sampledProducts = $products->random(rand(1, 4));

            foreach ($sampledProducts as $product) {
                $qty = rand(1, 3);
                $subtotal = $qty * $product->price_sell;
                $totalSale += $subtotal;

                $sale->products()->attach($product->id, [
                    'quantity' => $qty,
                    'price' => $product->price_sell,
                    'subtotal' => $subtotal,
                ]);
            }

            $moneyReceived = ceil($totalSale / 50000) * 50000;
            if ($moneyReceived == $totalSale) {
                $moneyReceived += 50000;
            }
            $moneyChange = $moneyReceived - $totalSale;

            $sale->update([
                'total_price' => $totalSale,
                'money_received' => $moneyReceived,
                'money_change' => $moneyChange,
            ]);
        }
    }
}
