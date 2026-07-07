import React from "react";
import { usePagination } from "../../Hook/usePagination";
import { Link } from "@inertiajs/react";

export default function TableFooter({ paginate }) {
    const { from, to, total, getLabel, getVisibleLinks } =
        usePagination(paginate);

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-t border-slate-200 gap-4">
            <p className="text-sm text-slate-500">
                Menampilkan {from}-{to} dari {total} data
            </p>

            <div className="flex items-center gap-1">
                {getVisibleLinks().map((link) => {
                    const label = getLabel(link.label);

                    if (link.active) {
                        return (
                            <button
                                key={link.label}
                                className="px-3.5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                {label}
                            </button>
                        );
                    }

                    // disable previous and next
                    if (!link.url) {
                        return (
                            <button
                                key={link.label}
                                className="px-3.5 py-2 border border-slate-200 rounded-lg text-slate-300 text-sm transition-colors cursor-not-allowed"
                            >
                                {label}
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={link.label}
                            href={link.url}
                            className="px-3.5 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-300 text-sm transition-all duration-200"
                        >
                            {label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
