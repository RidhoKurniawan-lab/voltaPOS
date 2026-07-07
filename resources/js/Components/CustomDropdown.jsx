import React from "react";

export default function CustomDropdown({ data, onSelect }) {

    return (
        <div>
            <div className="absolute z-20 w-full mt-1 bg-white border border-stone-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {data.length > 0 && (
                    <div className="p-2 space-y-0.5">
                        {data.map((item, key) => (
                            <div
                                key={key}
                                className="bean-item px-3 py-2.5 hover:bg-amber-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-amber-200"
                                onMouseDown={() => onSelect(item)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-stone-800">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-stone-500">
                                            {item.species} •{" "}
                                            {item.processing_method} • Grade:{" "}
                                            {item.grade}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-stone-500">
                                            Stok
                                        </p>
                                        <p className="text-sm font-semibold text-green-700">
                                            {item.stock_kg} kg
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* No Results */}
                {data.length < 1 && (
                    <div className="p-4 text-center">
                        <p className="text-sm text-stone-500">
                            Kopi tidak ditemukan
                        </p>
                        {/* <a
                            href="#"
                            className="text-xs text-amber-700 hover:text-amber-900 font-medium mt-1 inline-block"
                        >
                            + Tambah kopi baru
                        </a> */}
                    </div>
                )}
            </div>
        </div>
    );
}
