import React, { useRef } from "react";
import ThermalReceipt from "./ThermalReceipt";

export default function PrintReceiptModal({
    isOpen,
    onClose,
    sale,
    onNewTransaction,
}) {
    const receiptRef = useRef(null);

    const handlePrint = () => {
        // Set document title with date for PDF filename
        const date = new Date(sale.created_at);
        const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD format
        const originalTitle = document.title;
        document.title = `Struk-${sale.invoice_number}-${dateStr}`;

        window.print();

        // Restore original title after print dialog closes
        setTimeout(() => {
            document.title = originalTitle;
        }, 1000);
    };

    if (!isOpen || !sale) return null;

    return (
        <>
            {/* Print Styles */}
            <style>{`
            @media print {
                * {
                    visibility: hidden;
                }

                #thermal-receipt-content,
                #thermal-receipt-content * {
                    visibility: visible;
                }

                body {
                    margin: 0;
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                #thermal-receipt-content {
                    position: static;
                    width: 80mm;
                }

                @page {
                    margin: 0;
                }
            }
            `}</style>

            {/* Modal Overlay (hidden during print) */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print">
                <div className="bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden transition-all duration-300 flex flex-col">
                    {/* Receipt Preview */}
                    <div className="flex-1 overflow-y-auto max-h-[60vh] bg-slate-100 p-6">
                        <div ref={receiptRef}>
                            <ThermalReceipt sale={sale} />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 no-print">
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handlePrint}
                                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-semibold"
                            >
                                <i className="fas fa-print mr-2"></i>
                                Cetak Struk
                            </button>
                            <button
                                onClick={onNewTransaction}
                                className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-semibold"
                            >
                                <i className="fas fa-plus mr-2"></i>
                                Transaksi Baru
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
