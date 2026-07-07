import React, { useState, useCallback } from "react";
import AuthenticatedLayout from "@/Layout/AuthenticatedLayout";
import { Link, router, usePage } from "@inertiajs/react";
import Table from "@/Components/TableComponent/Table";
import LinkButton from "@/Components/LinkButton";
import TableFooter from "@/Components/TableComponent/TableFooter";
import { route } from "ziggy-js";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import { debounce } from "lodash";
import { useRupiahFormat } from "@/Hook/useRupiahFormat";
import { showConfirm } from "@/Utils/swal";
import SaleShowModal from "@/Components/SaleShowModal";

const Index = ({ sales, users, filter }) => {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.role === "admin";
    const [search, setSearch] = useState(filter?.search || "");
    const [date, setDate] = useState(filter?.date || "");
    const [userId, setUserId] = useState(filter?.userId || "");
    const [selectedSale, setSelectedSale] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleShow = (sale) => {
        setSelectedSale(sale);
        setIsModalOpen(true);
    };

    const applyFilters = useCallback(
        debounce((newFilters) => {
            router.get(route("sales.index"), newFilters, {
                preserveState: true,
                replace: true,
                only: ["sales"],
            });
        }, 500),
        [],
    );

    const updateFilter = (key, value) => {
        let newFilters = {};
        if (key === "search") {
            newFilters = { search: value, date, userId };
            setSearch(value);
        } else if (key === "date") {
            newFilters = { search, date: value, userId };
            setDate(value);
        } else if (key === "userId") {
            newFilters = { search, date, userId: value };
            setUserId(value);
        }

        Object.keys(newFilters).forEach((k) => {
            if (!newFilters[k]) delete newFilters[k];
        });

        applyFilters(newFilters);
    };

    const handleSearchChange = (e) => updateFilter("search", e.target.value);
    const handleDateChange = (e) => updateFilter("date", e.target.value);
    const handleUserChange = (e) => updateFilter("userId", e.target.value);

    const clearFilter = (key) => {
        const newSearch = key === "search" ? "" : search;
        const newDate = key === "date" ? "" : date;
        const newUserId = key === "userId" ? "" : userId;

        if (key === "search") setSearch("");
        if (key === "date") setDate("");
        if (key === "userId") setUserId("");

        const newFilters = {
            search: newSearch,
            date: newDate,
            userId: newUserId,
        };
        Object.keys(newFilters).forEach((k) => {
            if (!newFilters[k]) delete newFilters[k];
        });
        applyFilters(newFilters);
    };

    const clearAllFilters = () => {
        setSearch("");
        setDate("");
        setUserId("");
        applyFilters({});
    };

    const handleDelete = (id, invoiceNumber) => {
        showConfirm(
            "Hapus Penjualan?",
            `Yakin ingin menghapus transaksi invoice ${invoiceNumber}? Stok produk dari penjualan ini akan dikembalikan secara otomatis.`,
            "Ya, Hapus!",
        ).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("sales.destroy", id));
            }
        });
    };

    const activeFilters = [];
    if (search)
        activeFilters.push({ key: "search", label: `Pencarian: ${search}` });
    if (date) {
        activeFilters.push({
            key: "date",
            label: `Tanggal: ${new Date(date).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })}`,
        });
    }
    if (userId) {
        const userObj = users.find((u) => u.id == userId);
        activeFilters.push({
            key: "userId",
            label: `Kasir: ${userObj ? userObj.name : userId}`,
        });
    }

    const tableHeader = [
        { label: "#" },
        { label: "Nomor Invoice" },
        { label: "Tanggal" },
        { label: "Total Item", className: "text-center" },
        { label: "Total Penjualan", className: "text-right" },
        { label: "Uang Diterima", className: "text-right" },
        { label: "Kembalian", className: "text-right" },
        { label: "Kasir" },
        { label: "Aksi", className: "text-center" },
    ];

    return (
        <>
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Riwayat Penjualan (Kasir)
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Pantau semua transaksi penjualan ke pelanggan
                        </p>
                    </div>
                    <LinkButton
                        href={route("sales.create")}
                        icon="fas fa-cash-register"
                    >
                        Buka Kasir
                    </LinkButton>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1">
                            <TextInput
                                name="search"
                                icon="fas fa-search"
                                type="text"
                                placeholder="Cari nomor invoice..."
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="w-full md:w-56">
                            <TextInput
                                name="date"
                                icon="fas fa-calendar-alt"
                                type="date"
                                value={date}
                                onChange={handleDateChange}
                            />
                        </div>
                        <div className="w-full md:w-56">
                            <SelectInput
                                name="userId"
                                icon="fas fa-user-circle"
                                default="Semua Kasir"
                                value={userId}
                                onChange={handleUserChange}
                            >
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name}
                                    </option>
                                ))}
                            </SelectInput>
                        </div>
                    </div>

                    {activeFilters.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                            <span className="text-xs font-semibold text-slate-500">
                                Filter aktif:
                            </span>
                            {activeFilters.map((f) => (
                                <span
                                    key={f.key}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-100 font-medium"
                                >
                                    {f.label}
                                    <button
                                        onClick={() => clearFilter(f.key)}
                                        className="hover:text-red-500 transition-colors"
                                    >
                                        <i className="fas fa-times cursor-pointer"></i>
                                    </button>
                                </span>
                            ))}
                            <button
                                onClick={clearAllFilters}
                                className="text-xs text-red-500 hover:text-red-700 font-semibold ml-auto"
                            >
                                Hapus Semua Filter
                            </button>
                        </div>
                    )}
                </div>

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
                                {sales.total}
                            </span>{" "}
                            penjualan
                        </div>
                    </div>

                    <Table tableHeader={tableHeader}>
                        {sales.data.length > 0 ? (
                            sales.data.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-5 py-4">
                                        <span className="text-stone-700">
                                            {index +
                                                1 +
                                                (sales.current_page - 1) *
                                                    sales.per_page}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 font-mono text-sm font-medium text-slate-800">
                                        {item.invoice_number}
                                    </td>
                                    <td className="px-5 py-4 text-slate-600">
                                        {new Date(
                                            item.created_at,
                                        ).toLocaleDateString("id-ID", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className="inline-flex px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
                                            {item.details_count || 0} Item
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-right font-semibold text-slate-800">
                                        {useRupiahFormat(item.total_price || 0)}
                                    </td>
                                    <td className="px-5 py-4 text-right text-slate-600">
                                        {useRupiahFormat(
                                            item.money_received || 0,
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-right text-emerald-600 font-medium">
                                        {useRupiahFormat(
                                            item.money_change || 0,
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-slate-500">
                                        {item.user?.name || "Kasir"}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button
                                                onClick={() => handleShow(item)}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Lihat Detail"
                                            >
                                                <i className="fas fa-eye text-sm"></i>
                                            </button>
                                            {isAdmin && (
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            item.id,
                                                            item.invoice_number,
                                                        )
                                                    }
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus Penjualan"
                                                >
                                                    <i className="fas fa-trash-alt text-sm"></i>
                                                </button>
                                            )}
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
                                            Silakan coba dengan kata kunci yang
                                            berbeda.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </Table>

                    <TableFooter paginate={sales} />
                </div>
            </div>

            <SaleShowModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                sale={selectedSale}
            />
        </>
    );
};

Index.layout = (page) => <AuthenticatedLayout children={page} />;

export default Index;
