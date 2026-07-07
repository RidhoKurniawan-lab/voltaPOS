<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $filter = $request->only(['search']);

        $suppliers = Supplier::withCount('purchases')
            ->latest()
            ->filter($filter)
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Supplier/Index', [
            'suppliers' => $suppliers,
            'filter' => $filter ?: new \stdClass,
        ]);
    }

    public function create()
    {
        return Inertia::render('Supplier/Add');
    }

    public function store(StoreSupplierRequest $request)
    {
        Supplier::create($request->validated());

        return redirect()->route('suppliers.index')->with('success', 'Supplier added successfully!');
    }

    public function edit(Supplier $supplier)
    {
        return Inertia::render('Supplier/Edit', [
            'supplier' => $supplier
        ]);
    }

    public function update(UpdateSupplierRequest $request, Supplier $supplier)
    {
        $supplier->update($request->validated());

        return redirect()->route('suppliers.index')->with('success', 'Supplier updated successfully!');
    }

    public function destroy(Supplier $supplier)
    {
        if ($supplier->purchases()->exists()) {
            return redirect()->route('suppliers.index')->with('error', 'Tidak dapat menghapus supplier ini karena masih memiliki data transaksi pembelian.');
        }

        $supplier->delete();

        return redirect()->route('suppliers.index')->with('success', 'Supplier deleted successfully!');
    }
}
