<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseDetail;
use Illuminate\Support\Facades\DB;

class PurchaseService
{
    /**
     * Simpan purchase beserta detail dan update stok produk.
     * Seluruh proses dibungkus dalam DB::transaction agar atomic.
     *
     * @param array $data Data induk purchase (supplier_id, invoice_number, total_price)
     * @param array $items Array of items [{product_id, quantity, price, subtotal}]
     * @return Purchase
     */
    public function store(array $data, array $items): Purchase
    {
        return DB::transaction(function () use ($data, $items) {
            // 1. Simpan data induk purchase
            $purchase = Purchase::create([
                'supplier_id'    => $data['supplier_id'],
                'user_id'        => auth()->id(),
                'invoice_number' => $data['invoice_number'],
                'total_price'    => $data['total_price'],
                'created_at'     => $data['date'] ?? now(),
                'updated_at'     => $data['date'] ?? now(),
            ]);

            // 2. Loop setiap item: simpan detail & update stok
            foreach ($items as $item) {
                PurchaseDetail::create([
                    'purchase_id' => $purchase->id,
                    'product_id'  => $item['product_id'],
                    'quantity'    => $item['quantity'],
                    'price'       => $item['price'],
                    'subtotal'    => $item['quantity'] * $item['price'],
                ]);

                // 3. Increment stok produk
                Product::where('id', $item['product_id'])
                    ->increment('stock', $item['quantity']);
            }

            return $purchase;
        });
    }

    /**
     * Update purchase beserta detail dan sesuaikan stok produk.
     *
     * @param Purchase $purchase Instansi purchase yang akan diperbarui
     * @param array $data Data induk purchase
     * @param array $items Array of items [{product_id, quantity, price}]
     * @return Purchase
     */
    public function update(Purchase $purchase, array $data, array $items): Purchase
    {
        return DB::transaction(function () use ($purchase, $data, $items) {
            // 1. Kurangi stok produk berdasarkan detail pembelian lama
            foreach ($purchase->details as $oldDetail) {
                Product::where('id', $oldDetail->product_id)
                    ->decrement('stock', $oldDetail->quantity);
            }

            // 2. Hapus detail lama
            $purchase->details()->delete();

            // 3. Perbarui purchase induk (withoutTimestamps agar created_at bisa diset manual)
            $purchase->withoutTimestamps(fn () => $purchase->update([
                'supplier_id'    => $data['supplier_id'],
                'invoice_number' => $data['invoice_number'],
                'total_price'    => $data['total_price'],
                'created_at'     => $data['date'] ?? $purchase->created_at,
                'updated_at'     => now(),
            ]));

            // 4. Buat detail baru & tambahkan stok produk baru
            foreach ($items as $item) {
                PurchaseDetail::create([
                    'purchase_id' => $purchase->id,
                    'product_id'  => $item['product_id'],
                    'quantity'    => $item['quantity'],
                    'price'       => $item['price'],
                    'subtotal'    => $item['quantity'] * $item['price'],
                ]);

                Product::where('id', $item['product_id'])
                    ->increment('stock', $item['quantity']);
            }

            return $purchase;
        });
    }

    /**
     * Hapus purchase dan kembalikan stok produk.
     *
     * @param Purchase $purchase
     * @return void
     */
    public function destroy(Purchase $purchase): void
    {
        DB::transaction(function () use ($purchase) {
            // 1. Kurangi stok produk berdasarkan detail pembelian
            foreach ($purchase->details as $detail) {
                Product::where('id', $detail->product_id)
                    ->decrement('stock', $detail->quantity);
            }

            // 2. Detail akan otomatis terhapus karena foreign key constraint cascadeOnDelete
            // Namun kita hapus manual untuk keamanan
            $purchase->details()->delete();

            // 3. Hapus purchase
            $purchase->delete();
        });
    }
}
