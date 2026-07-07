import React, { useMemo, useState } from "react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AuthenticatedLayout from "@/Layout/AuthenticatedLayout";
import { useRupiahFormat } from "@/Hook/useRupiahFormat";

const buildDateLabel = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const formatter = new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return `${formatter.format(start)} - ${formatter.format(end)}`;
};

const getPresetDates = (preset) => {
    const today = new Date("2026-07-02T00:00:00");
    const formatDate = (date) => date.toISOString().slice(0, 10);

    if (preset === "today") {
        return {
            start_date: formatDate(today),
            end_date: formatDate(today),
        };
    }

    if (preset === "last7days") {
        const start = new Date(today);
        start.setDate(today.getDate() - 6);

        return {
            start_date: formatDate(start),
            end_date: formatDate(today),
        };
    }

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    return {
        start_date: formatDate(monthStart),
        end_date: formatDate(today),
    };
};

const KpiCard = ({ title, value, icon, accentClass }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 print:shadow-none print:border-slate-300">
        <div className="flex items-start justify-between gap-3">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="mt-2 text-2xl font-black text-slate-800 break-words">
                    {value}
                </p>
            </div>
            <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${accentClass}`}
            >
                <i className={`${icon} text-lg`}></i>
            </div>
        </div>
    </div>
);

export default function Index({
    filters,
    summary,
    sales_trend,
    top_selling_products,
    low_stock_products,
}) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    const applyFilter = (newFilters) => {
        router.get(route("reports.index"), newFilters, {
            preserveState: true,
            replace: true,
            only: [
                "filters",
                "summary",
                "sales_trend",
                "top_selling_products",
                "low_stock_products",
            ],
        });
    };

    const updateDate = (key, value) => {
        if (key === "start_date") {
            setStartDate(value);
            applyFilter({
                start_date: value,
                end_date: endDate,
            });
            return;
        }

        setEndDate(value);
        applyFilter({
            start_date: startDate,
            end_date: value,
        });
    };

    const handlePreset = (preset) => {
        const nextFilters = getPresetDates(preset);
        setStartDate(nextFilters.start_date);
        setEndDate(nextFilters.end_date);
        applyFilter(nextFilters);
    };

    const maxSalesValue = useMemo(() => {
        return Math.max(
            ...sales_trend.map((item) => Number(item.total_sales || 0)),
            0,
        );
    }, [sales_trend]);

    const printTitle = `LAPORAN KEUANGAN & INVENTARIS SYCROCAFE - PERIODE ${buildDateLabel(filters.start_date, filters.end_date)}`;

    return (
        <div className="max-w-7xl mx-auto space-y-6 print:max-w-none print:space-y-4 print:w-full print:p-6 print:bg-white">
            <div className="hidden print:block border-b border-slate-300 pb-4">
                <h1 className="text-xl font-black tracking-wide text-slate-900 uppercase">
                    {printTitle}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Dicetak pada{" "}
                    {new Intl.DateTimeFormat("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                    }).format(new Date("2026-07-02T00:00:00"))}
                </p>
            </div>

            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4 print:hidden">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        Laporan & Dashboard Analytics
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Pantau performa penjualan, pembelian, dan kondisi stok
                        dalam satu halaman.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-700 text-white text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm"
                >
                    <i className="fas fa-print"></i>
                    <span>Cetak / Ekspor PDF</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5 print:hidden print:shadow-none print:border-0 print:p-0">
                <div className="flex flex-col xl:flex-row xl:items-end gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">
                                Tanggal Mulai
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) =>
                                    updateDate("start_date", e.target.value)
                                }
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">
                                Tanggal Akhir
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) =>
                                    updateDate("end_date", e.target.value)
                                }
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => handlePreset("today")}
                            className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Hari Ini
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePreset("last7days")}
                            className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            7 Hari Terakhir
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePreset("thisMonth")}
                            className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                        >
                            Bulan Ini
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 print:grid-cols-2 print:gap-3">
                <KpiCard
                    title="Total Pendapatan"
                    value={useRupiahFormat(summary.total_revenue || 0)}
                    icon="fas fa-arrow-trend-up text-emerald-700"
                    accentClass="bg-emerald-50 text-emerald-700"
                />
                <KpiCard
                    title="Total Pengeluaran"
                    value={useRupiahFormat(summary.total_expense || 0)}
                    icon="fas fa-wallet text-rose-700"
                    accentClass="bg-rose-50 text-rose-700"
                />
                <KpiCard
                    title="Laba Bersih"
                    value={useRupiahFormat(summary.net_profit || 0)}
                    icon="fas fa-chart-line text-blue-700"
                    accentClass="bg-blue-50 text-blue-700"
                />
                <KpiCard
                    title="Total Transaksi Penjualan"
                    value={new Intl.NumberFormat("id-ID").format(
                        summary.total_sales_transactions || 0,
                    )}
                    icon="fas fa-receipt text-amber-700"
                    accentClass="bg-amber-50 text-amber-700"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 print:grid-cols-1 print:gap-4">
                <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 print:w-full print:shadow-none print:border-slate-300 break-inside-avoid-page">
                    <div className="flex items-start justify-between gap-3 mb-5">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">
                                Tren Penjualan Harian
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Visualisasi total penjualan per hari pada
                                periode terpilih.
                            </p>
                        </div>
                    </div>

                    {sales_trend.length > 0 ? (
                        <div className="space-y-4 print:w-full">
                            {sales_trend.map((item) => {
                                const totalSales = Number(
                                    item.total_sales || 0,
                                );
                                const widthPercentage =
                                    maxSalesValue > 0
                                        ? Math.max(
                                              (totalSales / maxSalesValue) *
                                                  100,
                                              totalSales > 0 ? 6 : 0,
                                          )
                                        : 0;

                                return (
                                    <div
                                        key={item.date}
                                        className="grid grid-cols-[80px_1fr_110px] gap-3 items-center print:grid-cols-[72px_1fr_120px]"
                                    >
                                        <span className="text-xs font-semibold text-slate-500">
                                            {item.label}
                                        </span>
                                        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                                                style={{
                                                    width: `${widthPercentage}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-xs sm:text-sm font-semibold text-slate-700 text-right">
                                            {useRupiahFormat(totalSales)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-slate-500">
                            Belum ada data penjualan pada periode ini.
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 print:w-full print:shadow-none print:border-slate-300 break-inside-avoid-page">
                    <div className="mb-5">
                        <h3 className="text-lg font-bold text-slate-800">
                            Top 5 Produk Terlaris
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Produk dengan jumlah item terjual terbanyak.
                        </p>
                    </div>

                    <div className="overflow-x-auto print:w-full">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-slate-500">
                                    <th className="pb-3 font-semibold">
                                        Produk
                                    </th>
                                    <th className="pb-3 font-semibold text-center">
                                        Qty
                                    </th>
                                    <th className="pb-3 font-semibold text-right">
                                        Omzet
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {top_selling_products.length > 0 ? (
                                    top_selling_products.map((product) => (
                                        <tr key={product.id}>
                                            <td className="py-3 pr-3">
                                                <p className="font-semibold text-slate-800">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-slate-500 font-mono">
                                                    {product.sku}
                                                </p>
                                            </td>
                                            <td className="py-3 text-center font-semibold text-slate-700">
                                                {new Intl.NumberFormat(
                                                    "id-ID",
                                                ).format(
                                                    product.total_quantity_sold ||
                                                        0,
                                                )}
                                            </td>
                                            <td className="py-3 text-right font-semibold text-emerald-700">
                                                {useRupiahFormat(
                                                    product.total_sales_amount ||
                                                        0,
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="py-8 text-center text-slate-500"
                                        >
                                            Belum ada produk terjual pada
                                            periode ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:w-full print:shadow-none print:border-slate-300 break-inside-avoid-page">
                <div className="px-5 py-4 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800">
                        Low Stock Alert
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Produk dengan stok saat ini kurang dari atau sama dengan
                        10 item.
                    </p>
                </div>

                <div className="overflow-x-auto print:w-full">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-left text-slate-600">
                                <th className="px-5 py-3 font-semibold">SKU</th>
                                <th className="px-5 py-3 font-semibold">
                                    Nama Produk
                                </th>
                                <th className="px-5 py-3 font-semibold">
                                    Kategori
                                </th>
                                <th className="px-5 py-3 font-semibold text-center">
                                    Stok
                                </th>
                                <th className="px-5 py-3 font-semibold text-right">
                                    Harga Jual
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {low_stock_products.length > 0 ? (
                                low_stock_products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-5 py-4 font-mono text-xs sm:text-sm text-slate-600">
                                            {product.sku}
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-slate-800">
                                            {product.name}
                                        </td>
                                        <td className="px-5 py-4 text-slate-500">
                                            {product.category_name || "-"}
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span
                                                className={`inline-flex min-w-14 justify-center px-3 py-1 rounded-full text-xs font-bold ${Number(product.stock) <= 5 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
                                            >
                                                {new Intl.NumberFormat(
                                                    "id-ID",
                                                ).format(product.stock || 0)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right font-semibold text-slate-700">
                                            {useRupiahFormat(
                                                product.price_sell || 0,
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-5 py-10 text-center text-slate-500"
                                    >
                                        Tidak ada produk dengan stok menipis
                                        saat ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

Index.layout = (page) => <AuthenticatedLayout children={page} />;
