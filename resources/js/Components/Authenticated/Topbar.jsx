import React from "react";
import { usePage } from "@inertiajs/react";

export default function Topbar({ toggleSidebar }) {
    const { auth } = usePage().props;

    return (
        <header className="bg-white border-b border-slate-200 shadow-sm print:hidden">
            <div className="flex items-center justify-between px-4 lg:px-6 py-3 gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-slate-600 hover:text-emerald-600 transition-colors cursor-pointer"
                    >
                        <i className="fas fa-bars text-xl"></i>
                    </button>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="hidden md:flex flex-col items-end mr-1">
                        <span className="text-sm font-semibold text-slate-700 truncate max-w-40">
                            {auth?.user?.name || "User"}
                        </span>
                        <span className="text-xs text-slate-500 capitalize">
                            {auth?.user?.role || "guest"}
                        </span>
                    </div>

                    <button className="relative w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-emerald-600 transition-colors">
                        <i className="fas fa-bell text-lg"></i>
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            3
                        </span>
                    </button>

                    <button className="sm:hidden text-slate-500 hover:text-emerald-600 transition-colors">
                        <i className="fas fa-search text-lg"></i>
                    </button>
                </div>
            </div>

            <div id="searchMobile" className="hidden px-4 pb-3 sm:hidden">
                <div className="flex items-center bg-slate-100 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-emerald-600/20 focus-within:border-emerald-600 transition-all">
                    <i className="fas fa-search text-slate-400 text-sm"></i>
                    <input
                        type="text"
                        placeholder="Cari..."
                        className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-700 placeholder-slate-400"
                    />
                </div>
            </div>
        </header>
    );
}
