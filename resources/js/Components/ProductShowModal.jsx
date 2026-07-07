import React from "react";
import Modal from "./Modal";
import { useRupiahFormat } from "@/Hook/useRupiahFormat";
import { route } from "ziggy-js";

export default function ProductShowModal({ isOpen, onClose, product }) {
    if (!product) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detail Produk" size="lg">
            <div className="space-y-6">
                {/* Product Image & Name */}
                <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-20 rounded-xl object-cover border border-slate-200"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <i className="fas fa-box text-3xl text-emerald-600"></i>
                        </div>
                    )}
                    <div>
                        <h4 className="text-xl font-bold text-slate-800">
                            {product.name}
                        </h4>
                        <span className="inline-flex px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
                            {product.category?.name || "Tidak ada kategori"}
                        </span>
                    </div>
                </div>

                {/* Product Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* SKU */}
                    <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                            SKU
                        </p>
                        <p className="text-sm font-mono font-semibold text-slate-800 mt-1">
                            {product.sku || "-"}
                        </p>
                    </div>

                    {/* Kategori */}
                    <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                            Kategori
                        </p>
                        <p className="text-sm font-semibold text-slate-800 mt-1">
                            {product.category?.name || "-"}
                        </p>
                    </div>

                    {/* Harga Beli */}
                    <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                            Harga Beli
                        </p>
                        <p className="text-sm font-semibold text-slate-800 mt-1">
                            {useRupiahFormat(product.price_buy || 0)}
                        </p>
                    </div>

                    {/* Harga Jual */}
                    <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                            Harga Jual
                        </p>
                        <p className="text-sm font-semibold text-emerald-600 mt-1">
                            {useRupiahFormat(product.price_sell || 0)}
                        </p>
                    </div>

                    {/* Stok */}
                    <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                            Stok
                        </p>
                        <p className="text-sm font-semibold text-slate-800 mt-1">
                            <span
                                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    product.stock <= 5
                                        ? "bg-red-100 text-red-700"
                                        : product.stock <= 10
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-emerald-100 text-emerald-700"
                                }`}
                            >
                                {product.stock || 0}
                            </span>
                        </p>
                    </div>

                    {/* Tanggal Dibuat */}
                    <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                            Tanggal Dibuat
                        </p>
                        <p className="text-sm font-semibold text-slate-800 mt-1">
                            {product.created_at
                                ? new Date(product.created_at).toLocaleDateString(
                                      "id-ID",
                                      {
                                          day: "numeric",
                                          month: "long",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      }
                                  )
                                : "-"}
                        </p>
                    </div>
                </div>

                {/* Description */}
                {product.description && (
                    <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                            Deskripsi
                        </p>
                        <p className="text-sm text-slate-700">
                            {product.description}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                    >
                        Tutup
                    </button>
                    <a
                        href={route("products.edit", product.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
                    >
                        <i className="fas fa-edit text-xs"></i>
                        Edit Produk
                    </a>
                </div>
            </div>
        </Modal>
    );
}
