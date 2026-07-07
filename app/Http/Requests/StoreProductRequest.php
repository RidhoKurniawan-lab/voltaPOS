<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
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
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'price_buy' => ['required', 'numeric', 'min:0'],
            'price_sell' => ['required', 'numeric', 'min:0', 'gte:price_buy'],
            'description' => ['sometimes', 'nullable', 'string'],

        ];
    }

    /**
     * Custom validation messages.
     */
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

            'description.string' => 'Deskripsi harus berupa teks.',
        ];
    }

    /**
     * Custom attribute names.
     */
    public function attributes(): array
    {
        return [
            'category_id' => 'kategori',
            'name' => 'nama produk',
            'price_buy' => 'harga beli',
            'price_sell' => 'harga jual',
            'description' => 'deskripsi',
        ];
    }
}
