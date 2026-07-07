import React, { useState, useEffect, useRef } from "react";
import AuthenticatedLayout from "@/Layout/AuthenticatedLayout";
import { Link, usePage } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import SubmitButton from "@/Components/SubmitButton";
import { route } from "ziggy-js";
import usePurchaseForm from "@/Hook/FormHook/usePurchaseForm";
import { useRupiahFormat } from "@/Hook/useRupiahFormat";

const Edit = ({ purchase, suppliers, products }) => {
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
        submit,
    } = usePurchaseForm(purchase);

    // Supplier Dropdown States
    const [supplierSearch, setSupplierSearch] = useState(() => {
        return purchase?.supplier?.name || "";
    });
    const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
    const supplierRef = useRef(null);

    // Product Dropdown States per Row
    const [productSearch, setProductSearch] = useState(() => {
        const initialSearch = {};
        if (purchase?.details) {
            purchase.details.forEach((detail, index) => {
                initialSearch[index] = detail.product?.name || "";
            });
        }
        return initialSearch;
    });
    const [showProductDropdown, setShowProductDropdown] = useState({});

    // Filtered lists
    const filteredSuppliers = suppliers.filter((s) =>
        s.name.toLowerCase().includes(supplierSearch.toLowerCase())
    );

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (supplierRef.current && !supplierRef.current.contains(event.target)) {
                setShowSupplierDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Set selected supplier
    const handleSelectSupplier = (supplier) => {
        setData("supplier_id", supplier.id);
        setSupplierSearch(supplier.name);
        setShowSupplierDropdown(false);
    };

    // Auto-focus new row product search
    useEffect(() => {
        const lastIndex = data.items.length - 1;
        const inputId = `product-search-${lastIndex}`;
        const inputEl = document.getElementById(inputId);
        if (inputEl && data.items[lastIndex].product_id === "") {
            inputEl.focus();
        }
    }, [data.items.length]);

    // Handle keypress focus shifting
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
                    document.getElementById(`product-search-${index + 1}`)?.focus();
                }
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <Link href={route("dashboard")} className="hover:text-emerald-600 transition-colors">
                    Dashboard
                </Link>
                <i className="fas fa-chevron-right text-xs"></i>
                <Link href={route("purchases.index")} className="hover:text-emerald-600 transition-colors">
                    Pembelian
                </Link>
                <i className="fas fa-chevron-right text-xs"></i>
                <span className="text-slate-800 font-medium">Edit Transaksi</span>
            </nav>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Edit Barang Masuk / Pembelian
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Sesuaikan detail pembelian barang masuk dari supplier. Stok produk akan disesuaikan secara otomatis.
                    </p>
                </div>
                <Link
                    href={route("purchases.index")}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-300 text-sm font-medium rounded-lg transition-all duration-200"
                >
                    <i className="fas fa-arrow-left text-xs"></i>
                    Kembali ke Riwayat
                </Link>
            </div>

            <form onSubmit={submit} className="space-y-6">
                {/* Form Utama */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                        <i className="fas fa-file-invoice text-emerald-600"></i>
                        Informasi Utama Pembelian
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                        {/* Supplier Searchable Dropdown */}
                        <div className="relative" ref={supplierRef}>
                            <label className="block text-slate-800 text-sm font-medium mb-1.5 cursor-pointer">
                                Supplier <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <i className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 fas fa-truck"></i>
                                <input
                                    type="text"
                                    placeholder="Cari Supplier..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all text-sm"
                                    value={supplierSearch}
                                    onChange={(e) => {
                                        setSupplierSearch(e.target.value);
                                        setShowSupplierDropdown(true);
                                        if (e.target.value === "") {
                                            setData("supplier_id", "");
                                        }
                                    }}
                                    onFocus={() => setShowSupplierDropdown(true)}
                                />
                                {data.supplier_id && (
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
                                        onClick={() => {
                                            setData("supplier_id", "");
                                            setSupplierSearch("");
                                        }}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                )}
                            </div>

                            {showSupplierDropdown && filteredSuppliers.length > 0 && (
                                <div className="absolute z-30 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {filteredSuppliers.map((s) => (
                                        <div
                                            key={s.id}
                                            className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm text-slate-700"
                                            onClick={() => handleSelectSupplier(s)}
                                        >
                                            <p className="font-semibold text-slate-800">{s.name}</p>
                                            <p className="text-xs text-slate-500">{s.phone}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {showSupplierDropdown && filteredSuppliers.length === 0 && (
                                <div className="absolute z-30 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-4 text-center text-sm text-slate-500">
                                    Supplier tidak ditemukan
                                </div>
                            )}
                            {errors.supplier_id && (
                                <p className="mt-1 text-sm text-red-500">{errors.supplier_id}</p>
                            )}
                        </div>

                        {/* Invoice Number */}
                        <div>
                            <TextInput
                                label={<span>No. Invoice Supplier <span className="text-red-500">*</span></span>}
                                name="invoice_number"
                                icon="fas fa-hashtag"
                                type="text"
                                placeholder="Contoh: INV/2026/001"
                                errors={errors}
                                value={data.invoice_number}
                                onChange={(e) => setData("invoice_number", e.target.value)}
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <TextInput
                                label="Tanggal Pembelian"
                                name="date"
                                icon="fas fa-calendar-alt"
                                type="date"
                                errors={errors}
                                value={data.date}
                                onChange={(e) => setData("date", e.target.value)}
                            />
                        </div>

                        {/* User Login */}
                        <div>
                            <label className="block text-slate-800 text-sm font-medium mb-1.5">
                                Dicatat Oleh
                            </label>
                            <div className="relative">
                                <i className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 fas fa-user-circle"></i>
                                <input
                                    type="text"
                                    disabled
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm cursor-not-allowed"
                                    value={purchase.user?.name || "Administrator"}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabel Item Pembelian */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible">
                    <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-boxes text-emerald-600"></i>
                            </div>
                            <div>
                                <h2 className="font-semibold text-slate-800">Daftar Item Produk</h2>
                                <p className="text-xs text-slate-500">Pilih produk, tentukan jumlah, dan harga belinya</p>
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

                    <div className="overflow-visible">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-left">
                                    <th className="px-5 py-3.5 w-12 text-center">#</th>
                                    <th className="px-5 py-3.5 w-80">Produk</th>
                                    <th className="px-5 py-3.5 w-44">Jumlah (Qty)</th>
                                    <th className="px-5 py-3.5 w-48">Harga Beli per Unit</th>
                                    <th className="px-5 py-3.5 w-48 text-right">Subtotal</th>
                                    <th className="px-5 py-3.5 w-20 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.items.map((item, index) => {
                                    const selectedProduct = products.find((p) => p.id === item.product_id);
                                    const rowSearch = productSearch[index] || "";

                                    // Filter products based on search term
                                    const filteredProducts = products.filter((p) =>
                                        p.name.toLowerCase().includes(rowSearch.toLowerCase()) ||
                                        p.sku.toLowerCase().includes(rowSearch.toLowerCase())
                                    );

                                    return (
                                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
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
                                                        value={selectedProduct ? selectedProduct.name : rowSearch}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setProductSearch({ ...productSearch, [index]: val });
                                                            setShowProductDropdown({ ...showProductDropdown, [index]: true });
                                                            if (val === "" || selectedProduct) {
                                                                updateItem(index, "product_id", "");
                                                            }
                                                        }}
                                                        onFocus={() => setShowProductDropdown({ ...showProductDropdown, [index]: true })}
                                                        onBlur={() => {
                                                            setTimeout(() => {
                                                                setShowProductDropdown(prev => ({ ...prev, [index]: false }));
                                                            }, 200);
                                                        }}
                                                        onKeyDown={(e) => handleKeyPress(e, index, "product")}
                                                    />
                                                    {item.product_id && (
                                                        <button
                                                            type="button"
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
                                                            onClick={() => {
                                                                updateItem(index, "product_id", "");
                                                                setProductSearch({ ...productSearch, [index]: "" });
                                                            }}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    )}

                                                    {/* Dropdown list for products */}
                                                    {showProductDropdown[index] && !item.product_id && filteredProducts.length > 0 && (
                                                        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                            {filteredProducts.map((p) => (
                                                                <div
                                                                    key={p.id}
                                                                    className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm"
                                                                    onMouseDown={() => {
                                                                        updateItem(index, {
                                                                            product_id: p.id,
                                                                            price: p.price_buy || 0
                                                                        });
                                                                        setProductSearch({ ...productSearch, [index]: p.name });
                                                                        setShowProductDropdown({ ...showProductDropdown, [index]: false });
                                                                    }}
                                                                >
                                                                    <div className="flex justify-between items-center">
                                                                        <div>
                                                                            <span className="font-semibold text-slate-800">{p.name}</span>
                                                                            <span className="text-xs text-slate-500 ml-2 font-mono">{p.sku}</span>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <span className="text-xs text-slate-500">Stok: {p.stock}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {errors[`items.${index}.product_id`] && (
                                                    <p className="mt-1 text-xs text-red-500">{errors[`items.${index}.product_id`]}</p>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <input
                                                    type="number"
                                                    id={`qty-${index}`}
                                                    placeholder="0"
                                                    min="0.01"
                                                    step="any"
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all text-sm"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, "quantity", e.target.value)}
                                                    onKeyDown={(e) => handleKeyPress(e, index, "qty")}
                                                />
                                                {errors[`items.${index}.quantity`] && (
                                                    <p className="mt-1 text-xs text-red-500">{errors[`items.${index}.quantity`]}</p>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Rp</span>
                                                    <input
                                                        type="number"
                                                        id={`price-${index}`}
                                                        placeholder="0"
                                                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all text-sm"
                                                        value={item.price}
                                                        onChange={(e) => updateItem(index, "price", e.target.value)}
                                                        onKeyDown={(e) => handleKeyPress(e, index, "price")}
                                                    />
                                                </div>
                                                {errors[`items.${index}.price`] && (
                                                    <p className="mt-1 text-xs text-red-500">{errors[`items.${index}.price`]}</p>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-right font-medium text-slate-800">
                                                {useRupiahFormat(item.subtotal || 0)}
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <button
                                                    type="button"
                                                    disabled={data.items.length <= 1}
                                                    onClick={() => removeItem(index)}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        data.items.length <= 1
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

                {/* Footer Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-xl border border-slate-200 shadow-sm p-6 gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("purchases.index")}
                            className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-all duration-200"
                        >
                            Batal
                        </Link>
                        <SubmitButton
                            icon="fas fa-save"
                            loading={processing}
                            className="px-6 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                        >
                            Simpan Perubahan
                        </SubmitButton>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                            Total Pembelian:
                        </span>
                        <span className="text-3xl font-black text-slate-800">
                            {useRupiahFormat(grandTotal)}
                        </span>
                    </div>
                </div>
            </form>
        </div>
    );
};

Edit.layout = (page) => <AuthenticatedLayout children={page} />;

export default Edit;
