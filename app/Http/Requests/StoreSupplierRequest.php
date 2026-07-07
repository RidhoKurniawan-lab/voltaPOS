<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:suppliers,name'],
            'phone' => ['required', 'string', 'max:15'],
            'address' => ['required', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama supplier wajib diisi.',
            'name.string' => 'Nama supplier harus berupa teks.',
            'name.max' => 'Nama supplier maksimal 255 karakter.',
            'name.unique' => 'Nama supplier sudah digunakan.',
            'phone.required' => 'Nomor telepon wajib diisi.',
            'phone.string' => 'Nomor telepon harus berupa teks.',
            'phone.max' => 'Nomor telepon maksimal 15 karakter.',
            'address.required' => 'Alamat wajib diisi.',
            'address.string' => 'Alamat harus berupa teks.',
            'address.max' => 'Alamat maksimal 255 karakter.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'nama supplier',
            'phone' => 'nomor telepon',
            'address' => 'alamat',
        ];
    }
}
