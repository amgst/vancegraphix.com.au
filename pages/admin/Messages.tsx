import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getInquiries, updateInquiryStatus, InquiryData } from '../../lib/inquiryService';
import { getContactMessages, updateContactMessageStatus, ContactMessageData } from '../../lib/contactService';
import { Mail, Phone, Calendar, CheckCircle, XCircle, Clock, ExternalLink, ChevronDown, ChevronUp, MessageSquare, Briefcase } from 'lucide-react';

const AdminMessages: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'inquiries' | 'contact'>('inquiries');
    const [inquiries, setInquiries] = useState<InquiryData[]>([]);
    const [contactMessages, setContactMessages] = useState<ContactMessageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [inquiriesData, messagesData] = await Promise.all([
                getInquiries(),
                getContactMessages()
            ]);
            setInquiries(inquiriesData);
            setContactMessages(messagesData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInquiryStatusChange = async (id: string, newStatus: InquiryData['status']) => {
        try {
            await updateInquiryStatus(id, newStatus);
            setInquiries(inquiries.map(inq => 
                inq.id === id ? { ...inq, status: newStatus } : inq
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const handleContactStatusChange = async (id: string, newStatus: ContactMessageData['status']) => {
        try {
            await updateContactMessageStatus(id, newStatus);
            setContactMessages(contactMessages.map(msg => 
                msg.id === id ? { ...msg, status: newStatus } : msg
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800';
            case 'contacted': 
            case 'replied': return 'bg-yellow-100 text-yellow-800';
            case 'closed': 
            case 'read': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        if (timestamp.toDate) {
            return timestamp.toDate().toLocaleDateString() + ' ' + timestamp.toDate().toLocaleTimeString();
        }
        return new Date(timestamp).toLocaleString();
    };

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-slate-900">Messages & Inquiries</h1>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('inquiries')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                            activeTab === 'inquiries' 
                                ? 'bg-white text-blue-600 shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Briefcase size={16} />
                        Project Inquiries
                        <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full ml-1">
                            {inquiries.filter(i => i.status === 'new').length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('contact')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                            activeTab === 'contact' 
                                ? 'bg-white text-blue-600 shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <MessageSquare size={16} />
                        Contact Messages
                        <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full ml-1">
                            {contactMessages.filter(m => m.status === 'new').length}
                        </span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {activeTab === 'inquiries' ? (
                        // Inquiries List
                        inquiries.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                                <p className="text-slate-500">No inquiries found.</p>
                            </div>
                        ) : (
                            inquiries.map((inquiry) => (
                                <div key={inquiry.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div 
                                        className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors gap-4"
                                        onClick={() => inquiry.id && toggleExpand(inquiry.id)}
                                    >
                                        <div className="flex items-start md:items-center gap-4 w-full md:w-auto">
                                            <div className={`mt-1 md:mt-0 w-3 h-3 rounded-full flex-shrink-0 ${inquiry.status === 'new' ? 'bg-blue-500' : inquiry.status === 'contacted' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-slate-900">{inquiry.name}</h3>
                                                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-sm text-slate-500 mt-1 md:mt-0">
                                                    <span className="flex items-center gap-1"><Mail size={14} /> {inquiry.email}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="capitalize px-2 py-0.5 bg-slate-100 rounded text-slate-700 text-xs">{inquiry.serviceType}</span>
                                                        <span className="text-xs text-slate-400 block md:hidden">{formatDate(inquiry.createdAt)}</span>
                                                    </div>
                                                    <span className="text-xs text-slate-400 hidden md:block">{formatDate(inquiry.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between w-full md:w-auto gap-4 pl-7 md:pl-0">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                                                {inquiry.status.toUpperCase()}
                                            </span>
                                            {expandedId === inquiry.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                                        </div>
                                    </div>
                                    
                                    {expandedId === inquiry.id && (
                                        <div className="border-t border-slate-100 p-6 bg-slate-50">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Project Details</h4>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="text-xs text-slate-500 block mb-1">Description</label>
                                                            <p className="text-slate-800 whitespace-pre-wrap">{inquiry.message}</p>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="text-xs text-slate-500 block mb-1">Budget Range</label>
                                                                <p className="text-slate-800 font-medium">{inquiry.budget || 'N/A'}</p>
                                                            </div>
                                                            <div>
                                                                <label className="text-xs text-slate-500 block mb-1">Timeline</label>
                                                                <p className="text-slate-800 font-medium">{inquiry.timeline}</p>
                                                            </div>
                                                        </div>
                                                        {inquiry.phone && (
                                                            <div>
                                                                <label className="text-xs text-slate-500 block mb-1">Phone</label>
                                                                <p className="text-slate-800 font-medium">{inquiry.phone}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Actions</h4>
                                                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                                                        <label className="text-xs text-slate-500 block mb-2">Update Status</label>
                                                        <div className="flex flex-wrap gap-2">
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); inquiry.id && handleInquiryStatusChange(inquiry.id, 'new'); }}
                                                                disabled={inquiry.status === 'new'}
                                                                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${inquiry.status === 'new' ? 'bg-blue-100 text-blue-700 cursor-default' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                                            >
                                                                New
                                                            </button>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); inquiry.id && handleInquiryStatusChange(inquiry.id, 'contacted'); }}
                                                                disabled={inquiry.status === 'contacted'}
                                                                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${inquiry.status === 'contacted' ? 'bg-yellow-100 text-yellow-700 cursor-default' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                                            >
                                                                Contacted
                                                            </button>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); inquiry.id && handleInquiryStatusChange(inquiry.id, 'closed'); }}
                                                                disabled={inquiry.status === 'closed'}
                                                                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${inquiry.status === 'closed' ? 'bg-green-100 text-green-700 cursor-default' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                                            >
                                                                Closed
                                                            </button>
                                                        </div>
                                                        
                                                        <div className="mt-6 pt-6 border-t border-slate-100">
                                                            <a href={`mailto:${inquiry.email}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                                                                <Mail size={16} /> Reply via Email
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )
                    ) : (
                        // Contact Messages List
                        contactMessages.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                                <p className="text-slate-500">No messages found.</p>
                            </div>
                        ) : (
                            contactMessages.map((msg) => (
                                <div key={msg.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div 
                                        className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors gap-4"
                                        onClick={() => msg.id && toggleExpand(msg.id)}
                                    >
                                        <div className="flex items-start md:items-center gap-4 w-full md:w-auto">
                                            <div className={`mt-1 md:mt-0 w-3 h-3 rounded-full flex-shrink-0 ${msg.status === 'new' ? 'bg-blue-500' : msg.status === 'replied' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-slate-900">{msg.firstName} {msg.lastName}</h3>
                                                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-sm text-slate-500 mt-1 md:mt-0">
                                                    <span className="flex items-center gap-1"><Mail size={14} /> {msg.email}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="capitalize px-2 py-0.5 bg-slate-100 rounded text-slate-700 text-xs">{msg.service}</span>
                                                        <span className="text-xs text-slate-400 block md:hidden">{formatDate(msg.createdAt)}</span>
                                                    </div>
                                                    <span className="text-xs text-slate-400 hidden md:block">{formatDate(msg.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between w-full md:w-auto gap-4 pl-7 md:pl-0">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(msg.status)}`}>
                                                {msg.status.toUpperCase()}
                                            </span>
                                            {expandedId === msg.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                                        </div>
                                    </div>
                                    
                                    {expandedId === msg.id && (
                                        <div className="border-t border-slate-100 p-6 bg-slate-50">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Message Details</h4>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="text-xs text-slate-500 block mb-1">Message</label>
                                                            <p className="text-slate-800 whitespace-pre-wrap">{msg.message}</p>
                                                        </div>
                                                        <div>
                                                            <label className="text-xs text-slate-500 block mb-1">Interested In</label>
                                                            <p className="text-slate-800 font-medium">{msg.service}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Actions</h4>
                                                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                                                        <label className="text-xs text-slate-500 block mb-2">Update Status</label>
                                                        <div className="flex flex-wrap gap-2">
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); msg.id && handleContactStatusChange(msg.id, 'new'); }}
                                                                disabled={msg.status === 'new'}
                                                                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${msg.status === 'new' ? 'bg-blue-100 text-blue-700 cursor-default' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                                            >
                                                                New
                                                            </button>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); msg.id && handleContactStatusChange(msg.id, 'replied'); }}
                                                                disabled={msg.status === 'replied'}
                                                                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${msg.status === 'replied' ? 'bg-yellow-100 text-yellow-700 cursor-default' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                                            >
                                                                Replied
                                                            </button>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); msg.id && handleContactStatusChange(msg.id, 'read'); }}
                                                                disabled={msg.status === 'read'}
                                                                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${msg.status === 'read' ? 'bg-green-100 text-green-700 cursor-default' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                                            >
                                                                Read/Closed
                                                            </button>
                                                        </div>
                                                        
                                                        <div className="mt-6 pt-6 border-t border-slate-100">
                                                            <a href={`mailto:${msg.email}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                                                                <Mail size={16} /> Reply via Email
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )
                    )}
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminMessages;