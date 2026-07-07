<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePurchaseRequest;
use App\Http\Requests\UpdatePurchaseRequest;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Supplier;
use App\Models\User;
use App\Services\PurchaseService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function __construct(
        protected PurchaseService $purchaseService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filter = $request->only(['search', 'date', 'userId']);

        $purchases = Purchase::with(['supplier', 'user', 'details.product'])
            ->withCount('details')
            ->latest()
            ->filter($filter)
            ->paginate(10)
            ->withQueryString();

        $users = User::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Purchase/Index', [
            'purchases' => $purchases,
            'users'     => $users,
            'filter'    => $filter ?: new \stdClass,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $suppliers = Supplier::select('id', 'name', 'phone')->orderBy('name')->get();
        $products  = Product::select('id', 'name', 'sku', 'price_buy', 'stock')->orderBy('name')->get();

        return Inertia::render('Purchase/Create', [
            'suppliers' => $suppliers,
            'products'  => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePurchaseRequest $request)
    {
        $validated = $request->validated();

        // Hitung total_price dari items
        $totalPrice = collect($validated['items'])->sum(function ($item) {
            return $item['quantity'] * $item['price'];
        });

        try {
            $this->purchaseService->store(
                [
                    'supplier_id'    => $validated['supplier_id'],
                    'invoice_number' => $validated['invoice_number'],
                    'total_price'    => $totalPrice,
                    'date'           => $validated['date'],
                ],
                $validated['items']
            );

            return redirect()->route('purchases.index')->with('success', 'Pembelian berhasil disimpan & stok produk telah diperbarui!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan pembelian: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Purchase $purchase)
    {
        $purchase->load(['details.product', 'supplier', 'user']);
        $suppliers = Supplier::select('id', 'name', 'phone')->orderBy('name')->get();
        $products  = Product::select('id', 'name', 'sku', 'price_buy', 'stock')->orderBy('name')->get();

        return Inertia::render('Purchase/Edit', [
            'purchase'  => $purchase,
            'suppliers' => $suppliers,
            'products'  => $products,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePurchaseRequest $request, Purchase $purchase)
    {
        $validated = $request->validated();

        // Hitung total_price dari items
        $totalPrice = collect($validated['items'])->sum(function ($item) {
            return $item['quantity'] * $item['price'];
        });

        try {
            $this->purchaseService->update(
                $purchase,
                [
                    'supplier_id'    => $validated['supplier_id'],
                    'invoice_number' => $validated['invoice_number'],
                    'total_price'    => $totalPrice,
                    'date'           => $validated['date'],
                ],
                $validated['items']
            );

            return redirect()->route('purchases.index')->with('success', 'Pembelian berhasil diperbarui & stok produk telah disesuaikan!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat memperbarui pembelian: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Purchase $purchase)
    {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        try {
            $this->purchaseService->destroy($purchase);
            return redirect()->route('purchases.index')->with('success', 'Pembelian berhasil dihapus & stok produk telah dikembalikan!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menghapus pembelian: ' . $e->getMessage());
        }
    }
}
