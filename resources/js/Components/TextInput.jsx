import React from "react";

export default function TextInput({
    isPassword,
    icon,
    label,
    togglePassword,
    className,
    errors,
    isShow,
    name,
    RightText,
    ...props
}) {
    return (
        <div className="flex-1">
            {label && (
                <label
                    className="block text-slate-800 text-sm font-medium mb-1.5 cursor-pointer"
                    htmlFor={props.id}
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <i
                        className={`absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 ${icon}`}
                    ></i>
                )}
                <input
                    {...props}
                    className={`w-full ${icon ? "pl-10 pr-4" : "px-4"} py-2.5 border border-slate-300 bg-white rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all text-sm ${className}`}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600"
                    >
                        <i
                            className={`${isShow ? "fas fa-eye-slash" : "fas fa-eye"} text-sm cursor-pointer`}
                        ></i>
                    </button>
                )}
                {RightText && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                        {RightText}
                    </span>
                )}
            </div>
            {errors?.[name] && (
                <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
            )}
        </div>
    );
}
