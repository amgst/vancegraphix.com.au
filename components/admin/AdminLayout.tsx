import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, ChevronRight, Menu, Search, X } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from './AuthProvider';
import { adminPages } from './navigation';
import './admin.css';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const { pathname } = useLocation();
    const { user } = useAuth();
    const searchRef = useRef<HTMLDivElement>(null);
    const menuButton = useRef<HTMLButtonElement>(null);
    const page = adminPages.find(item => item.path === pathname);
    const name = user?.displayName || user?.email?.split('@')[0] || 'Administrator';
    const closeMenu = () => { setSidebarOpen(false); menuButton.current?.focus(); };
    useEffect(() => {
        const media = window.matchMedia('(min-width: 960px)');
        const change = () => { if (media.matches) setSidebarOpen(false); };
        media.addEventListener('change', change);
        return () => media.removeEventListener('change', change);
    }, []);
    useEffect(() => {
        const listener = (event: KeyboardEvent) => { if (event.key === 'Escape') { setSearching(false); if (sidebarOpen) closeMenu(); } };
        const outside = (event: PointerEvent) => { if (!searchRef.current?.contains(event.target as Node)) setSearching(false); };
        document.addEventListener('keydown', listener);
        document.addEventListener('pointerdown', outside);
        return () => { document.removeEventListener('keydown', listener); document.removeEventListener('pointerdown', outside); };
    }, [sidebarOpen]);
    useEffect(() => {
        if (!sidebarOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const sidebar = document.getElementById('admin-navigation');
        const focusable = () => Array.from(sidebar?.querySelectorAll<HTMLElement>('a, button:not(:disabled)') || []).filter(el => el.getClientRects().length);
        focusable()[0]?.focus();
        const trap = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') return;
            const elements = focusable(), first = elements[0], last = elements[elements.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
            if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        };
        document.addEventListener('keydown', trap);
        return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', trap); };
    }, [sidebarOpen]);
    return <div className="admin-app">
        <a href="#admin-content" className="admin-skip">Skip to content</a>
        <AdminSidebar isOpen={sidebarOpen} onClose={closeMenu} />
        <div className="admin-workarea">
            <header className="admin-topbar">
                <div className="admin-breadcrumb"><button ref={menuButton} className="admin-menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open navigation" aria-expanded={sidebarOpen} aria-controls="admin-navigation"><Menu size={21} /></button><span>Workspace</span><ChevronRight size={14} /><strong>{page?.name || 'Administration'}</strong></div>
                <div className="admin-topbar-tools">
                    <div ref={searchRef} className="admin-search"><Search size={17} /><input aria-label="Find an admin page" placeholder="Find a page..." value={query} onFocus={() => setSearching(true)} onChange={e => { setQuery(e.target.value); setSearching(true); }} />{query && <button onClick={() => setQuery('')} aria-label="Clear page search"><X size={14} /></button>}
                        {searching && <div className="admin-search-results">{adminPages.filter(item => `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase())).map(item => <Link key={item.path} to={item.path} onClick={() => { setSearching(false); setQuery(''); }}><item.icon size={17} /><span>{item.name}<small>{item.description}</small></span><ChevronRight size={14} /></Link>)}{!adminPages.some(item => `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase())) && <p>No pages found.</p>}</div>}
                    </div>
                    <Link to="/" className="admin-site-link">View site<ArrowUpRight size={15} /></Link>
                    <div className="admin-profile" title={user?.email || name}><span>{name.slice(0, 2).toUpperCase()}</span><div>{name}<small>Administrator</small></div></div>
                </div>
            </header>
            <main id="admin-content" tabIndex={-1} className="admin-content">{children}</main>
            <footer className="admin-workarea-footer"><span>Vance Graphix & Print</span><span>Your studio, all in one place.</span></footer>
        </div>
    </div>;
};
export default AdminLayout;
