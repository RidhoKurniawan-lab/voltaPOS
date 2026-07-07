import React from "react";

export default function SubmitButton({
    icon,
    children,
    loading,
    className,
    ...props
}) {
    return (
        <button
            type="submit"
            className={`w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-600/30 flex items-center justify-center gap-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${loading ? "cursor-not-allowed opacity-70" : ""} ${className}`}
            {...props}
        >
            {icon && !loading && (
                <i className={`fas fa-arrow-right text-xs ${icon}`}></i>
            )}
            {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {children}
        </button>
    );
}
