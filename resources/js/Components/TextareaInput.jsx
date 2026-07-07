import React from "react";

export default function TextareaInput({ label, ...props }) {
    return (
        <div>
            {label && (
                <label
                    htmlFor={props.id}
                    className="block text-sm font-medium text-slate-800 mb-1.5"
                >
                    {label}
                </label>
            )}
            <textarea
                {...props}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all resize-none"
            ></textarea>
        </div>
    );
}
