import React, { Children } from "react";
import TableHeader from "./TableHeader";

export default function Table({ tableHeader, children }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-stone-50 border-b border-stone-200">
                        <TableHeader headerList={tableHeader} />
                    </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">

                    {children}

                </tbody>
            </table>
        </div>
    );
}
