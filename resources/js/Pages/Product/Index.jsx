import React, { useState } from "react";
import AuthenticatedLayout from "@/Layout/AuthenticatedLayout";
import TableHeader from "@/Components/TableComponent/TableHeader";
import { Link, router, usePage } from "@inertiajs/react";
import Table from "@/Components/TableComponent/Table";
import LinkButton from "@/Components/LinkButton";
import TableFooter from "@/Components/TableComponent/TableFooter";
import { route } from "ziggy-js";
import { showConfirm } from "../../Utils/swal";
import { useSearch } from "../../Hook/useSearch";
import { useRupiahFormat } from "../../Hook/useRupiahFormat";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import ProductShowModal from "@/Components/ProductShowModal";

const Index = ({ products, categories, filter }) => {
    const {
        search,
        category,
        minStock,
        activeFilter,
        removeFilter,
        clearAllFilters,
        handleSearchChange,
        handleCategoryChange,
        handleMinStockChange,
    } = useSearch(filter, categories, "products.index");

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const tableHeader = [
        { label: "#" },
        { label: "SKU" },
        { label: "Nama Produk" },
        { label: "Kategori" },
        { label: "Harga Jual", className: "text-right" },
        { label: "Stok", className: "text-center" },
        { label: "Aksi", className: "text-center" },
    ];

    const handleDelete = (id) => {
        showConfirm(
            "Delete?",
            "Are you sure you want to delete this product?",
            "Yes, Delete",
        ).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("products.destroy", id));
            }
        });
    };

    const handleShowProduct = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        Data Produk POS
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Kelola semua produk untuk Point of Sale
                    </p>
                </div>
                <LinkButton href={route("products.create")} icon="fas fa-plus">
                    Tambah Produk
                </LinkButton>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 transition-all duration-500 ease-in-out">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <TextInput
                        name="search"
                        icon="fas fa-search"
                        type="text"
                        placeholder="Cari produk..."
                        value={search}
                        onChange={handleSearchChange}
                    />

                    {/* Filter Category */}
                    <SelectInput
                        name="category"
                        icon="fas fa-tag"
                        default="Semua Kategori"
                        className="pr-10"
                        value={category}
                        onChange={handleCategoryChange}
                    >
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </SelectInput>

                    {/* Filter Min Stock */}
                    <SelectInput
                        icon="fas fa-boxes"
                        name="minStock"
                        default="Semua Stok"
                        className="pr-10"
                        value={minStock}
                        onChange={handleMinStockChange}
                    >
                        <option value="5">Stok {"<"} 5 (Kritis)</option>
                        <option value="10">Stok {"<"} 10</option>
                        <option value="20">Stok {"<"} 20</option>
                        <option value="50">Stok {"<"} 50</option>
                    </SelectInput>
                </div>

                {/* Active Filters */}
                {activeFilter.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="text-xs text-slate-500">
                            Filter aktif:
                        </span>
                        {activeFilter.map((filter) => (
                            <span
                                key={filter.key}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full"
                            >
                                {filter.label}
                                <button
                                    onClick={() => removeFilter(filter.key)}
                                    className="hover:text-red-500 transition-colors"
                                >
                                    <i className="fas fa-times cursor-pointer"></i>
                                </button>
                            </span>
                        ))}
                        {activeFilter.length > 0 && (
                            <button
                                onClick={clearAllFilters}
                                className="text-xs text-red-500 hover:text-red-700 ml-2 cursor-pointer transition-colors"
                            >
                                Hapus Semua
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Table Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-b border-slate-200 gap-3">
                    <div className="flex items-center gap-2">
                        <button
                            className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Refresh"
                            onClick={() => window.location.reload()}
                        >
                            <i className="fas fa-sync-alt text-sm"></i>
                        </button>
                        <button
                            className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Download"
                        >
                            <i className="fas fa-download text-sm"></i>
                        </button>
                        <button
                            className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Print"
                        >
                            <i className="fas fa-print text-sm"></i>
                        </button>
                    </div>
                    <div className="text-sm text-slate-500">
                        Total:{" "}
                        <span className="font-semibold text-slate-700">
                            {products.total}
                        </span>{" "}
                        produk
                    </div>
                </div>

                {/* Table */}
                <Table tableHeader={tableHeader}>
                    {products.data.length > 0 ? (
                        products.data.map((item, index) => (
                            <tr
                                key={index}
                                className="hover:bg-slate-50 transition-colors"
                            >
                                <td className="px-5 py-4">
                                    <span className="text-stone-700">
                                        {index +
                                            1 +
                                            (products.current_page - 1) *
                                                products.per_page}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="font-mono text-sm font-medium text-slate-700">
                                        {item.sku ||
                                            `PRD-${String(index + 1).padStart(4, "0")}`}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                                <i className="fas fa-box text-emerald-600"></i>
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-slate-800">
                                                {item.name}
                                            </p>
                                            {item.description && (
                                                <p className="text-xs text-slate-500 truncate max-w-30">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="inline-flex px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
                                        {item.category.name || "Tidak ada"}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <span className="font-medium text-slate-800">
                                        {useRupiahFormat(item.price_sell || 0)}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-center">
                                    <span
                                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                            item.stock <= 5
                                                ? "bg-red-100 text-red-700"
                                                : item.stock <= 10
                                                  ? "bg-amber-100 text-amber-700"
                                                  : "bg-emerald-100 text-emerald-700"
                                        }`}
                                    >
                                        {item.stock || 0}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-center gap-1">
                                        <Link
                                            href={route(
                                                "products.edit",
                                                item.id,
                                            )}
                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                            title="Edit"
                                        >
                                            <i className="fas fa-edit text-sm"></i>
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleShowProduct(item)
                                            }
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                            title="Detail"
                                        >
                                            <i className="fas fa-eye text-sm"></i>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <i className="fas fa-trash-alt text-sm"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={tableHeader.length}
                                className="px-5 py-10 text-center"
                            >
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <i className="fas fa-search text-slate-300 text-3xl mb-2"></i>
                                    <p className="text-slate-500 font-medium">
                                        Data Tidak Ditemukan
                                    </p>
                                    <p className="text-slate-400 text-sm">
                                        Silakan coba dengan kata kunci atau
                                        filter yang berbeda.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    )}
                </Table>

                {/* Table Footer / Pagination */}
                <TableFooter paginate={products} />
            </div>
            <ProductShowModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
            />
        </div>
    );
};

Index.layout = (page) => <AuthenticatedLayout children={page} />;

export default Index;
