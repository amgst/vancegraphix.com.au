import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Settings, LogOut, Globe, Store, Inbox, X, Bell } from 'lucide-react';
import { NotificationContext } from './NotificationProvider';

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen = false, onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { permission, requestPermission } = useContext(NotificationContext);

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        // In a real app, clear auth tokens here
        navigate('/admin/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Messages', path: '/admin/messages', icon: Inbox },
        { name: 'Tools', path: '/admin/tools', icon: FolderOpen },
        { name: 'Portfolio', path: '/admin/portfolio', icon: FolderOpen },
        { name: 'Web Registry', path: '/admin/web-registry', icon: Globe },
        { name: 'Print Portfolio', path: '/admin/print-portfolio', icon: FolderOpen },
        { name: 'Services', path: '/admin/services', icon: FolderOpen },
        { name: 'Blog', path: '/admin/blog', icon: FolderOpen },
        { name: 'Ready Sites', path: '/admin/ready-sites', icon: Store },
        { name: 'Store', path: '/admin/store', icon: Store },
        { name: 'Orders', path: '/admin/orders', icon: Inbox },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    const sidebarClasses = `
        bg-slate-900 text-white min-h-screen flex flex-col
        fixed md:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `;

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <div className={sidebarClasses}>
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <span>wb<span className="text-blue-500">ify</span> Admin</span>
                    </div>
                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="md:hidden text-slate-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => onClose && onClose()} // Close sidebar on navigation on mobile
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800 space-y-2">
                    {permission === 'default' && (
                        <button
                            onClick={requestPermission}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-yellow-400 hover:bg-slate-800 hover:text-yellow-300 transition-colors"
                        >
                            <Bell size={20} />
                            <span className="font-medium">Enable Alerts</span>
                        </button>
                    )}
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        <Globe size={20} />
                        <span className="font-medium">View Website</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;
