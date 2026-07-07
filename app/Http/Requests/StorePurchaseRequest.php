<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePurchaseRequest extends FormRequest
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
            'supplier_id'          => ['required', 'integer', 'exists:suppliers,id'],
            'invoice_number'       => ['required', 'string', 'max:255', 'unique:purchases,invoice_number'],
            'date'                 => ['required', 'date'],
            'items'                => ['required', 'array', 'min:1'],
            'items.*.product_id'   => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity'     => ['required', 'numeric', 'gt:0'],
            'items.*.price'        => ['required', 'numeric', 'gt:0'],
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'supplier_id.required'        => 'Supplier wajib dipilih.',
            'supplier_id.integer'         => 'Supplier tidak valid.',
            'supplier_id.exists'          => 'Supplier tidak ditemukan.',

            'invoice_number.required'     => 'Nomor invoice wajib diisi.',
            'invoice_number.string'       => 'Nomor invoice harus berupa teks.',
            'invoice_number.max'          => 'Nomor invoice maksimal 255 karakter.',
            'invoice_number.unique'       => 'Nomor invoice sudah pernah digunakan.',

            'date.required'               => 'Tanggal pembelian wajib diisi.',
            'date.date'                   => 'Format tanggal tidak valid.',

            'items.required'              => 'Daftar produk wajib diisi minimal 1 item.',
            'items.array'                 => 'Format daftar produk tidak valid.',
            'items.min'                   => 'Minimal harus ada 1 item produk.',

            'items.*.product_id.required' => 'Produk pada baris :position wajib dipilih.',
            'items.*.product_id.integer'  => 'Produk pada baris :position tidak valid.',
            'items.*.product_id.exists'   => 'Produk pada baris :position tidak ditemukan.',

            'items.*.quantity.required'   => 'Jumlah pada baris :position wajib diisi.',
            'items.*.quantity.numeric'    => 'Jumlah pada baris :position harus berupa angka.',
            'items.*.quantity.gt'         => 'Jumlah pada baris :position harus lebih dari 0.',

            'items.*.price.required'      => 'Harga beli pada baris :position wajib diisi.',
            'items.*.price.numeric'       => 'Harga beli pada baris :position harus berupa angka.',
            'items.*.price.gt'            => 'Harga beli pada baris :position harus lebih dari 0.',
        ];
    }

    /**
     * Custom attribute names.
     */
    public function attributes(): array
    {
        return [
            'supplier_id'        => 'supplier',
            'invoice_number'     => 'nomor invoice',
            'date'               => 'tanggal',
            'items'              => 'daftar produk',
            'items.*.product_id' => 'produk',
            'items.*.quantity'   => 'jumlah',
            'items.*.price'      => 'harga beli',
        ];
    }
}
