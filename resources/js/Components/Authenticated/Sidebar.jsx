import React from "react";
import NavLink from "./NavLink";
import { route } from "ziggy-js";
import { showConfirm } from "@/Utils/swal";
import { router, usePage } from "@inertiajs/react";

export default function Sidebar({ isOpen, toggleSidebar }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const isAdmin = user?.role === "admin";
    const isPetugas = user?.role === "petugas";

    const handleLogout = (e) => {
        e.preventDefault();

        showConfirm("Logout?", "Are you sure you want to leave?", "Leave").then(
            (result) => {
                if (result.isConfirmed) {
                    router.post(route("logout"));
                }
            },
        );
    };

    return (
        <>
            {/* Sidebar Overlay Mobile */}
            <div
                className={`fixed inset-0 bg-black/50 z-20 ${isOpen ? "hidden" : ""} lg:hidden cursor-pointer`}
                onClick={toggleSidebar}
            ></div>
            <aside
                className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 shadow-sm z-30 transform ${isOpen ? "-translate-x-full" : ""} lg:translate-x-0 transition-transform duration-300 flex flex-col print:hidden`}
            >
                {/* Sidebar Header */}
                <div className="p-5 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                            <i className="fas fa-coins text-white text-lg"></i>
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-slate-800">
                                VoltaPOS
                            </h1>
                            <p className="text-xs text-slate-500">
                                Admin Panel
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
                        Main Menu
                    </p>

                    {(isAdmin || isPetugas) && (
                        <NavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                            icon="fas fa-th-large"
                        >
                            Dashboard
                        </NavLink>
                    )}

                    {isAdmin && (
                        <NavLink
                            href={route("products.index")}
                            active={route().current("products.*")}
                            icon="fas fa-box"
                        >
                            Product
                        </NavLink>
                    )}

                    {isAdmin && (
                        <NavLink
                            href={route("categories.index")}
                            active={route().current("categories.*")}
                            icon="fas fa-tags"
                        >
                            Kategori
                        </NavLink>
                    )}

                    {isAdmin && (
                        <NavLink
                            href={route("suppliers.index")}
                            active={route().current("suppliers.*")}
                            icon="fas fa-user-tie"
                        >
                            Supplier
                        </NavLink>
                    )}

                    {isAdmin && (
                        <NavLink
                            href={route("purchases.index")}
                            active={route().current("purchases.*")}
                            icon="fas fa-shopping-bag"
                        >
                            Pembelian
                        </NavLink>
                    )}

                    {(isAdmin || isPetugas) && (
                        <NavLink
                            href={route("sales.index")}
                            active={route().current("sales.index")}
                            icon="fas fa-cash-register"
                        >
                            Penjualan
                        </NavLink>
                    )}

                    {(isAdmin || isPetugas) && (
                        <NavLink
                            href={route("sales.create")}
                            active={route().current("sales.create")}
                            icon="fas fa-shopping-cart"
                        >
                            Kasir
                        </NavLink>
                    )}

                    {isAdmin && (
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 mt-6 px-2">
                            Lainnya
                        </p>
                    )}

                    {isAdmin && (
                        <NavLink
                            href={route("register")}
                            active={route().current("register.*")}
                            icon="fas fa-user-plus"
                        >
                            Tambah Kasir
                        </NavLink>
                    )}

                    {isAdmin && (
                        <NavLink
                            href={route("reports.index")}
                            active={route().current("reports.*")}
                            icon="fas fa-chart-bar"
                        >
                            Laporan
                        </NavLink>
                    )}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center gap-3 px-2">
                        <img
                            src="https://ui-avatars.com/api/?name=Admin&background=059669&color=fff&size=32"
                            alt="Avatar"
                            className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">
                                Admin Utama
                            </p>
                            <p className="text-xs text-slate-500">
                                Administrator
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                        >
                            <i className="fas fa-sign-out-alt text-sm"></i>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
