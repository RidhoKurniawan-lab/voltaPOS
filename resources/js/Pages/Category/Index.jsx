import React, { useState, useCallback } from "react";
import AuthenticatedLayout from "@/Layout/AuthenticatedLayout";
import TableHeader from "@/Components/TableComponent/TableHeader";
import { Link, router } from "@inertiajs/react";
import Table from "@/Components/TableComponent/Table";
import LinkButton from "@/Components/LinkButton";
import TableFooter from "@/Components/TableComponent/TableFooter";
import { route } from "ziggy-js";
import { showConfirm } from "../../Utils/swal";
import TextInput from "@/Components/TextInput";
import { debounce } from "lodash";

const Index = ({ categories, filter }) => {
    const [search, setSearch] = useState(filter?.search || "");

    const applySearch = useCallback(
        debounce((term) => {
            router.get(
                route("categories.index"),
                { search: term },
                {
                    preserveState: true,
                    replace: true,
                    only: ["categories"],
                }
            );
        }, 500),
        []
    );

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        applySearch(val);
    };

    const handleDelete = (id) => {
        showConfirm(
            "Hapus Kategori?",
            "Apakah Anda yakin ingin menghapus kategori ini?",
            "Ya, Hapus"
        ).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("categories.destroy", id));
            }
        });
    };

    const tableHeader = [
        { label: "#" },
        { label: "Nama Kategori" },
        { label: "Slug" },
        { label: "Total Produk", className: "text-center" },
        { label: "Aksi", className: "text-center" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        Kategori Produk POS
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Kelola semua kategori produk untuk Point of Sale
                    </p>
                </div>
                <LinkButton href={route("categories.create")} icon="fas fa-plus">
                    Tambah Kategori
                </LinkButton>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <TextInput
                        name="search"
                        icon="fas fa-search"
                        type="text"
                        placeholder="Cari kategori..."
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>

                {search && (
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="text-xs text-slate-500">
                            Filter aktif:
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                            Pencarian: {search}
                            <button
                                onClick={() => {
                                    setSearch("");
                                    applySearch("");
                                }}
                                className="hover:text-red-500 transition-colors"
                            >
                                <i className="fas fa-times cursor-pointer"></i>
                            </button>
                        </span>
                    </div>
                )}
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-b border-slate-200 gap-3">
                    <div className="flex items-center gap-2">
                        <button
                            className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Refresh"
                            onClick={() => window.location.reload()}
                        >
                            <i className="fas fa-sync-alt text-sm"></i>
                        </button>
                    </div>
                    <div className="text-sm text-slate-500">
                        Total:{" "}
                        <span className="font-semibold text-slate-700">
                            {categories.total}
                        </span>{" "}
                        kategori
                    </div>
                </div>

                <Table tableHeader={tableHeader}>
                    {categories.data.length > 0 ? (
                        categories.data.map((item, index) => (
                            <tr
                                key={item.id}
                                className="hover:bg-slate-50 transition-colors"
                            >
                                <td className="px-5 py-4">
                                    <span className="text-stone-700">
                                        {index +
                                            1 +
                                            (categories.current_page - 1) *
                                                categories.per_page}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="font-medium text-slate-800">
                                        {item.name}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="font-mono text-sm text-slate-600">
                                        {item.slug}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-center">
                                    <span className="inline-flex px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
                                        {item.products_count || 0} Produk
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-center gap-1">
                                        <Link
                                            href={route(
                                                "categories.edit",
                                                item.id
                                            )}
                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                            title="Edit"
                                        >
                                            <i className="fas fa-edit text-sm"></i>
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                            title="Hapus"
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
                                        Silakan coba dengan kata kunci yang berbeda.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    )}
                </Table>

                <TableFooter paginate={categories} />
            </div>
        </div>
    );
};

Index.layout = (page) => <AuthenticatedLayout children={page} />;

export default Index;
