import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { Menu } from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            <div className="flex-1 flex flex-col min-w-0"> {/* min-w-0 ensures flex child can shrink properly */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-gray-600 hover:text-gray-900"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-semibold text-slate-800 hidden md:block">Dashboard</h2>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            A
                        </div>
                        <span className="text-sm font-medium text-gray-600 hidden md:block">Admin User</span>
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
