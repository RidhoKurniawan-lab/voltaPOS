import { Link } from "@inertiajs/react";
import React from "react";

export default function LinkButton({href, className, icon, children }) {
    return (
        <Link href={href}
        className={`inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-emerald-600/30 ${className}`}>
            <i className={`${icon} text-xs`}></i>
            {children}
        </Link>
    );
}
