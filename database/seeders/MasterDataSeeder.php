<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Database\Seeder;

class MasterDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buat Kategori dan Supplier
        $categories = Category::factory()->count(5)->create();
        Supplier::factory()->count(3)->create();

        // Buat Produk otomatis terikat ke kategori yang baru saja di-generate
        foreach ($categories as $category) {
            Product::factory()->count(4)->create([
                'category_id' => $category->id
            ]);
        }
    }
}
