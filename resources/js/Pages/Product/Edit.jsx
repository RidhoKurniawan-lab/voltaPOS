import React from "react";
import AuthenticatedLayout from "@/Layout/AuthenticatedLayout";
import SubmitButton from "@/Components/SubmitButton";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import { route } from "ziggy-js";
import { useForm } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { useCurrency } from "../../Hook/useRupiahFormat";

const Edit = ({ product, categories }) => {
    const { data, setData, put, processing, errors, reset } = useForm({
        category_id: product.category_id || "",
        name: product.name || "",
        price_buy: product.price_buy || "",
        price_sell: product.price_sell || "",
        description: product.description || "",
        stock: product.stock || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("products.update", product.id));
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <Link href={route("dashboard")} className="hover:text-emerald-600 transition-colors">
                    Dashboard
                </Link>
                <i className="fas fa-chevron-right text-xs"></i>
                <Link href={route("products.index")} className="hover:text-emerald-600 transition-colors">
                    Produk
                </Link>
                <i className="fas fa-chevron-right text-xs"></i>
                <span className="text-slate-800 font-medium">
                    Edit Produk
                </span>
            </nav>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Edit Produk
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Perbarui detail produk untuk Point of Sale
                    </p>
                </div>
                <Link
                    href={route("products.index")}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-300 text-sm font-medium rounded-lg transition-all duration-200"
                >
                    <i className="fas fa-arrow-left text-xs"></i>
                    Kembali
                </Link>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Card Header */}
                <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-edit text-emerald-600"></i>
                        </div>
                        <div>
                            <h2 className="font-semibold text-slate-800">
                                Edit Informasi Produk
                            </h2>
                            <p className="text-xs text-slate-500">
                                Field bertanda <span className="text-red-500">*</span> wajib diisi
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Informasi Dasar */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-emerald-600 rounded-full"></span>
                            Informasi Dasar
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Nama Produk */}
                            <div className="md:col-span-2">
                                <TextInput
                                    label="Nama Produk"
                                    name="name"
                                    icon="fas fa-tag"
                                    type="text"
                                    id="productName"
                                    errors={errors}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Kopi Gayo 250gr"
                                    required
                                />
                                <p className="text-xs text-slate-400 mt-1.5">
                                    Maksimal 100 karakter
                                </p>
                            </div>

                            {/* Kategori */}
                            <div className="md:col-span-2">
                                <SelectInput
                                    label="Kategori"
                                    name="category_id"
                                    icon="fas fa-folder"
                                    default="Pilih Kategori"
                                    errors={errors}
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    required
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories?.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </SelectInput>
                            </div>

                            {/* Deskripsi */}
                            <div className="md:col-span-2">
                                <TextInput
                                    label="Deskripsi"
                                    name="description"
                                    icon="fas fa-align-left"
                                    type="text"
                                    id="description"
                                    errors={errors}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Deskripsi singkat produk..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Harga & Stok */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-emerald-600 rounded-full"></span>
                            Harga & Stok
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* Harga Beli */}
                            <div>
                                <TextInput
                                    label="Harga Beli"
                                    name="price_buy"
                                    icon="fas fa-arrow-down"
                                    type="text"
                                    id="price_buy"
                                    placeholder="0"
                                    errors={errors}
                                    value={useCurrency(data.price_buy)}
                                    onChange={(e) => setData('price_buy', e.target.value.replace(/\D/g, ""))}
                                    required
                                />
                                <p className="text-xs text-slate-400 mt-1.5">
                                    Harga modal per unit
                                </p>
                            </div>

                            {/* Harga Jual */}
                            <div>
                                <TextInput
                                    label="Harga Jual"
                                    name="price_sell"
                                    icon="fas fa-arrow-up"
                                    type="text"
                                    id="price_sell"
                                    placeholder="0"
                                    errors={errors}
                                    value={useCurrency(data.price_sell)}
                                    onChange={(e) => setData('price_sell', e.target.value.replace(/\D/g, ""))}
                                    required
                                />
                                <p className="text-xs text-slate-400 mt-1.5">
                                    Harga jual ke pelanggan
                                </p>
                            </div>

                            {/* Stok */}
                            <div>
                                <TextInput
                                    label="Stok"
                                    name="stock"
                                    icon="fas fa-boxes"
                                    type="number"
                                    id="stock"
                                    placeholder="0"
                                    errors={errors}
                                    value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)}
                                    required
                                />
                                <p className="text-xs text-slate-400 mt-1.5">
                                    Jumlah stok produk
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-slate-200">
                        <button
                            type="reset"
                            onClick={() => reset()}
                            className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-300 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 sm:ml-auto"
                        >
                            <i className="fas fa-undo text-xs"></i>
                            Reset Form
                        </button>
                        <SubmitButton
                            icon="fas fa-save"
                            loading={processing}
                            className="sm:w-auto px-6 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                        >
                            Update Produk
                        </SubmitButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

Edit.layout = (page) => <AuthenticatedLayout children={page} />;

export default Edit;
