import React from "react";
import AuthenticatedLayout from "@/Layout/AuthenticatedLayout";
import SubmitButton from "@/Components/SubmitButton";
import TextInput from "@/Components/TextInput";
import { route } from "ziggy-js";
import { useForm, Link } from "@inertiajs/react";

const Edit = ({ supplier }) => {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: supplier.name || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("suppliers.update", supplier.id));
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <Link href={route("dashboard")} className="hover:text-emerald-600 transition-colors">
                    Dashboard
                </Link>
                <i className="fas fa-chevron-right text-xs"></i>
                <Link href={route("suppliers.index")} className="hover:text-emerald-600 transition-colors">
                    Supplier
                </Link>
                <i className="fas fa-chevron-right text-xs"></i>
                <span className="text-slate-800 font-medium">
                    Edit Supplier
                </span>
            </nav>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Edit Supplier
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Ubah detail informasi supplier: {supplier.name}
                    </p>
                </div>
                <Link
                    href={route("suppliers.index")}
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
                            <i className="fas fa-user-tie text-emerald-600"></i>
                        </div>
                        <div>
                            <h2 className="font-semibold text-slate-800">
                                Informasi Supplier
                            </h2>
                            <p className="text-xs text-slate-500">
                                Field bertanda <span className="text-red-500">*</span> wajib diisi
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-emerald-600 rounded-full"></span>
                            Informasi Dasar
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Nama Supplier */}
                            <div className="md:col-span-2">
                                <TextInput
                                    label="Nama Supplier"
                                    name="name"
                                    icon="fas fa-user-tie"
                                    type="text"
                                    id="supplierName"
                                    errors={errors}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: PT. Sumber Makmur"
                                    required
                                />
                                <p className="text-xs text-slate-400 mt-1.5">
                                    Maksimal 255 karakter dan harus unik
                                </p>
                            </div>

                            {/* Nomor Telepon */}
                            <div>
                                <TextInput
                                    label="Nomor Telepon"
                                    name="phone"
                                    icon="fas fa-phone"
                                    type="text"
                                    id="supplierPhone"
                                    errors={errors}
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="Contoh: 081234567890"
                                    required
                                />
                                <p className="text-xs text-slate-400 mt-1.5">
                                    Maksimal 15 karakter angka/teks
                                </p>
                            </div>

                            {/* Alamat */}
                            <div>
                                <TextInput
                                    label="Alamat"
                                    name="address"
                                    icon="fas fa-map-marker-alt"
                                    type="text"
                                    id="supplierAddress"
                                    errors={errors}
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Contoh: Jl. Raya No. 123, Jakarta"
                                    required
                                />
                                <p className="text-xs text-slate-400 mt-1.5">
                                    Maksimal 255 karakter
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-slate-200">
                        <button
                            type="button"
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
                            Simpan Perubahan
                        </SubmitButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

Edit.layout = (page) => <AuthenticatedLayout children={page} />;

export default Edit;
