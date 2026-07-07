<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['sometimes', 'required', 'integer', 'exists:categories,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'price_buy' => ['sometimes', 'required', 'numeric', 'min:0'],
            'price_sell' => ['sometimes', 'required', 'numeric', 'min:0', 'gte:price_buy'],
            'description' => ['sometimes', 'nullable', 'string'],
            // stock optional saat update
            'stock' => ['sometimes', 'nullable', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Kategori wajib dipilih.',
            'category_id.integer' => 'Kategori tidak valid.',
            'category_id.exists' => 'Kategori tidak ditemukan.',

            'name.required' => 'Nama produk wajib diisi.',
            'name.string' => 'Nama produk harus berupa teks.',
            'name.max' => 'Nama produk maksimal 255 karakter.',

            'price_buy.required' => 'Harga beli wajib diisi.',
            'price_buy.numeric' => 'Harga beli harus berupa angka.',
            'price_buy.min' => 'Harga beli tidak boleh kurang dari 0.',

            'price_sell.required' => 'Harga jual wajib diisi.',
            'price_sell.numeric' => 'Harga jual harus berupa angka.',
            'price_sell.min' => 'Harga jual tidak boleh kurang dari 0.',
            'price_sell.gte' => 'Harga jual harus lebih besar atau sama dengan harga beli.',

            'stock.min' => 'Stok tidak boleh kurang dari 0.',

            'description.string' => 'Deskripsi harus berupa teks.',
        ];
    }

    public function attributes(): array
    {
        return [
            'category_id' => 'kategori',
            'name' => 'nama produk',
            'price_buy' => 'harga beli',
            'price_sell' => 'harga jual',
            'stock' => 'stok',
            'description' => 'deskripsi',
        ];
    }
}
