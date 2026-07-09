<?php

namespace App\Services;

use App\Repositories\ReportRepository;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\DB;

class ReportService
{
    public function __construct(
        protected ReportRepository $reportRepository
    ) {}

    public function getReportData(?string $startDate = null, ?string $endDate = null): array
    {
        [$resolvedStartDate, $resolvedEndDate] = $this->resolveDateRange($startDate, $endDate);

        return DB::transaction(function () use ($resolvedStartDate, $resolvedEndDate) {
            $summary = $this->reportRepository->getKpiSummary($resolvedStartDate, $resolvedEndDate);
            $dailySalesTrend = $this->reportRepository->getDailySalesTrend($resolvedStartDate, $resolvedEndDate);
            $topSellingProducts = $this->reportRepository->getTopSellingProducts($resolvedStartDate, $resolvedEndDate, 5);
            $lowStockProducts = $this->reportRepository->getLowStockProducts(10);

            $chartMap = $dailySalesTrend->keyBy('sale_date');
            $chartData = [];

            foreach (CarbonPeriod::create($resolvedStartDate, $resolvedEndDate) as $date) {
                $formattedDate = $date->format('Y-m-d');
                $chartData[] = [
                    'date' => $formattedDate,
                    'label' => $date->translatedFormat('d M'),
                    'total_sales' => (float) optional($chartMap->get($formattedDate))->total_sales,
                ];
            }

            $totalRevenue = (float) ($summary['total_revenue'] ?? 0);
            $totalExpense = (float) ($summary['total_expense'] ?? 0);

            return [
                'filters' => [
                    'start_date' => $resolvedStartDate->format('Y-m-d'),
                    'end_date' => $resolvedEndDate->format('Y-m-d'),
                ],
                'summary' => [
                    'total_revenue' => $totalRevenue,
                    'total_expense' => $totalExpense,
                    'net_profit' => $totalRevenue - $totalExpense,
                    'total_sales_transactions' => (int) ($summary['total_sales_transactions'] ?? 0),
                ],
                'sales_trend' => $chartData,
                'top_selling_products' => $topSellingProducts->map(fn ($product) => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'total_quantity_sold' => (float) $product->total_quantity_sold,
                    'total_sales_amount' => (float) $product->total_sales_amount,
                ])->values()->all(),
                'low_stock_products' => $lowStockProducts->map(fn ($product) => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'stock' => (float) $product->stock,
                    'price_sell' => (float) $product->price_sell,
                    'category_name' => $product->category_name,
                ])->values()->all(),
            ];
        });
    }

    protected function resolveDateRange(?string $startDate, ?string $endDate): array
    {
        $defaultStart = Carbon::now()->startOfMonth();
        $defaultEnd = Carbon::now();

        $resolvedStart = filled($startDate)
            ? Carbon::parse($startDate)->startOfDay()
            : $defaultStart;

        $resolvedEnd = filled($endDate)
            ? Carbon::parse($endDate)->startOfDay()
            : $defaultEnd;

        if ($resolvedStart->gt($resolvedEnd)) {
            [$resolvedStart, $resolvedEnd] = [$resolvedEnd->copy(), $resolvedStart->copy()];
        }

        return [$resolvedStart, $resolvedEnd];
    }
}
