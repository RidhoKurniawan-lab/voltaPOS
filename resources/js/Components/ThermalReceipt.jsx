import React from "react";
import { useRupiahFormat } from "@/Hook/useRupiahFormat";

export default function ThermalReceipt({ sale }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div 
            id="thermal-receipt-content"
            className="bg-white p-4 font-mono text-xs"
            style={{ width: '80mm', maxWidth: '80mm' }}
        >
            {/* Store Header */}
            <div className="text-center mb-4 border-b border-dashed border-slate-300 pb-4">
                <h2 className="text-lg font-bold text-slate-800">Trusty Emerald</h2>
                <p className="text-xs text-slate-600">Jl. Contoh No. 123</p>
                <p className="text-xs text-slate-600">Telp: (021) 1234567</p>
            </div>

            {/* Invoice Info */}
            <div className="mb-4 border-b border-dashed border-slate-300 pb-4">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">No. Invoice:</span>
                    <span className="font-semibold text-slate-800">{sale.invoice_number}</span>
                </div>
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Tanggal:</span>
                    <span className="text-slate-800">{formatDate(sale.created_at)}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Kasir:</span>
                    <span className="text-slate-800">{sale.user?.name || 'Kasir'}</span>
                </div>
            </div>

            {/* Items Table */}
            <div className="mb-4 border-b border-dashed border-slate-300 pb-4">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-slate-300">
                            <th className="text-left py-1 text-slate-600">Item</th>
                            <th className="text-center py-1 text-slate-600">Qty</th>
                            <th className="text-right py-1 text-slate-600">Harga</th>
                            <th className="text-right py-1 text-slate-600">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sale.details?.map((detail, index) => (
                            <tr key={index} className="border-b border-slate-100">
                                <td className="py-1 text-slate-800">
                                    <div className="font-medium">{detail.product?.name || 'Produk'}</div>
                                    <div className="text-[10px] text-slate-500">{detail.product?.sku || ''}</div>
                                </td>
                                <td className="text-center py-1 text-slate-800">{detail.quantity}</td>
                                <td className="text-right py-1 text-slate-800">{useRupiahFormat(detail.price)}</td>
                                <td className="text-right py-1 text-slate-800 font-medium">{useRupiahFormat(detail.subtotal)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className="space-y-2 mb-4 border-b border-dashed border-slate-300 pb-4">
                <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Total Belanja:</span>
                    <span className="font-bold text-slate-800">{useRupiahFormat(sale.total_price)}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Uang Diterima:</span>
                    <span className="font-semibold text-slate-800">{useRupiahFormat(sale.money_received)}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Uang Kembalian:</span>
                    <span className="font-bold text-emerald-600">{useRupiahFormat(sale.money_change)}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-slate-600">
                <p className="mb-2">Terima kasih atas kunjungan Anda!</p>
                <p className="text-[10px] text-slate-500">Barang yang sudah dibeli tidak dapat ditukar/dikembalikan</p>
            </div>
        </div>
    );
}
