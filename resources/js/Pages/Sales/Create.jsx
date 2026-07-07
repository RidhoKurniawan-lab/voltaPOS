import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layout/AuthenticatedLayout";
import { Link, usePage } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import SubmitButton from "@/Components/SubmitButton";
import PrintReceiptModal from "@/Components/PrintReceiptModal";
import { route } from "ziggy-js";
import useSaleForm from "@/Hook/FormHook/useSaleForm";
import { useRupiahFormat } from "@/Hook/useRupiahFormat";

const Create = ({ products, invoice_number, sale_for_print }) => {
    const { auth } = usePage().props;
    const {
        data,
        setData,
        processing,
        errors,
        updateItem,
        addItem,
        removeItem,
        grandTotal,
        moneyChange,
        submit,
        reset,
    } = useSaleForm(invoice_number);

    const [productSearch, setProductSearch] = useState({});
    const [showProductDropdown, setShowProductDropdown] = useState({});
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [saleForPrint, setSaleForPrint] = useState(null);

    useEffect(() => {
        if (sale_for_print) {
            setSaleForPrint(sale_for_print);
            setShowPrintModal(true);
        }
    }, [sale_for_print]);

    const handleNewTransaction = () => {
        setShowPrintModal(false);
        setSaleForPrint(null);
        reset();
        // Reload page to get new invoice number
        window.location.href = route("sales.create");
    };

    useEffect(() => {
        const lastIndex = data.items.length - 1;
        const inputId = `product-search-${lastIndex}`;
        const inputEl = document.getElementById(inputId);
        if (inputEl && data.items[lastIndex].product_id === "") {
            inputEl.focus();
        }
    }, [data.items.length]);

    const handleKeyPress = (e, index, field) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (field === "product") {
                document.getElementById(`qty-${index}`)?.focus();
            } else if (field === "qty") {
                document.getElementById(`price-${index}`)?.focus();
            } else if (field === "price") {
                if (index === data.items.length - 1) {
                    addItem();
                } else {
                    document
                        .getElementById(`product-search-${index + 1}`)
                        ?.focus();
                }
            } else if (field === "money_received") {
                document.getElementById("submit-sale")?.click();
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <Link
                    href={route("dashboard")}
                    className="hover:text-emerald-600 transition-colors"
                >
                    Dashboard
                </Link>
                <i className="fas fa-chevron-right text-xs"></i>
                <Link
                    href={route("sales.index")}
                    className="hover:text-emerald-600 transition-colors"
                >
                    Penjualan
                </Link>
                <i className="fas fa-chevron-right text-xs"></i>
                <span className="text-slate-800 font-medium">Kasir</span>
            </nav>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Kasir / Penjualan
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Catat transaksi penjualan ke pelanggan dan perbarui stok
                        produk
                    </p>
                </div>
                <Link
                    href={route("sales.index")}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-300 text-sm font-medium rounded-lg transition-all duration-200"
                >
                    <i className="fas fa-arrow-left text-xs"></i>
                    Kembali ke Riwayat
                </Link>
            </div>

            <form onSubmit={submit}>
                <div className="grid grid-cols-1 gap-6">
                    {/* Info Header */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                            <i className="fas fa-file-invoice text-emerald-600"></i>
                            Informasi Transaksi
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-slate-800 text-sm font-medium mb-1.5">
                                    No. Invoice
                                </label>
                                <div className="relative">
                                    <i className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 fas fa-hashtag"></i>
                                    <input
                                        type="text"
                                        disabled
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-sm cursor-not-allowed"
                                        value={data.invoice_number}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-800 text-sm font-medium mb-1.5">
                                    Kasir
                                </label>
                                <div className="relative">
                                    <i className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 fas fa-user-circle"></i>
                                    <input
                                        type="text"
                                        disabled
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm cursor-not-allowed"
                                        value={auth.user?.name || "Kasir"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible">
                        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-shopping-cart text-emerald-600"></i>
                                </div>
                                <div>
                                    <h2 className="font-semibold text-slate-800">
                                        Keranjang Belanja
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Scan barcode atau cari produk, tentukan
                                        jumlah
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={addItem}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold rounded-lg transition-colors border border-emerald-200"
                            >
                                <i className="fas fa-plus"></i>
                                Tambah Baris
                            </button>
                        </div>

                        {errors.items && (
                            <div className="px-6 py-2 bg-red-50 border-b border-red-100">
                                <p className="text-sm text-red-500">
                                    {errors.items}
                                </p>
                            </div>
                        )}

                        <div className="overflow-visible">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-left">
                                        <th className="px-5 py-3.5 w-12 text-center">
                                            #
                                        </th>
                                        <th className="px-5 py-3.5 min-w-[350px] w-full sm:w-96">
                                            Produk
                                        </th>
                                        <th className="px-5 py-3.5 w-36">
                                            Qty
                                        </th>
                                        <th className="px-5 py-3.5 w-48">
                                            Harga Jual
                                        </th>
                                        <th className="px-5 py-3.5 w-48 text-right">
                                            Subtotal
                                        </th>
                                        <th className="px-5 py-3.5 w-16 text-center">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {data.items.map((item, index) => {
                                        const selectedProduct = products.find(
                                            (p) => p.id === item.product_id,
                                        );
                                        const rowSearch =
                                            productSearch[index] || "";

                                        const filteredProducts =
                                            products.filter(
                                                (p) =>
                                                    p.name
                                                        .toLowerCase()
                                                        .includes(
                                                            rowSearch.toLowerCase(),
                                                        ) ||
                                                    p.sku
                                                        .toLowerCase()
                                                        .includes(
                                                            rowSearch.toLowerCase(),
                                                        ),
                                            );

                                        return (
                                            <tr
                                                key={index}
                                                className="hover:bg-slate-50/50 transition-colors"
                                            >
                                                <td className="px-5 py-4 text-center font-medium text-slate-500">
                                                    {index + 1}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            id={`product-search-${index}`}
                                                            placeholder="Cari Produk atau SKU..."
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all text-sm"
                                                            value={
                                                                selectedProduct
                                                                    ? selectedProduct.name
                                                                    : rowSearch
                                                            }
                                                            onChange={(e) => {
                                                                const val =
                                                                    e.target
                                                                        .value;
                                                                setProductSearch(
                                                                    {
                                                                        ...productSearch,
                                                                        [index]:
                                                                            val,
                                                                    },
                                                                );
                                                                setShowProductDropdown(
                                                                    {
                                                                        ...showProductDropdown,
                                                                        [index]: true,
                                                                    },
                                                                );
                                                                if (
                                                                    val ===
                                                                        "" ||
                                                                    selectedProduct
                                                                ) {
                                                                    updateItem(
                                                                        index,
                                                                        "product_id",
                                                                        "",
                                                                    );
                                                                }
                                                            }}
                                                            onFocus={() =>
                                                                setShowProductDropdown(
                                                                    {
                                                                        ...showProductDropdown,
                                                                        [index]: true,
                                                                    },
                                                                )
                                                            }
                                                            onBlur={() => {
                                                                setTimeout(
                                                                    () => {
                                                                        setShowProductDropdown(
                                                                            (
                                                                                prev,
                                                                            ) => ({
                                                                                ...prev,
                                                                                [index]: false,
                                                                            }),
                                                                        );
                                                                    },
                                                                    200,
                                                                );
                                                            }}
                                                            onKeyDown={(e) =>
                                                                handleKeyPress(
                                                                    e,
                                                                    index,
                                                                    "product",
                                                                )
                                                            }
                                                        />
                                                        {item.product_id && (
                                                            <button
                                                                type="button"
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
                                                                onClick={() => {
                                                                    updateItem(
                                                                        index,
                                                                        "product_id",
                                                                        "",
                                                                    );
                                                                    setProductSearch(
                                                                        {
                                                                            ...productSearch,
                                                                            [index]:
                                                                                "",
                                                                        },
                                                                    );
                                                                }}
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        )}

                                                        {showProductDropdown[
                                                            index
                                                        ] &&
                                                            !item.product_id &&
                                                            filteredProducts.length >
                                                                0 && (
                                                                <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto min-w-[350px] sm:w-96">
                                                                    {filteredProducts.map(
                                                                        (p) => (
                                                                            <div
                                                                                key={
                                                                                    p.id
                                                                                }
                                                                                className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm"
                                                                                onMouseDown={() => {
                                                                                    updateItem(
                                                                                        index,
                                                                                        {
                                                                                            product_id:
                                                                                                p.id,
                                                                                            price:
                                                                                                p.price_sell ||
                                                                                                0,
                                                                                        },
                                                                                    );
                                                                                    setProductSearch(
                                                                                        {
                                                                                            ...productSearch,
                                                                                            [index]:
                                                                                                p.name,
                                                                                        },
                                                                                    );
                                                                                    setShowProductDropdown(
                                                                                        {
                                                                                            ...showProductDropdown,
                                                                                            [index]: false,
                                                                                        },
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <div className="flex justify-between items-center">
                                                                                    <div>
                                                                                        <span className="font-semibold text-slate-800">
                                                                                            {
                                                                                                p.name
                                                                                            }
                                                                                        </span>
                                                                                        <span className="text-xs text-slate-500 ml-2 font-mono">
                                                                                            {
                                                                                                p.sku
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="text-right">
                                                                                        <span className="text-xs font-medium text-emerald-600">
                                                                                            {useRupiahFormat(
                                                                                                p.price_sell,
                                                                                            )}
                                                                                        </span>
                                                                                        <span className="text-xs text-slate-500 ml-2">
                                                                                            Stok:{" "}
                                                                                            {
                                                                                                p.stock
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            )}

                                                        {showProductDropdown[
                                                            index
                                                        ] &&
                                                            !item.product_id &&
                                                            filteredProducts.length ===
                                                                0 && (
                                                                <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-4 text-center text-sm text-slate-500">
                                                                    Produk tidak
                                                                    ditemukan
                                                                </div>
                                                            )}
                                                    </div>

                                                    {errors[
                                                        `items.${index}.product_id`
                                                    ] && (
                                                        <p className="mt-1 text-xs text-red-500">
                                                            {
                                                                errors[
                                                                    `items.${index}.product_id`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <input
                                                        type="number"
                                                        id={`qty-${index}`}
                                                        placeholder="0"
                                                        min="0.01"
                                                        step="any"
                                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all text-base font-medium"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            updateItem(
                                                                index,
                                                                "quantity",
                                                                e.target.value,
                                                            )
                                                        }
                                                        onKeyDown={(e) =>
                                                            handleKeyPress(
                                                                e,
                                                                index,
                                                                "qty",
                                                            )
                                                        }
                                                    />
                                                    {errors[
                                                        `items.${index}.quantity`
                                                    ] && (
                                                        <p className="mt-1 text-xs text-red-500">
                                                            {
                                                                errors[
                                                                    `items.${index}.quantity`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base font-medium">
                                                            Rp
                                                        </span>
                                                        <input
                                                            type="number"
                                                            id={`price-${index}`}
                                                            placeholder="0"
                                                            className="w-full pl-11 pr-4 py-2 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all text-base font-medium"
                                                            value={item.price}
                                                            onChange={(e) =>
                                                                updateItem(
                                                                    index,
                                                                    "price",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            onKeyDown={(e) =>
                                                                handleKeyPress(
                                                                    e,
                                                                    index,
                                                                    "price",
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    {errors[
                                                        `items.${index}.price`
                                                    ] && (
                                                        <p className="mt-1 text-xs text-red-500">
                                                            {
                                                                errors[
                                                                    `items.${index}.price`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4 text-right font-semibold text-slate-800 text-base whitespace-nowrap">
                                                    {useRupiahFormat(
                                                        item.subtotal || 0,
                                                    )}
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            data.items.length <=
                                                            1
                                                        }
                                                        onClick={() =>
                                                            removeItem(index)
                                                        }
                                                        className={`p-2 rounded-lg transition-colors ${
                                                            data.items.length <=
                                                            1
                                                                ? "text-slate-300 cursor-not-allowed"
                                                                : "text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                        }`}
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                            <i className="fas fa-cash-register text-emerald-600"></i>
                            Ringkasan Pembayaran
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                                    Total Harga
                                </span>
                                <span className="text-2xl font-black text-slate-800">
                                    {useRupiahFormat(grandTotal)}
                                </span>
                            </div>

                            <div>
                                <label className="block text-slate-800 text-sm font-medium mb-1.5">
                                    Uang Diterima{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                                        Rp
                                    </span>
                                    <input
                                        type="number"
                                        id="money-received"
                                        placeholder="0"
                                        min="0"
                                        step="any"
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-slate-800 text-lg font-semibold focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all"
                                        value={data.money_received}
                                        onChange={(e) =>
                                            setData(
                                                "money_received",
                                                e.target.value,
                                            )
                                        }
                                        onKeyDown={(e) =>
                                            handleKeyPress(
                                                e,
                                                0,
                                                "money_received",
                                            )
                                        }
                                    />
                                </div>
                                {errors.money_received && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.money_received}
                                    </p>
                                )}
                            </div>

                            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                                <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-1">
                                    Kembalian
                                </p>
                                <p
                                    className={`text-3xl font-black ${moneyChange >= 0 ? "text-emerald-700" : "text-red-600"}`}
                                >
                                    {useRupiahFormat(Math.max(moneyChange, 0))}
                                </p>
                                {moneyChange < 0 && (
                                    <p className="text-xs text-red-500 mt-1">
                                        Kurang{" "}
                                        {useRupiahFormat(Math.abs(moneyChange))}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <SubmitButton
                                id="submit-sale"
                                icon="fas fa-check"
                                loading={processing}
                                disabled={processing}
                                className="px-6 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                            >
                                Simpan Transaksi
                            </SubmitButton>

                            <Link
                                href={route("sales.index")}
                                className="inline-flex items-center justify-center w-full gap-2 px-5 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-all duration-200"
                            >
                                Batal
                            </Link>
                        </div>
                    </div>
                </div>
            </form>

            {/* Print Receipt Modal */}
            <PrintReceiptModal
                isOpen={showPrintModal}
                onClose={() => {
                    setShowPrintModal(false);
                    setSaleForPrint(null);
                }}
                sale={saleForPrint}
                onNewTransaction={handleNewTransaction}
            />
        </div>
    );
};

Create.layout = (page) => <AuthenticatedLayout children={page} />;

export default Create;
