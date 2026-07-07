<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\Supplier;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getDashboardData(): array
    {
        $user = auth()->user();
        $today = Carbon::create(2026, 7, 2)->startOfDay();

        return $user->role === 'admin'
            ? $this->getAdminDashboardData($today)
            : $this->getPetugasDashboardData($today, $user->id);
    }

    protected function getAdminDashboardData(Carbon $today): array
    {
        return DB::transaction(function () use ($today) {
            $chartStartDate = $today->copy()->subDays(6)->startOfDay();
            $chartEndDate = $today->copy()->endOfDay();

            $salesToday = (float) Sale::query()
                ->whereDate('created_at', $today)
                ->sum('total_price');

            $purchasesToday = (float) Purchase::query()
                ->whereDate('created_at', $today)
                ->sum('total_price');

            $salesTrendRaw = Sale::query()
                ->whereBetween('created_at', [$chartStartDate, $chartEndDate])
                ->selectRaw('DATE(created_at) as transaction_date, COALESCE(SUM(total_price), 0) as total_amount')
                ->groupByRaw('DATE(created_at)')
                ->orderByRaw('DATE(created_at)')
                ->get()
                ->keyBy('transaction_date');

            $purchaseTrendRaw = Purchase::query()
                ->whereBetween('created_at', [$chartStartDate, $chartEndDate])
                ->selectRaw('DATE(created_at) as transaction_date, COALESCE(SUM(total_price), 0) as total_amount')
                ->groupByRaw('DATE(created_at)')
                ->orderByRaw('DATE(created_at)')
                ->get()
                ->keyBy('transaction_date');

            $chartData = [];
            foreach (CarbonPeriod::create($chartStartDate, $today) as $date) {
                $formattedDate = $date->format('Y-m-d');

                $chartData[] = [
                    'date' => $formattedDate,
                    'label' => $date->translatedFormat('d M'),
                    'sales_total' => (float) optional($salesTrendRaw->get($formattedDate))->total_amount,
                    'purchase_total' => (float) optional($purchaseTrendRaw->get($formattedDate))->total_amount,
                ];
            }

            $recentSales = Sale::query()
                ->with('user:id,name')
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn (Sale $sale) => [
                    'id' => $sale->id,
                    'type' => 'sale',
                    'invoice_number' => $sale->invoice_number,
                    'total_price' => (float) $sale->total_price,
                    'created_at' => optional($sale->created_at)->toISOString(),
                    'actor_name' => $sale->user?->name,
                ]);

            $recentPurchases = Purchase::query()
                ->with(['supplier:id,name', 'user:id,name'])
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn (Purchase $purchase) => [
                    'id' => $purchase->id,
                    'type' => 'purchase',
                    'invoice_number' => $purchase->invoice_number,
                    'total_price' => (float) $purchase->total_price,
                    'created_at' => optional($purchase->created_at)->toISOString(),
                    'actor_name' => $purchase->supplier?->name ?? $purchase->user?->name,
                ]);

            return [
                'dashboard_type' => 'admin',
                'today' => $today->format('Y-m-d'),
                'summary' => [
                    'total_products' => Product::count(),
                    'total_suppliers' => Supplier::count(),
                    'today_sales_revenue' => $salesToday,
                    'today_purchase_expense' => $purchasesToday,
                ],
                'chart' => [
                    'title' => 'Tren Penjualan vs Pembelian (7 Hari Terakhir)',
                    'data' => $chartData,
                ],
                'low_stock_products' => Product::query()
                    ->with('category:id,name')
                    ->where('stock', '<=', 10)
                    ->orderBy('stock')
                    ->orderBy('name')
                    ->limit(5)
                    ->get()
                    ->map(fn (Product $product) => [
                        'id' => $product->id,
                        'name' => $product->name,
                        'sku' => $product->sku,
                        'stock' => (float) $product->stock,
                        'category_name' => $product->category?->name,
                    ])
                    ->values()
                    ->all(),
                'recent_activities' => [
                    'sales' => $recentSales->values()->all(),
                    'purchases' => $recentPurchases->values()->all(),
                ],
            ];
        });
    }

    protected function getPetugasDashboardData(Carbon $today, int $userId): array
    {
        return DB::transaction(function () use ($today, $userId) {
            $mySalesToday = Sale::query()
                ->where('user_id', $userId)
                ->whereDate('created_at', $today);

            $recentSales = Sale::query()
                ->with('details.product', 'user:id,name')
                ->where('user_id', $userId)
                ->whereDate('created_at', $today)
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn (Sale $sale) => [
                    'id' => $sale->id,
                    'invoice_number' => $sale->invoice_number,
                    'total_price' => (float) $sale->total_price,
                    'money_received' => (float) $sale->money_received,
                    'money_change' => (float) $sale->money_change,
                    'created_at' => optional($sale->created_at)->toISOString(),
                    'status' => 'Selesai',
                    'user' => $sale->user ? [
                        'id' => $sale->user->id,
                        'name' => $sale->user->name,
                    ] : null,
                    'details' => $sale->details->map(fn ($detail) => [
                        'id' => $detail->id,
                        'product_id' => $detail->product_id,
                        'quantity' => (float) $detail->quantity,
                        'price' => (float) $detail->price,
                        'subtotal' => (float) $detail->subtotal,
                        'product' => $detail->product ? [
                            'id' => $detail->product->id,
                            'name' => $detail->product->name,
                            'sku' => $detail->product->sku,
                        ] : null,
                    ])->values()->all(),
                ]);

            return [
                'dashboard_type' => 'petugas',
                'today' => $today->format('Y-m-d'),
                'summary' => [
                    'my_total_transactions_today' => (clone $mySalesToday)->count(),
                    'my_total_sales_today' => (float) (clone $mySalesToday)->sum('total_price'),
                ],
                'quick_actions' => [
                    'cashier_route' => route('sales.create'),
                ],
                'my_recent_sales' => $recentSales->values()->all(),
            ];
        });
    }
}
