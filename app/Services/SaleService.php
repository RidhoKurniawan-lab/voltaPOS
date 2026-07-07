<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleDetail;
use Illuminate\Support\Facades\DB;

class SaleService
{
    /**
     * Simpan sale beserta detail dan kurangi stok produk.
     * Seluruh proses dibungkus dalam DB::transaction agar atomic.
     *
     * @param array $data Data induk sale (invoice_number, total_price, money_received, money_change)
     * @param array $items Array of items [{product_id, quantity, price, subtotal}]
     * @return Sale
     */
    public function store(array $data, array $items): Sale
    {
        return DB::transaction(function () use ($data, $items) {
            // 1. Simpan data induk sale
            $sale = Sale::create([
                'user_id'        => auth()->id(),
                'invoice_number' => $data['invoice_number'],
                'total_price'    => $data['total_price'],
                'money_received' => $data['money_received'],
                'money_change'   => $data['money_change'],
            ]);

            // 2. Loop setiap item: cek stok, simpan detail & kurangi stok
            foreach ($items as $item) {
                $product = Product::lockForUpdate()->find($item['product_id']);

                if (!$product) {
                    throw new \RuntimeException("Produk tidak ditemukan.");
                }

                if ($product->stock < $item['quantity']) {
                    throw new \RuntimeException(
                        "Stok produk \"{$product->name}\" tidak mencukupi. Tersedia: {$product->stock}, diminta: {$item['quantity']}."
                    );
                }

                SaleDetail::create([
                    'sale_id'    => $sale->id,
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'price'      => $item['price'],
                    'subtotal'   => $item['quantity'] * $item['price'],
                ]);

                $product->decrement('stock', $item['quantity']);
            }

            return $sale;
        });
    }

    /**
     * Hapus sale dan kembalikan stok produk.
     *
     * @param Sale $sale
     * @return void
     */
    public function destroy(Sale $sale): void
    {
        DB::transaction(function () use ($sale) {
            foreach ($sale->details as $detail) {
                Product::where('id', $detail->product_id)
                    ->increment('stock', $detail->quantity);
            }

            $sale->details()->delete();
            $sale->delete();
        });
    }
}
