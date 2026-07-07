import { Link } from "@inertiajs/react";
import React from "react";

export default function NavLink({ href, active, icon, children }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                active
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-slate-600 hover:bg-slate-100 hover:text-emerald-600"
            }`}
        >
            <i className={`${icon} w-5 text-center`}></i>
            <span>
                {children}
            </span>
        </Link>
    );
}
