import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { PortfolioItem, getPortfolios, updatePortfolio } from '../../lib/portfolioService';
import { Search, Loader2, ChevronLeft, ChevronRight, Globe, Server, Key, FileText } from 'lucide-react';

const AdminWebRegistry: React.FC = () => {
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSaving, setIsSaving] = useState<string | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const fetchedItems = await getPortfolios();
            setItems(fetchedItems);
        } catch (error) {
            console.error("Error fetching portfolios:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleUpdateField = async (id: string, field: keyof PortfolioItem, value: string) => {
        setIsSaving(id);
        try {
            await updatePortfolio(id, { [field]: value });
            setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
        } catch (error) {
            console.error("Error updating field:", error);
            alert("Failed to update field.");
        } finally {
            setIsSaving(null);
        }
    };

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.link?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hostingProvider?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Website Registry</h1>
                <p className="text-gray-500">Internal records for portfolio websites (Hosting, Domains, Notes).</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-100 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search websites, hosting, or links..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Website</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Hosting</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Domain Registrar</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Technology</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 w-1/4">Internal Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <Loader2 className="animate-spin text-blue-600 mx-auto mb-2" size={32} />
                                        <p className="text-gray-500">Loading registry...</p>
                                    </td>
                                </tr>
                            ) : currentItems.length > 0 ? (
                                currentItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900">{item.title}</span>
                                                {item.link && (
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                                                    >
                                                        <Globe size={12} /> {item.link.replace(/^https?:\/\//, '')}
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative">
                                                <Server size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    list={`hosting-options-${item.id}`}
                                                    value={item.hostingProvider || ''}
                                                    placeholder="e.g. Bluehost, VGP Host"
                                                    onChange={(e) => setItems(prev => prev.map(p => p.id === item.id ? { ...p, hostingProvider: e.target.value } : p))}
                                                    onBlur={(e) => handleUpdateField(item.id, 'hostingProvider', e.target.value)}
                                                    className="w-full pl-8 pr-2 py-1.5 text-sm border-transparent hover:border-gray-200 focus:border-blue-500 focus:bg-white rounded-md bg-transparent transition-all outline-none"
                                                />
                                                <datalist id={`hosting-options-${item.id}`}>
                                                    <option value="Bluehost" />
                                                    <option value="VGP Host" />
                                                    <option value="Vercel" />
                                                    <option value="Shopify" />
                                                    <option value="WordPress.com" />
                                                    <option value="Cloudflare Pages" />
                                                </datalist>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative">
                                                <Key size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    list={`registrar-options-${item.id}`}
                                                    value={item.domainRegistrar || ''}
                                                    placeholder="e.g. GoDaddy, VGP Host"
                                                    onChange={(e) => setItems(prev => prev.map(p => p.id === item.id ? { ...p, domainRegistrar: e.target.value } : p))}
                                                    onBlur={(e) => handleUpdateField(item.id, 'domainRegistrar', e.target.value)}
                                                    className="w-full pl-8 pr-2 py-1.5 text-sm border-transparent hover:border-gray-200 focus:border-blue-500 focus:bg-white rounded-md bg-transparent transition-all outline-none"
                                                />
                                                <datalist id={`registrar-options-${item.id}`}>
                                                    <option value="VGP Host" />
                                                    <option value="GoDaddy" />
                                                    <option value="Crazy Domains" />
                                                    <option value="Namecheap" />
                                                    <option value="Cloudflare" />
                                                </datalist>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative">
                                                <Globe size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    list={`tech-options-${item.id}`}
                                                    value={Array.isArray(item.technologies) ? item.technologies.join(', ') : (item.technologies || '')}
                                                    placeholder="e.g. WordPress, Shopify"
                                                    onChange={(e) => setItems(prev => prev.map(p => p.id === item.id ? { ...p, technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean) } : p))}
                                                    onBlur={(e) => handleUpdateField(item.id, 'technologies' as any, e.target.value)}
                                                    className="w-full pl-8 pr-2 py-1.5 text-sm border-transparent hover:border-gray-200 focus:border-blue-500 focus:bg-white rounded-md bg-transparent transition-all outline-none"
                                                />
                                                <datalist id={`tech-options-${item.id}`}>
                                                    <option value="WordPress" />
                                                    <option value="Shopify" />
                                                    <option value="React" />
                                                    <option value="Next.js" />
                                                    <option value="HTML / CSS" />
                                                </datalist>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative group">
                                                <FileText size={14} className="absolute left-2 top-3 text-gray-400" />
                                                <textarea
                                                    value={item.internalNotes || ''}
                                                    placeholder="Internal setup notes..."
                                                    rows={1}
                                                    onChange={(e) => setItems(prev => prev.map(p => p.id === item.id ? { ...p, internalNotes: e.target.value } : p))}
                                                    onBlur={(e) => handleUpdateField(item.id, 'internalNotes', e.target.value)}
                                                    className="w-full pl-8 pr-2 py-1.5 text-sm border-transparent hover:border-gray-200 focus:border-blue-500 focus:bg-white rounded-md bg-transparent transition-all outline-none resize-none"
                                                />
                                                {isSaving === item.id && (
                                                    <div className="absolute right-2 top-2">
                                                        <Loader2 size={12} className="animate-spin text-blue-600" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No matching websites found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {filteredItems.length > itemsPerPage && (
                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredItems.length)}</span> of <span className="font-medium">{filteredItems.length}</span> results
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${currentPage === number
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminWebRegistry;
