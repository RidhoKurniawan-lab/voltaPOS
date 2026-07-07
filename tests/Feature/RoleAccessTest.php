<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_petugas_gets_403_for_admin_only_modules(): void
    {
        $petugas = User::factory()->create(['role' => 'petugas']);

        $this->actingAs($petugas)->get(route('products.index'))->assertForbidden();
        $this->actingAs($petugas)->get(route('categories.index'))->assertForbidden();
        $this->actingAs($petugas)->get(route('suppliers.index'))->assertForbidden();
        $this->actingAs($petugas)->get(route('purchases.index'))->assertForbidden();
        $this->actingAs($petugas)->get(route('reports.index'))->assertForbidden();
        $this->actingAs($petugas)->get(route('register'))->assertForbidden();
    }

    public function test_admin_can_access_admin_modules(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->get(route('products.index'))->assertOk();
        $this->actingAs($admin)->get(route('categories.index'))->assertOk();
        $this->actingAs($admin)->get(route('suppliers.index'))->assertOk();
        $this->actingAs($admin)->get(route('purchases.index'))->assertOk();
        $this->actingAs($admin)->get(route('reports.index'))->assertOk();
        $this->actingAs($admin)->get(route('register'))->assertOk();
    }

    public function test_petugas_can_access_dashboard_and_sales_routes(): void
    {
        $petugas = User::factory()->create(['role' => 'petugas']);

        $this->actingAs($petugas)->get(route('dashboard'))->assertOk();
        $this->actingAs($petugas)->get(route('sales.index'))->assertOk();
        $this->actingAs($petugas)->get(route('sales.create'))->assertOk();
    }

    public function test_petugas_dashboard_does_not_expose_admin_only_summary_keys(): void
    {
        $petugas = User::factory()->create(['role' => 'petugas']);

        $response = $this->actingAs($petugas)->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard/Index')
            ->where('dashboard_type', 'petugas')
            ->has('summary')
            ->where('summary.my_total_transactions_today', 0)
            ->where('summary.my_total_sales_today', 0)
            ->missing('summary.total_products')
            ->missing('summary.total_suppliers')
            ->missing('summary.today_sales_revenue')
            ->missing('summary.today_purchase_expense')
            ->missing('chart')
            ->missing('low_stock_products')
            ->missing('recent_activities')
        );
    }

    public function test_petugas_cannot_delete_sales_or_purchases(): void
    {
        $petugas = User::factory()->create(['role' => 'petugas']);
        $admin = User::factory()->create(['role' => 'admin']);
        $supplier = Supplier::factory()->create();

        $sale = Sale::create([
            'user_id' => $admin->id,
            'invoice_number' => 'INV-DELETE-0001',
            'total_price' => 15000,
            'money_received' => 20000,
            'money_change' => 5000,
        ]);

        $purchase = Purchase::create([
            'supplier_id' => $supplier->id,
            'user_id' => $admin->id,
            'invoice_number' => 'PO-DELETE-0001',
            'total_price' => 25000,
        ]);

        $this->actingAs($petugas)->delete(route('sales.destroy', $sale))->assertForbidden();
        $this->actingAs($petugas)->delete(route('purchases.destroy', $purchase))->assertForbidden();
    }

    public function test_petugas_only_sees_their_own_sales_history(): void
    {
        $petugas = User::factory()->create(['role' => 'petugas']);
        $otherPetugas = User::factory()->create(['role' => 'petugas']);
        $category = Category::factory()->create();
        $product = Product::factory()->for($category)->create();

        $mySale = Sale::create([
            'user_id' => $petugas->id,
            'invoice_number' => 'INV-MINE-0001',
            'total_price' => 15000,
            'money_received' => 20000,
            'money_change' => 5000,
        ]);

        $otherSale = Sale::create([
            'user_id' => $otherPetugas->id,
            'invoice_number' => 'INV-OTHER-0001',
            'total_price' => 18000,
            'money_received' => 20000,
            'money_change' => 2000,
        ]);

        $response = $this->actingAs($petugas)->get(route('sales.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Sales/Index')
            ->has('sales.data', 1)
            ->where('sales.data.0.id', $mySale->id)
            ->where('sales.data.0.invoice_number', 'INV-MINE-0001')
        );
    }
}
