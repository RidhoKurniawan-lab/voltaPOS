import React from "react";

export default function TableHeader({ headerList }) {
    return (
        <>
            {headerList.map((column, index) => (
                <th key={index} className={`text-left px-5 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wider ${column.className}`}>
                    {column.label}
                </th>
            ))}
        </>
    );
}
