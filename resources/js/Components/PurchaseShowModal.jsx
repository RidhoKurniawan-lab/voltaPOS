import React from "react";
import Modal from "./Modal";
import { useRupiahFormat } from "@/Hook/useRupiahFormat";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function PurchaseShowModal({ isOpen, onClose, purchase }) {
    if (!purchase) return null;

    const grandTotal = purchase.details?.reduce(
        (sum, d) => sum + parseFloat(d.subtotal || 0),
        0
    ) ?? parseFloat(purchase.total_price ?? 0);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detail Transaksi Pembelian" size="3xl">
            <div className="space-y-5">
                {/* Header Info */}
                <div className="flex items-start gap-4 pb-5 border-b border-slate-200">
                    <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-file-invoice text-2xl text-emerald-600"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                            Nomor Invoice
                        </p>
                        <h4 className="text-xl font-bold text-slate-800 font-mono mt-0.5">
                            {purchase.invoice_number}
                        </h4>
                        <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full font-medium border border-emerald-100">
                            <i className="fas fa-check-circle text-[10px]"></i>
                            Tersimpan
                        </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                            Total Pembelian
                        </p>
                        <p className="text-2xl font-black text-slate-800 mt-0.5">
                            {useRupiahFormat(grandTotal)}
                        </p>
                    </div>
                </div>

                {/* Meta Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                            Supplier
                        </p>
                        <p className="text-sm font-semibold text-slate-800 mt-1.5">
                            {purchase.supplier?.name || "—"}
                        </p>
                        {purchase.supplier?.phone && (
                            <p className="text-xs text-slate-500 mt-0.5">
                                {purchase.supplier.phone}
                            </p>
                        )}
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                            Tanggal Masuk
                        </p>
                        <p className="text-sm font-semibold text-slate-800 mt-1.5">
                            {purchase.created_at
                                ? new Date(purchase.created_at).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                  })
                                : "—"}
                        </p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                            Dicatat Oleh
                        </p>
                        <p className="text-sm font-semibold text-slate-800 mt-1.5">
                            {purchase.user?.name || "Administrator"}
                        </p>
                    </div>
                </div>

                {/* Item Details Table */}
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                        <i className="fas fa-boxes text-emerald-600 text-sm"></i>
                        <span className="text-sm font-semibold text-slate-700">
                            Daftar Item ({purchase.details?.length ?? 0} produk)
                        </span>
                    </div>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-600 text-left">
                                <th className="px-4 py-3 font-medium">#</th>
                                <th className="px-4 py-3 font-medium">Produk</th>
                                <th className="px-4 py-3 font-medium text-right">Qty</th>
                                <th className="px-4 py-3 font-medium text-right">Harga Beli</th>
                                <th className="px-4 py-3 font-medium text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {purchase.details && purchase.details.length > 0 ? (
                                purchase.details.map((detail, index) => (
                                    <tr key={detail.id ?? index} className="hover:bg-slate-50/50">
                                        <td className="px-4 py-3 text-slate-400 font-medium">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-slate-800">
                                                {detail.product?.name || `Produk #${detail.product_id}`}
                                            </p>
                                            {detail.product?.sku && (
                                                <p className="text-xs font-mono text-slate-400 mt-0.5">
                                                    {detail.product.sku}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right font-medium text-slate-700">
                                            {parseFloat(detail.quantity).toLocaleString("id-ID")}
                                        </td>
                                        <td className="px-4 py-3 text-right text-slate-600">
                                            {useRupiahFormat(detail.price || 0)}
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-slate-800">
                                            {useRupiahFormat(detail.subtotal || 0)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-slate-400 text-sm">
                                        Tidak ada detail item
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        {/* Footer Total */}
                        <tfoot>
                            <tr className="bg-slate-50 border-t border-slate-200">
                                <td colSpan={4} className="px-4 py-3 text-right font-semibold text-slate-700">
                                    Grand Total
                                </td>
                                <td className="px-4 py-3 text-right font-black text-emerald-700 text-base">
                                    {useRupiahFormat(grandTotal)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                    >
                        Tutup
                    </button>
                    <Link
                        href={route("purchases.edit", purchase.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                    >
                        <i className="fas fa-edit text-xs"></i>
                        Edit Transaksi
                    </Link>
                </div>
            </div>
        </Modal>
    );
}
