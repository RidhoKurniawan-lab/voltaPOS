<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSaleRequest;
use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use App\Services\SaleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function __construct(
        protected SaleService $saleService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filter = $request->only(['search', 'date', 'userId']);

        $salesQuery = Sale::with(['user', 'details.product'])
            ->withCount('details')
            ->latest()
            ->filter($filter);

        if ($request->user()->role === 'petugas') {
            $salesQuery->where('user_id', $request->user()->id);
            unset($filter['userId']);
        }

        $sales = $salesQuery
            ->paginate(10)
            ->withQueryString();

        $users = $request->user()->role === 'admin'
            ? User::select('id', 'name')->orderBy('name')->get()
            : collect();

        return Inertia::render('Sales/Index', [
            'sales'  => $sales,
            'users'  => $users,
            'filter' => $filter ?: new \stdClass,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Product::select('id', 'name', 'sku', 'price_sell', 'stock')
            ->where('stock', '>', 0)
            ->orderBy('name')
            ->get();

        $saleForPrint = session()->get('sale_for_print');
        session()->forget('sale_for_print');

        return Inertia::render('Sales/Create', [
            'products'       => $products,
            'invoice_number' => $this->generateInvoiceNumber(),
            'sale_for_print' => $saleForPrint,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSaleRequest $request)
    {
        $validated = $request->validated();

        $totalPrice = collect($validated['items'])->sum(function ($item) {
            return $item['quantity'] * $item['price'];
        });

        $moneyChange = $validated['money_received'] - $totalPrice;

        try {
            $sale = $this->saleService->store(
                [
                    'invoice_number' => $validated['invoice_number'],
                    'total_price'    => $totalPrice,
                    'money_received' => $validated['money_received'],
                    'money_change'   => $moneyChange,
                ],
                $validated['items']
            );

            // Load sale with details and user for receipt printing
            $sale->load(['details.product', 'user']);

            // Store sale data in session for the next request
            session()->put('sale_for_print', $sale->toArray());

            return redirect()->route('sales.create')->with('success', 'Transaksi penjualan berhasil disimpan & stok produk telah diperbarui!');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat menyimpan penjualan: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Sale $sale)
    {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        try {
            $this->saleService->destroy($sale);
            return redirect()->route('sales.index')->with('success', 'Penjualan berhasil dihapus & stok produk telah dikembalikan!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menghapus penjualan: ' . $e->getMessage());
        }
    }

    /**
     * Generate nomor invoice unik dengan format INV-YYYYMMDD-XXXX.
     */
    private function generateInvoiceNumber(): string
    {
        $date   = now()->format('Ymd');
        $prefix = "INV-{$date}-";

        $lastSale = Sale::where('invoice_number', 'like', "{$prefix}%")
            ->orderByDesc('invoice_number')
            ->first();

        $nextSeq = $lastSale
            ? ((int) substr($lastSale->invoice_number, -4)) + 1
            : 1;

        return $prefix . str_pad((string) $nextSeq, 4, '0', STR_PAD_LEFT);
    }
}
