import React, { useState } from "react";
import Sidebar from "@/Components/Authenticated/Sidebar";
import Topbar from "@/Components/Authenticated/Topbar";
import useFlashMessages from "@/Hook/useFlashMessage";

export default function AuthenticatedLayout({ children }) {
    useFlashMessages();

    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <div className="flex h-screen overflow-hidden bg-transparent print:block print:h-auto print:overflow-visible print:bg-white">
            {/* Sidebar */}
            <Sidebar toggleSidebar={toggleSidebar} isOpen={isOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden print:block print:overflow-visible print:bg-white">
                {/* Top Navbar */}
                <Topbar toggleSidebar={toggleSidebar} />

                <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50 print:bg-white print:p-0 print:overflow-visible">
                    {/* Content Area */}
                    {children}
                </main>
            </div>
        </div>
    );
}
