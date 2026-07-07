import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import ThermalReceipt from "./ThermalReceipt";
import { useRupiahFormat } from "@/Hook/useRupiahFormat";

export default function SaleShowModal({ isOpen, onClose, sale }) {
    const [showPrintPreview, setShowPrintPreview] = useState(false);

    if (!sale) return null;

    const handlePrint = () => {
        setShowPrintPreview(true);
    };

    const handlePrintExecute = () => {
        // Set document title with date for PDF filename
        const date = new Date(sale.created_at);
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        const originalTitle = document.title;
        document.title = `Struk-${sale.invoice_number}-${dateStr}`;

        window.print();

        // Restore original title after print dialog closes
        setTimeout(() => {
            document.title = originalTitle;
        }, 1000);
    };

    const grandTotal = sale.details?.reduce(
        (sum, d) => sum + parseFloat(d.subtotal || 0),
        0
    ) ?? parseFloat(sale.total_price ?? 0);

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Detail Transaksi Penjualan" size="3xl">
                <div className="sale-detail-content space-y-5">
                <div className="flex items-start gap-4 pb-5 border-b border-slate-200">
                    <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-receipt text-2xl text-emerald-600"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                            Nomor Invoice
                        </p>
                        <h4 className="text-xl font-bold text-slate-800 font-mono mt-0.5">
                            {sale.invoice_number}
                        </h4>
                        <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full font-medium border border-emerald-100">
                            <i className="fas fa-check-circle text-[10px]"></i>
                            Tersimpan
                        </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                            Total Penjualan
                        </p>
                        <p className="text-2xl font-black text-slate-800 mt-0.5">
                            {useRupiahFormat(grandTotal)}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                            Tanggal
                        </p>
                        <p className="text-sm font-semibold text-slate-800 mt-1.5">
                            {sale.created_at
                                ? new Date(sale.created_at).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                  })
                                : "—"}
                        </p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                            Kasir
                        </p>
                        <p className="text-sm font-semibold text-slate-800 mt-1.5">
                            {sale.user?.name || "Kasir"}
                        </p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                            Uang Diterima
                        </p>
                        <p className="text-sm font-semibold text-slate-800 mt-1.5">
                            {useRupiahFormat(sale.money_received || 0)}
                        </p>
                    </div>

                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                        <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">
                            Kembalian
                        </p>
                        <p className="text-sm font-bold text-emerald-700 mt-1.5">
                            {useRupiahFormat(sale.money_change || 0)}
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                        <i className="fas fa-shopping-cart text-emerald-600 text-sm"></i>
                        <span className="text-sm font-semibold text-slate-700">
                            Daftar Item ({sale.details?.length ?? 0} produk)
                        </span>
                    </div>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-600 text-left">
                                <th className="px-4 py-3 font-medium">#</th>
                                <th className="px-4 py-3 font-medium">Produk</th>
                                <th className="px-4 py-3 font-medium text-right">Qty</th>
                                <th className="px-4 py-3 font-medium text-right">Harga Jual</th>
                                <th className="px-4 py-3 font-medium text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sale.details && sale.details.length > 0 ? (
                                sale.details.map((detail, index) => (
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

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-slate-700 text-white hover:bg-slate-800 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                    >
                        <i className="fas fa-print mr-2"></i>
                        Cetak Struk
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                    >
                        Tutup
                    </button>
                </div>
                </div>
            </Modal>

            {/* Print Preview Modal */}
            {showPrintPreview && (
                <>
                    <style>{`
                        @media print {
                            * {
                                visibility: hidden;
                            }
                            #thermal-receipt-content, #thermal-receipt-content * {
                                visibility: visible;
                            }
                            #thermal-receipt-content {
                                position: fixed;
                                left: 0;
                                top: 0;
                                width: 80mm;
                                padding: 0;
                                margin: 0;
                            }
                            body {
                                margin: 0;
                                padding: 0;
                            }
                            @page {
                                size: 80mm auto;
                                margin: 0;
                            }
                        }
                    `}</style>
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden transition-all duration-300 flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                                <h3 className="text-lg font-semibold text-slate-800">
                                    Pratinjau Struk
                                </h3>
                                <button
                                    onClick={() => setShowPrintPreview(false)}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                >
                                    <i className="fas fa-times text-lg"></i>
                                </button>
                            </div>

                            {/* Receipt Preview */}
                            <div className="flex-1 overflow-y-auto max-h-[60vh] bg-slate-100 p-6">
                                <ThermalReceipt sale={sale} />
                            </div>

                            {/* Action Buttons */}
                            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50">
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={handlePrintExecute}
                                        className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-semibold"
                                    >
                                        <i className="fas fa-print mr-2"></i>
                                        Cetak
                                    </button>
                                    <button
                                        onClick={() => setShowPrintPreview(false)}
                                        className="w-full px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-semibold"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
