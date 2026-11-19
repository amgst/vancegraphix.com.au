import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, LogOut, X, Bell, ChevronRight } from 'lucide-react';
import { NotificationContext } from './NotificationProvider';
import { useAuth } from './AuthProvider';
import { adminNavigation } from './navigation';

const AdminSidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen = false, onClose }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { permission, requestPermission } = useContext(NotificationContext);
    const { logout } = useAuth();
    const [error, setError] = useState('');
    const [loggingOut, setLoggingOut] = useState(false);
    const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 959px)').matches);
    useEffect(() => {
        const media = window.matchMedia('(max-width: 959px)');
        const change = () => setMobile(media.matches);
        media.addEventListener('change', change);
        return () => media.removeEventListener('change', change);
    }, []);
    return <>
        {isOpen && <button className="admin-backdrop" onClick={onClose} aria-label="Close navigation" />}
        <aside id="admin-navigation" inert={mobile && !isOpen} role={mobile && isOpen ? 'dialog' : undefined} aria-modal={mobile && isOpen ? true : undefined} aria-label="Workspace navigation" className={`admin-sidebar ${isOpen ? 'is-open' : ''}`}>
            <div className="admin-brand-row">
                <Link to="/admin/dashboard" onClick={onClose} className="admin-brand"><span className="admin-brand-mark">v<span>.</span></span><span>Vance Graphix<small>STUDIO WORKSPACE</small></span></Link>
                <button className="admin-close" onClick={onClose} aria-label="Close navigation"><X size={20} /></button>
            </div>
            <div className="admin-workspace-label"><span className="admin-workspace-icon">VG</span><span>VGP Studio<small>Administration</small></span><span className="admin-workspace-dot" /></div>
            <nav aria-label="Administration" className="admin-nav">
                {adminNavigation.map(group => <div className="admin-nav-group" key={group.label}><p>{group.label}</p>{group.items.map(item => <Link key={item.path} to={item.path} onClick={onClose} aria-current={pathname === item.path ? 'page' : undefined} className={`admin-nav-link ${pathname === item.path ? 'active' : ''}`}><item.icon size={18} strokeWidth={1.7} /><span>{item.name}</span>{pathname === item.path && <ChevronRight size={14} />}</Link>)}</div>)}
            </nav>
            <div className="admin-sidebar-bottom">
                {permission === 'default' && <button className="admin-sidebar-action" onClick={requestPermission}><Bell size={17} />Enable desktop alerts</button>}
                <Link to="/" className="admin-sidebar-action"><ArrowUpRight size={17} />View website</Link>
                {error && <p role="alert" className="text-xs text-red-300 px-3">{error}</p>}
                <button disabled={loggingOut} className="admin-sidebar-action" onClick={async () => { setLoggingOut(true); setError(''); try { await logout(); navigate('/admin/login'); } catch { setError('Unable to sign out. Please try again.'); setLoggingOut(false); } }}><LogOut size={17} />{loggingOut ? 'Signing out...' : 'Sign out'}</button>
                <p className="admin-sidebar-footnote">Vance Graphix & Print</p>
            </div>
        </aside>
    </>;
};
export default AdminSidebar;
