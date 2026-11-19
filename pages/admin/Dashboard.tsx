import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownLeft, ArrowRight, ArrowUpRight, BriefcaseBusiness, Check, Clock3, Inbox, Loader2, Mail, RefreshCw, ShoppingBag, UsersRound } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getInquiries, InquiryData } from '../../lib/inquiryService';
import { getContactMessages, ContactMessageData } from '../../lib/contactService';
import { getOrders, OrderData } from '../../lib/ordersService';
import { CRMContact, watchContacts, stages } from '../../lib/crmService';
import { useAuth } from '../../components/admin/AuthProvider';

const money = (value: number) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(value);
const localDate = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const asDate = (value: any): Date | null => {
    const d = value?.toDate ? value.toDate() : value ? new Date(value) : null;
    return d && Number.isFinite(d.getTime()) ? d : null;
};

export default function AdminDashboard() {
    const { user } = useAuth();
    const [inquiries, setInquiries] = useState<InquiryData[]>([]);
    const [messages, setMessages] = useState<ContactMessageData[]>([]);
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [contacts, setContacts] = useState<CRMContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [crmLoading, setCrmLoading] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);
    const [crmError, setCrmError] = useState(false);
    const [updated, setUpdated] = useState<Date | null>(null);
    const load = useCallback(async () => {
        setLoading(true); setErrors([]);
        const results = await Promise.allSettled([getInquiries(), getContactMessages(), getOrders()]);
        const failed: string[] = [];
        if (results[0].status === 'fulfilled') setInquiries(results[0].value); else failed.push('inquiries');
        if (results[1].status === 'fulfilled') setMessages(results[1].value); else failed.push('messages');
        if (results[2].status === 'fulfilled') setOrders(results[2].value); else failed.push('orders');
        setErrors(failed); setLoading(false); setUpdated(new Date());
    }, []);
    useEffect(() => { void load(); }, [load]);
    useEffect(() => watchContacts(data => { setContacts(data); setCrmLoading(false); setCrmError(false); }, () => { setCrmError(true); setCrmLoading(false); }), []);
    const unread = inquiries.filter(i => i.status === 'new').length + messages.filter(m => m.status === 'new').length;
    const openOrders = orders.filter(o => o.status === 'new' || o.status === 'processing').length;
    const active = contacts.filter(c => c.stage !== 'Won' && c.stage !== 'Lost');
    const due = active.filter(c => c.followUp && c.followUp <= localDate()).sort((a,b) => a.followUp.localeCompare(b.followUp));
    const pendingInbox = loading || errors.includes('inquiries') || errors.includes('messages');
    const activity = [
        ...inquiries.map(i => ({ id: `inquiry-${i.id}`, name: i.name, detail: i.serviceType, kind: 'Project inquiry', status: i.status, date: asDate(i.createdAt) })),
        ...messages.map(m => ({ id: `message-${m.id}`, name: `${m.firstName} ${m.lastName}`, detail: m.service, kind: 'Contact message', status: m.status, date: asDate(m.createdAt) })),
    ].sort((a,b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0)).slice(0, 5);
    const stats = [
        { label: 'Inbox to review', value: pendingInbox ? null : unread, detail: 'New messages & inquiries', icon: Inbox, color: 'sage', path: '/admin/messages' },
        { label: 'Active contacts', value: crmLoading || crmError ? null : active.length, detail: 'Across your open deals', icon: UsersRound, color: 'blue', path: '/admin/crm' },
        { label: 'Pipeline value', value: crmLoading || crmError ? null : money(active.reduce((n,c) => n + (Number(c.value) || 0), 0)), detail: 'Open opportunities · AUD', icon: BriefcaseBusiness, color: 'violet', path: '/admin/crm' },
        { label: 'Open orders', value: loading || errors.includes('orders') ? null : openOrders, detail: 'New & in progress', icon: ShoppingBag, color: 'amber', path: '/admin/orders' },
    ];
    return <AdminLayout>
        <div className="admin-page-heading"><div><p className="admin-eyebrow">YOUR WORKSPACE</p><h1>Studio overview<span className="admin-heading-dot">.</span></h1><p>Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}. Let's make good things happen.</p></div><div className="admin-heading-actions"><span className="admin-date">{new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date())}</span><button className="admin-button secondary" disabled={loading} onClick={load} aria-label="Refresh dashboard">{loading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}Refresh</button></div></div>
        {(errors.length > 0 || crmError) && <div className="admin-notice" role="alert">Some data couldn't be loaded{errors.length ? `: ${errors.join(', ')}` : ''}{crmError ? '. CRM is unavailable' : ''}. Check your connection and refresh. Unavailable totals are shown as a dash.</div>}
        <section className="admin-welcome"><div className="admin-welcome-copy"><span className="admin-welcome-tag"><span />BUSINESS AT A GLANCE</span><h2>A little clarity.<br />A lot of possibility.</h2><p>{pendingInbox ? 'Your conversations, clients and creative work, together.' : unread ? `${unread} new conversation${unread === 1 ? '' : 's'} waiting for your attention. Your next great project could be one of them.` : 'Your inbox is up to date. Make room for your next great project.'}</p><Link to="/admin/messages" className="admin-button light">Open inbox<ArrowUpRight size={16} /></Link></div><div className="admin-welcome-art" aria-hidden="true"><div className="admin-art-orbit" /><div className="admin-art-orbit inner" /><div className="admin-art-tile"><span>VGP</span><ArrowUpRight size={46} strokeWidth={1.3} /></div><div className="admin-art-note"><Check size={14} />Create. Connect. Grow.</div></div></section>
        <section aria-label="Business summary" className="admin-stat-grid">{stats.map(stat => <Link to={stat.path} className="admin-stat-card" key={stat.label}><div className="admin-stat-top"><span className={`admin-stat-icon ${stat.color}`}><stat.icon size={19} strokeWidth={1.8} /></span><ArrowUpRight size={16} /></div><p>{stat.label}</p><strong aria-busy={stat.value === null}>{stat.value ?? '—'}</strong><small>{stat.detail}</small></Link>)}</section>
        <div className="admin-dashboard-grid">
            <section className="admin-panel"><div className="admin-panel-heading"><div><h2>Recent conversations</h2><p>The latest from your inbox</p></div><Link to="/admin/messages" className="admin-text-link">View all<ArrowRight size={14} /></Link></div>{loading ? <div className="admin-empty"><Loader2 className="animate-spin" size={24} /><p>Loading conversations...</p></div> : activity.length ? <div className="admin-activity-list">{activity.map(item => <Link to="/admin/messages" key={item.id} className="admin-activity"><span className={`admin-activity-icon ${item.status === 'new' ? 'unread' : ''}`}>{item.kind === 'Project inquiry' ? <ArrowDownLeft size={18} /> : <Mail size={17} />}</span><div className="admin-activity-person"><strong>{item.name}</strong><span>{item.detail || item.kind}</span></div><div className="admin-activity-meta"><time>{item.date ? new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short' }).format(item.date) : 'Date unavailable'}</time><span className={`admin-badge ${item.status === 'new' ? 'new' : ''}`}>{item.status}</span></div></Link>)}</div> : <div className="admin-empty"><Inbox size={28} /><h3>{errors.length ? 'Inbox unavailable' : 'A fresh start'}</h3><p>{errors.length ? 'Refresh to try loading your conversations again.' : 'New messages and project inquiries will appear here.'}</p></div>}<div className="admin-panel-foot"><span className="admin-status-dot" />{updated ? `Last refreshed at ${updated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Connecting to your workspace'}</div></section>
            <section className="admin-panel"><div className="admin-panel-heading"><div><h2>Follow-ups</h2><p>Keep the conversation going</p></div><span className="admin-count">{crmLoading || crmError ? '—' : due.length}</span></div>{crmLoading ? <div className="admin-empty"><Loader2 size={24} className="animate-spin" /><p>Loading follow-ups...</p></div> : due.length ? <div className="admin-followups">{due.slice(0,4).map(c => <Link to="/admin/crm" key={c.id}><span className="admin-contact-avatar">{c.name.slice(0,2).toUpperCase()}</span><div><strong>{c.name}</strong><small>{c.company || c.service || 'Open opportunity'}</small></div><span className="admin-due"><Clock3 size={12} />{c.followUp === localDate() ? 'Today' : 'Overdue'}</span></Link>)}</div> : <div className="admin-empty"><span className="admin-empty-icon"><Check size={23} /></span><h3>{crmError ? 'CRM unavailable' : 'Room to focus'}</h3><p>{crmError ? 'Check your connection to load follow-ups.' : 'No follow-ups due. Schedule your next conversation in the CRM.'}</p></div>}<div className="admin-panel-foot"><Link to="/admin/crm" className="admin-text-link">Open CRM<ArrowRight size={14} /></Link></div></section>
        </div>
        <div className="admin-dashboard-grid bottom"><section className="admin-panel"><div className="admin-panel-heading"><div><h2>Your deal pipeline</h2><p>Every opportunity, one clear view</p></div><Link to="/admin/crm" className="admin-text-link">Manage<ArrowRight size={14} /></Link></div><div className="admin-pipeline">{stages.map((s,index) => { const count = contacts.filter(c=>c.stage === s).length; return <Link to="/admin/crm" key={s}><span className={`admin-stage-marker stage-${index}`} /><span>{s}</span><strong>{crmLoading || crmError ? '—' : count}</strong><div className="admin-pipeline-track"><i className={`stage-${index}`} style={{ width: `${contacts.length ? count / contacts.length * 100 : 0}%` }} /></div></Link>; })}</div><p className="admin-pipeline-caption">{crmLoading ? 'Loading pipeline...' : crmError ? 'Pipeline data unavailable.' : contacts.length ? `${contacts.length} contacts in your CRM` : 'Add a contact or import inquiries to start your pipeline.'}</p></section><section className="admin-panel"><div className="admin-panel-heading"><div><h2>Make your next move</h2><p>Pick up where inspiration starts</p></div></div><div className="admin-shortcuts">{[{title:'Update your portfolio',text:'Give your latest work a home',path:'/admin/portfolio',icon:BriefcaseBusiness},{title:'Manage your services',text:'Show clients what you do best',path:'/admin/services',icon:UsersRound},{title:'Write a new story',text:'Share something worth reading',path:'/admin/blog',icon:Mail}].map(a => <Link to={a.path} key={a.path}><span><a.icon size={18}/></span><div><strong>{a.title}</strong><small>{a.text}</small></div><ArrowUpRight size={17}/></Link>)}</div></section></div>
    </AdminLayout>;
}
