import React, { useMemo, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import AuthenticatedLayout from "@/Layout/AuthenticatedLayout";
import LinkButton from "@/Components/LinkButton";
import SaleShowModal from "@/Components/SaleShowModal";
import { useRupiahFormat } from "@/Hook/useRupiahFormat";

const iconClassMap = {
    products: "fas fa-box",
    suppliers: "fas fa-truck",
    sales: "fas fa-cash-register",
    purchases: "fas fa-wallet",
    transactions: "fas fa-receipt",
    revenue: "fas fa-coins",
};

const cardToneMap = {
    emerald: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
};

function KpiCard({ title, value, subtitle, icon, tone = "emerald" }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>
                    <p className="mt-2 text-2xl font-black text-slate-800">
                        {value}
                    </p>
                    {subtitle ? (
                        <p className="mt-1 text-xs text-slate-500">
                            {subtitle}
                        </p>
                    ) : null}
                </div>
                <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${cardToneMap[tone]}`}
                >
                    <i className={icon}></i>
                </div>
            </div>
        </div>
    );
}

function BarTrendChart({ data }) {
    const maxValue = useMemo(() => {
        return Math.max(
            ...data.flatMap((item) => [
                Number(item.sales_total || 0),
                Number(item.purchase_total || 0),
            ]),
            0,
        );
    }, [data]);

    if (!data.length) {
        return (
            <div className="h-80 flex items-center justify-center text-slate-500">
                Belum ada data grafik.
            </div>
        );
    }

    return (
        <div className="w-full h-80 flex items-end gap-3 overflow-x-auto pb-2">
            {data.map((item) => {
                const salesHeight =
                    maxValue > 0
                        ? Math.max(
                              (Number(item.sales_total || 0) / maxValue) * 100,
                              item.sales_total > 0 ? 6 : 0,
                          )
                        : 0;
                const purchaseHeight =
                    maxValue > 0
                        ? Math.max(
                              (Number(item.purchase_total || 0) / maxValue) *
                                  100,
                              item.purchase_total > 0 ? 6 : 0,
                          )
                        : 0;

                return (
                    <div
                        key={item.date}
                        className="min-w-18 flex-1 flex flex-col justify-end items-center gap-2"
                    >
                        <div className="w-full h-64 flex items-end justify-center gap-2">
                            <div
                                className="w-4 sm:w-5 rounded-t-xl bg-emerald-500/90"
                                style={{ height: `${salesHeight}%` }}
                                title={`Penjualan: ${useRupiahFormat(item.sales_total || 0)}`}
                            ></div>
                            <div
                                className="w-4 sm:w-5 rounded-t-xl bg-amber-400/90"
                                style={{ height: `${purchaseHeight}%` }}
                                title={`Pembelian: ${useRupiahFormat(item.purchase_total || 0)}`}
                            ></div>
                        </div>
                        <p className="text-xs font-semibold text-slate-500">
                            {item.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

export default function Index(props) {
    const { auth } = usePage().props;
    const [selectedSale, setSelectedSale] = useState(null);
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
    const user = auth?.user;
    const isAdmin = props.dashboard_type === "admin";
    const todayLabel = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(`${props.today}T00:00:00`));

    const openReceiptPreview = (sale) => {
        setSelectedSale(sale);
        setIsSaleModalOpen(true);
    };

    const dashboardKpis = isAdmin
        ? [
              {
                  title: "Total Produk",
                  value: new Intl.NumberFormat("id-ID").format(
                      props.summary.total_products || 0,
                  ),
                  subtitle: "Seluruh item master produk aktif",
                  icon: iconClassMap.products,
                  tone: "blue",
              },
              {
                  title: "Total Supplier",
                  value: new Intl.NumberFormat("id-ID").format(
                      props.summary.total_suppliers || 0,
                  ),
                  subtitle: "Mitra pemasok terdaftar",
                  icon: iconClassMap.suppliers,
                  tone: "amber",
              },
              {
                  title: "Omzet Penjualan Hari Ini",
                  value: useRupiahFormat(
                      props.summary.today_sales_revenue || 0,
                  ),
                  subtitle: "Akumulasi transaksi penjualan tanggal ini",
                  icon: iconClassMap.sales,
                  tone: "emerald",
              },
              {
                  title: "Pengeluaran Pembelian Hari Ini",
                  value: useRupiahFormat(
                      props.summary.today_purchase_expense || 0,
                  ),
                  subtitle: "Total pembelian stok masuk hari ini",
                  icon: iconClassMap.purchases,
                  tone: "rose",
              },
          ]
        : [
              {
                  title: "Total Transaksi Saya Hari Ini",
                  value: new Intl.NumberFormat("id-ID").format(
                      props.summary.my_total_transactions_today || 0,
                  ),
                  subtitle: "Jumlah transaksi yang Anda tangani hari ini",
                  icon: iconClassMap.transactions,
                  tone: "emerald",
              },
              {
                  title: "Total Omzet Saya Hari Ini",
                  value: useRupiahFormat(
                      props.summary.my_total_sales_today || 0,
                  ),
                  subtitle: "Akumulasi omzet transaksi Anda hari ini",
                  icon: iconClassMap.revenue,
                  tone: "blue",
              },
          ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                            {isAdmin ? "Dashboard Admin" : "Dashboard Kasir"}
                        </p>
                        <h1 className="mt-1 text-2xl lg:text-3xl font-black text-slate-800">
                            Selamat datang, {user?.name}
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Role:{" "}
                            <span className="font-semibold text-slate-700 capitalize">
                                {user?.role}
                            </span>{" "}
                            • {todayLabel}
                        </p>
                    </div>

                    {!isAdmin ? (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 lg:p-5 max-w-xl">
                            <p className="text-lg font-bold text-emerald-800">
                                Selamat Bertugas, {user?.name}!
                            </p>
                            <p className="mt-1 text-sm text-emerald-700/90">
                                Fokus pada pelayanan pelanggan dan mulai
                                transaksi baru dari shortcut di bawah ini.
                            </p>
                            <div className="mt-4">
                                <LinkButton
                                    href={props.quick_actions.cashier_route}
                                    icon="fas fa-shopping-cart"
                                    className="px-5 py-3 text-base rounded-xl"
                                >
                                    Buka Mesin Kasir / Mulai Transaksi
                                </LinkButton>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            <div
                className={`grid gap-4 ${isAdmin ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-4" : "grid-cols-1 md:grid-cols-2"}`}
            >
                {dashboardKpis.map((item) => (
                    <KpiCard key={item.title} {...item} />
                ))}
            </div>

            {isAdmin ? (
                <>
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">
                                        {props.chart.title}
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Perbandingan arus kas masuk dari
                                        penjualan dan pengeluaran pembelian 7
                                        hari terakhir.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                                    <span className="inline-flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>{" "}
                                        Penjualan
                                    </span>
                                    <span className="inline-flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-amber-400"></span>{" "}
                                        Pembelian
                                    </span>
                                </div>
                            </div>

                            <BarTrendChart data={props.chart.data || []} />
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                            <div className="flex items-center justify-between gap-3 mb-4">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">
                                        Produk Stok Menipis
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Alert cepat untuk tindakan restock.
                                    </p>
                                </div>
                                <Link
                                    href={route("products.index", {
                                        minStock: 10,
                                    })}
                                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                                >
                                    Lihat Semua
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {props.low_stock_products?.length > 0 ? (
                                    props.low_stock_products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50"
                                        >
                                            <div>
                                                <p className="font-semibold text-slate-800">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {product.sku} •{" "}
                                                    {product.category_name ||
                                                        "Tanpa kategori"}
                                                </p>
                                            </div>
                                            <span
                                                className={`inline-flex min-w-14 justify-center px-3 py-1 rounded-full text-xs font-bold ${Number(product.stock) <= 5 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
                                            >
                                                {new Intl.NumberFormat(
                                                    "id-ID",
                                                ).format(product.stock || 0)}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-10 text-center text-slate-500">
                                        Tidak ada stok menipis saat ini.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-200">
                                <h2 className="text-lg font-bold text-slate-800">
                                    5 Penjualan Terbaru
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    Pantau transaksi terbaru yang masuk ke kas.
                                </p>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {props.recent_activities?.sales?.length > 0 ? (
                                    props.recent_activities.sales.map(
                                        (item) => (
                                            <div
                                                key={`sale-${item.id}`}
                                                className="px-5 py-4 flex items-center justify-between gap-4"
                                            >
                                                <div>
                                                    <p className="font-semibold text-slate-800">
                                                        {item.invoice_number}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        Kasir:{" "}
                                                        {item.actor_name || "-"}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-emerald-700">
                                                        {useRupiahFormat(
                                                            item.total_price ||
                                                                0,
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {new Intl.DateTimeFormat(
                                                            "id-ID",
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                day: "2-digit",
                                                                month: "short",
                                                            },
                                                        ).format(
                                                            new Date(
                                                                item.created_at,
                                                            ),
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ),
                                    )
                                ) : (
                                    <div className="px-5 py-10 text-center text-slate-500">
                                        Belum ada penjualan terbaru.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-200">
                                <h2 className="text-lg font-bold text-slate-800">
                                    5 Pembelian Terbaru
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    Pantau barang masuk dan pengeluaran terkini.
                                </p>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {props.recent_activities?.purchases?.length >
                                0 ? (
                                    props.recent_activities.purchases.map(
                                        (item) => (
                                            <div
                                                key={`purchase-${item.id}`}
                                                className="px-5 py-4 flex items-center justify-between gap-4"
                                            >
                                                <div>
                                                    <p className="font-semibold text-slate-800">
                                                        {item.invoice_number}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        Supplier/User:{" "}
                                                        {item.actor_name || "-"}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-amber-600">
                                                        {useRupiahFormat(
                                                            item.total_price ||
                                                                0,
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {new Intl.DateTimeFormat(
                                                            "id-ID",
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                day: "2-digit",
                                                                month: "short",
                                                            },
                                                        ).format(
                                                            new Date(
                                                                item.created_at,
                                                            ),
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ),
                                    )
                                ) : (
                                    <div className="px-5 py-10 text-center text-slate-500">
                                        Belum ada pembelian terbaru.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    5 Transaksi Saya Hari Ini
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    Riwayat transaksi terbaru yang Anda tangani.
                                </p>
                            </div>
                            <Link
                                href={route("sales.index")}
                                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                            >
                                Riwayat Saya
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-left text-slate-600">
                                        <th className="px-5 py-3 font-semibold">
                                            Invoice
                                        </th>
                                        <th className="px-5 py-3 font-semibold">
                                            Waktu
                                        </th>
                                        <th className="px-5 py-3 font-semibold">
                                            Status
                                        </th>
                                        <th className="px-5 py-3 font-semibold text-right">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {props.my_recent_sales?.length > 0 ? (
                                        props.my_recent_sales.map((sale) => (
                                            <tr key={sale.id}>
                                                <td className="px-5 py-4">
                                                    <div>
                                                        <p className="font-semibold text-slate-800">
                                                            {
                                                                sale.invoice_number
                                                            }
                                                        </p>
                                                        <button
                                                            type="button"
                                                            className="mt-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                                                            onClick={() =>
                                                                openReceiptPreview(
                                                                    sale,
                                                                )
                                                            }
                                                        >
                                                            Cetak ulang struk
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-slate-500">
                                                    {new Intl.DateTimeFormat(
                                                        "id-ID",
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        },
                                                    ).format(
                                                        new Date(
                                                            sale.created_at,
                                                        ),
                                                    )}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="inline-flex px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full font-semibold">
                                                        {sale.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right font-semibold text-slate-800">
                                                    {useRupiahFormat(
                                                        sale.total_price || 0,
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-5 py-10 text-center text-slate-500"
                                            >
                                                Anda belum memiliki transaksi
                                                hari ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">
                                Fokus Hari Ini
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Pastikan setiap transaksi tercatat dengan benar
                                dan struk dapat dicetak ulang bila dibutuhkan
                                pelanggan.
                            </p>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">
                                    Transaksi ditangani hari ini
                                </p>
                                <p className="mt-1 text-2xl font-black text-slate-800">
                                    {new Intl.NumberFormat("id-ID").format(
                                        props.summary
                                            .my_total_transactions_today || 0,
                                    )}{" "}
                                    transaksi
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">
                                    Omzet Anda hari ini
                                </p>
                                <p className="mt-1 text-2xl font-black text-emerald-700">
                                    {useRupiahFormat(
                                        props.summary.my_total_sales_today || 0,
                                    )}
                                </p>
                            </div>
                            <LinkButton
                                href={route("sales.create")}
                                icon="fas fa-cash-register"
                                className="w-full justify-center py-3 rounded-xl text-base"
                            >
                                Mulai Transaksi Baru
                            </LinkButton>
                        </div>
                    </div>
                </div>
            )}

            <SaleShowModal
                isOpen={isSaleModalOpen}
                onClose={() => setIsSaleModalOpen(false)}
                sale={selectedSale}
            />
        </div>
    );
}

Index.layout = (page) => <AuthenticatedLayout children={page} />;
