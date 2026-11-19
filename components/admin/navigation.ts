import { LayoutDashboard, Inbox, UsersRound, ShoppingBag, Package, PanelsTopLeft, Globe, Images, Printer, Layers, FileText, MessageSquare, Wrench, Settings, Zap } from 'lucide-react';

export const adminNavigation = [
    { label: 'Workspace', items: [
        { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard, description: 'Your business at a glance' },
        { name: 'CRM', path: '/admin/crm', icon: UsersRound, description: 'Contacts, deals and follow-ups' },
        { name: 'Messages', path: '/admin/messages', icon: Inbox, description: 'Inquiries and conversations' },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingBag, description: 'Customer orders and fulfilment' },
    ] },
    { label: 'Content & portfolio', items: [
        { name: 'Portfolio', path: '/admin/portfolio', icon: Images, description: 'Showcase your creative work' },
        { name: 'Print portfolio', path: '/admin/print-portfolio', icon: Printer, description: 'Print projects and galleries' },
        { name: 'Web registry', path: '/admin/web-registry', icon: Globe, description: 'Manage website projects' },
        { name: 'Services', path: '/admin/services', icon: Layers, description: 'Your service catalogue' },
        { name: 'Blog', path: '/admin/blog', icon: FileText, description: 'Stories, articles and updates' },
        { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare, description: 'Customer feedback' },
    ] },
    { label: 'Commerce & settings', items: [
        { name: 'Ready sites', path: '/admin/ready-sites', icon: PanelsTopLeft, description: 'Websites available for sale' },
        { name: 'POD products', path: '/admin/store', icon: Package, description: 'Products and merchandise' },
        { name: 'Etsy store', path: '/admin/store-etsy', icon: Zap, description: 'Your connected Etsy catalogue' },
        { name: 'Tools', path: '/admin/tools', icon: Wrench, description: 'Manage website tools' },
        { name: 'Settings', path: '/admin/settings', icon: Settings, description: 'Brand and website preferences' },
    ] },
];
export const adminPages = adminNavigation.flatMap(group => group.items);
