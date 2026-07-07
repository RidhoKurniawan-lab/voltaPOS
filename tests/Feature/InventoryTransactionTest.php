<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\Supplier;
use App\Models\User;
use App\Services\PurchaseService;
use App\Services\SaleService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InventoryTransactionTest extends TestCase
{
    use RefreshDatabase;

    public function test_sale_reduces_product_stock_and_creates_details(): void
    {
        $user = User::factory()->create(['role' => 'petugas']);
        $product = Product::factory()->for(Category::factory())->create([
            'stock' => 10,
            'price_sell' => 15000,
        ]);

        $this->actingAs($user);

        $sale = app(SaleService::class)->store([
            'invoice_number' => 'INV-20260702-0001',
            'total_price' => 30000,
            'money_received' => 50000,
            'money_change' => 20000,
        ], [[
            'product_id' => $product->id,
            'quantity' => 2,
            'price' => 15000,
        ]]);

        $this->assertDatabaseHas('sales', [
            'id' => $sale->id,
            'invoice_number' => 'INV-20260702-0001',
        ]);

        $this->assertDatabaseHas('sale_details', [
            'sale_id' => $sale->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'subtotal' => 30000,
        ]);

        $this->assertSame('8', (string) $product->fresh()->stock);
    }

    public function test_deleting_sale_restores_product_stock(): void
    {
        $user = User::factory()->create(['role' => 'petugas']);
        $product = Product::factory()->for(Category::factory())->create([
            'stock' => 10,
            'price_sell' => 15000,
        ]);

        $this->actingAs($user);

        $sale = app(SaleService::class)->store([
            'invoice_number' => 'INV-20260702-0002',
            'total_price' => 45000,
            'money_received' => 50000,
            'money_change' => 5000,
        ], [[
            'product_id' => $product->id,
            'quantity' => 3,
            'price' => 15000,
        ]]);

        app(SaleService::class)->destroy($sale->load('details'));

        $this->assertDatabaseMissing('sales', ['id' => $sale->id]);
        $this->assertDatabaseMissing('sale_details', ['sale_id' => $sale->id]);
        $this->assertSame('10', (string) $product->fresh()->stock);
    }

    public function test_purchase_increases_product_stock(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        $supplier = Supplier::factory()->create();
        $product = Product::factory()->for(Category::factory())->create([
            'stock' => 5,
            'price_buy' => 12000,
        ]);

        $this->actingAs($user);

        $purchase = app(PurchaseService::class)->store([
            'supplier_id' => $supplier->id,
            'invoice_number' => 'PO-20260702-0001',
            'total_price' => 48000,
            'date' => now(),
        ], [[
            'product_id' => $product->id,
            'quantity' => 4,
            'price' => 12000,
        ]]);

        $this->assertDatabaseHas('purchases', [
            'id' => $purchase->id,
            'invoice_number' => 'PO-20260702-0001',
        ]);

        $this->assertDatabaseHas('purchase_details', [
            'purchase_id' => $purchase->id,
            'product_id' => $product->id,
            'quantity' => 4,
            'subtotal' => 48000,
        ]);

        $this->assertSame('9', (string) $product->fresh()->stock);
    }

    public function test_updating_purchase_recalculates_product_stock(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        $supplier = Supplier::factory()->create();
        $product = Product::factory()->for(Category::factory())->create([
            'stock' => 5,
            'price_buy' => 10000,
        ]);

        $service = app(PurchaseService::class);

        $this->actingAs($user);

        $purchase = $service->store([
            'supplier_id' => $supplier->id,
            'invoice_number' => 'PO-20260702-0002',
            'total_price' => 20000,
            'date' => now(),
        ], [[
            'product_id' => $product->id,
            'quantity' => 2,
            'price' => 10000,
        ]]);

        $purchase = Purchase::with('details')->findOrFail($purchase->id);

        $service->update($purchase, [
            'supplier_id' => $supplier->id,
            'invoice_number' => 'PO-20260702-0002',
            'total_price' => 40000,
            'date' => now(),
        ], [[
            'product_id' => $product->id,
            'quantity' => 4,
            'price' => 10000,
        ]]);

        $this->assertSame('9', (string) $product->fresh()->stock);
        $this->assertDatabaseHas('purchase_details', [
            'purchase_id' => $purchase->id,
            'product_id' => $product->id,
            'quantity' => 4,
            'subtotal' => 40000,
        ]);
    }

    public function test_category_with_products_cannot_be_deleted(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        $category = Category::factory()->create();
        $product = Product::factory()->for($category)->create();

        $response = $this->actingAs($user)->delete(route('categories.destroy', $category));

        $response->assertRedirect(route('categories.index'));
        $response->assertSessionHas('error');
        $this->assertDatabaseHas('categories', ['id' => $category->id]);
        $this->assertDatabaseHas('products', ['id' => $product->id]);
    }
}
