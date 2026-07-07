<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Set harga modal acak, lalu harga jual diset lebih tinggi agar untung
        $priceBuy = $this->faker->numberBetween(10, 50) * 1000; // Contoh: 15.000
        $priceSell = $priceBuy + ($this->faker->numberBetween(5, 15) * 1000); // Contoh: 25.000

        return [
            'category_id' => Category::factory(), // Otomatis bikin kategori kalau belum ada
            'name' => $this->faker->words(2, true),
            'sku' => 'PRD-' . $this->faker->unique()->numberBetween(10000, 99999),
            'price_buy' => $priceBuy,
            'price_sell' => $priceSell,
            'stock' => $this->faker->numberBetween(20, 100),
        ];
    }
}
