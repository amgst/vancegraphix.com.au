import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Users, ShoppingBag, DollarSign, TrendingUp, Mail, Inbox, AlertCircle } from 'lucide-react';
import { getInquiries, InquiryData } from '../../lib/inquiryService';
import { getContactMessages, ContactMessageData } from '../../lib/contactService';

const StatCard: React.FC<{ title: string; value: string | number; change: string; icon: React.ElementType; color: string }> = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
                <Icon className={color.replace('bg-', 'text-')} size={24} />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-400">
                {change}
            </span>
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
    const [inquiries, setInquiries] = useState<InquiryData[]>([]);
    const [messages, setMessages] = useState<ContactMessageData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [inquiriesData, messagesData] = await Promise.all([
                    getInquiries(),
                    getContactMessages()
                ]);
                setInquiries(inquiriesData);
                setMessages(messagesData);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;
    const newMessagesCount = messages.filter(m => m.status === 'new').length;

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        if (timestamp.toDate) {
            return timestamp.toDate().toLocaleDateString();
        }
        return new Date(timestamp).toLocaleDateString();
    };

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-gray-500">Welcome back, here's what's happening today.</p>
            </div>

            {loading ? (
                 <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Inquiries"
                            value={inquiries.length}
                            change="Lifetime total"
                            icon={Inbox}
                            color="bg-blue-500"
                        />
                        <StatCard
                            title="New Inquiries"
                            value={newInquiriesCount}
                            change="Needs attention"
                            icon={AlertCircle}
                            color="bg-purple-500"
                        />
                        <StatCard
                            title="Total Messages"
                            value={messages.length}
                            change="From contact form"
                            icon={Mail}
                            color="bg-green-500"
                        />
                        <StatCard
                            title="New Messages"
                            value={newMessagesCount}
                            change="Unread messages"
                            icon={Users}
                            color="bg-orange-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Inquiries</h3>
                            <div className="space-y-4">
                                {inquiries.slice(0, 5).map(inquiry => (
                                    <div key={inquiry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${inquiry.status === 'new' ? 'bg-purple-500' : 'bg-gray-400'}`}></div>
                                            <div>
                                                <p className="font-medium text-slate-900">{inquiry.name}</p>
                                                <p className="text-xs text-slate-500">{inquiry.serviceType}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-gray-500 block">{formatDate(inquiry.createdAt)}</span>
                                            <span className="text-xs font-medium text-blue-600">{inquiry.budget}</span>
                                        </div>
                                    </div>
                                ))}
                                {inquiries.length === 0 && <p className="text-gray-500 text-sm">No recent inquiries.</p>}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Messages</h3>
                            <div className="space-y-4">
                                {messages.slice(0, 5).map(message => (
                                    <div key={message.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${message.status === 'new' ? 'bg-orange-500' : 'bg-gray-400'}`}></div>
                                            <div>
                                                <p className="font-medium text-slate-900">{message.firstName} {message.lastName}</p>
                                                <p className="text-xs text-slate-500">{message.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
                                        </div>
                                    </div>
                                ))}
                                {messages.length === 0 && <p className="text-gray-500 text-sm">No recent messages.</p>}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </AdminLayout>
    );
};

export default AdminDashboard;
