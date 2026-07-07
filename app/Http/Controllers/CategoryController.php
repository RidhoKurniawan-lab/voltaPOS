<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $filter = $request->only(['search']);

        $categories = Category::withCount('products')
            ->latest()
            ->filter($filter)
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Category/Index', [
            'categories' => $categories,
            'filter' => $filter ?: new \stdClass,
        ]);
    }

    public function create()
    {
        return Inertia::render('Category/Add');
    }

    public function store(StoreCategoryRequest $request)
    {
        Category::create($request->validated());

        return redirect()->route('categories.index')->with('success', 'Category added successfully!');
    }

    public function edit(Category $category)
    {
        return Inertia::render('Category/Edit', [
            'category' => $category
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update($request->validated());

        return redirect()->route('categories.index')->with('success', 'Category updated successfully!');
    }

    public function destroy(Category $category)
    {
        // Optional: check if category has products
        if ($category->products()->exists()) {
            return redirect()->route('categories.index')->with('error', 'Tidak dapat menghapus kategori ini karena masih memiliki produk.');
        }

        $category->delete();

        return redirect()->route('categories.index')->with('success', 'Category deleted successfully!');
    }
}
