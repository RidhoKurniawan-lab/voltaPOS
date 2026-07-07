<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSaleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'invoice_number'       => ['required', 'string', 'max:255', 'unique:sales,invoice_number'],
            'items'                => ['required', 'array', 'min:1'],
            'items.*.product_id'   => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity'     => ['required', 'numeric', 'gt:0'],
            'items.*.price'        => ['required', 'numeric', 'gt:0'],
            'money_received'       => ['required', 'numeric', 'gte:0'],
        ];
    }

    /**
     * Validasi tambahan: cek stok dan uang diterima.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $items = $this->input('items', []);

            $totalPrice = collect($items)->sum(function ($item) {
                return ($item['quantity'] ?? 0) * ($item['price'] ?? 0);
            });

            foreach ($items as $index => $item) {
                $product = Product::find($item['product_id'] ?? null);

                if ($product && ($item['quantity'] ?? 0) > $product->stock) {
                    $validator->errors()->add(
                        "items.{$index}.quantity",
                        "Stok produk \"{$product->name}\" tidak mencukupi. Tersedia: {$product->stock}."
                    );
                }
            }

            $moneyReceived = $this->input('money_received', 0);
            if ($moneyReceived < $totalPrice) {
                $validator->errors()->add(
                    'money_received',
                    'Uang diterima tidak boleh kurang dari total harga.'
                );
            }
        });
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'invoice_number.required'     => 'Nomor invoice wajib diisi.',
            'invoice_number.string'       => 'Nomor invoice harus berupa teks.',
            'invoice_number.max'          => 'Nomor invoice maksimal 255 karakter.',
            'invoice_number.unique'       => 'Nomor invoice sudah pernah digunakan.',

            'items.required'              => 'Daftar produk wajib diisi minimal 1 item.',
            'items.array'                 => 'Format daftar produk tidak valid.',
            'items.min'                   => 'Minimal harus ada 1 item produk.',

            'items.*.product_id.required' => 'Produk pada baris :position wajib dipilih.',
            'items.*.product_id.integer'  => 'Produk pada baris :position tidak valid.',
            'items.*.product_id.exists'   => 'Produk pada baris :position tidak ditemukan.',

            'items.*.quantity.required'   => 'Jumlah pada baris :position wajib diisi.',
            'items.*.quantity.numeric'    => 'Jumlah pada baris :position harus berupa angka.',
            'items.*.quantity.gt'         => 'Jumlah pada baris :position harus lebih dari 0.',

            'items.*.price.required'      => 'Harga jual pada baris :position wajib diisi.',
            'items.*.price.numeric'       => 'Harga jual pada baris :position harus berupa angka.',
            'items.*.price.gt'            => 'Harga jual pada baris :position harus lebih dari 0.',

            'money_received.required'     => 'Uang diterima wajib diisi.',
            'money_received.numeric'      => 'Uang diterima harus berupa angka.',
            'money_received.gte'          => 'Uang diterima tidak valid.',
        ];
    }

    /**
     * Custom attribute names.
     */
    public function attributes(): array
    {
        return [
            'invoice_number'     => 'nomor invoice',
            'items'              => 'daftar produk',
            'items.*.product_id' => 'produk',
            'items.*.quantity'   => 'jumlah',
            'items.*.price'      => 'harga jual',
            'money_received'     => 'uang diterima',
        ];
    }
}
