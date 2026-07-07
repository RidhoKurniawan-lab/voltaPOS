import React from "react";
import useFlashMessages from "@/Hook/useFlashMessage";

export default function GuestLayout({ children }) {
    useFlashMessages();

    return (
        <section className="min-h-screen bg-linear-to-br from-emerald-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute -top-16 -left-8 w-56 h-56 bg-emerald-500/20 blur-3xl rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-sky-500/15 blur-3xl rounded-full"></div>
            </div>

            <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/95 shadow-2xl overflow-hidden backdrop-blur-xl">
                <div className="flex items-center justify-between px-6 pt-6">
                </div>

                <div className="px-8 pb-8">{children}</div>
            </div>
        </section>
    );
}
