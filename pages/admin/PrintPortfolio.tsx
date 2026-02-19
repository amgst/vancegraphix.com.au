import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
    PrintPortfolioCategory,
    getPrintPortfolios,
    addPrintPortfolio,
    updatePrintPortfolio,
    deletePrintPortfolio
} from '../../lib/printPortfolioService';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

const AdminPrintPortfolio: React.FC = () => {
    const [items, setItems] = React.useState<PrintPortfolioCategory[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isEditing, setIsEditing] = React.useState(false);
    const [currentItem, setCurrentItem] = React.useState<Partial<PrintPortfolioCategory>>({});
    const [isSaving, setIsSaving] = React.useState(false);

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const fetched = await getPrintPortfolios();
            setItems(fetched);
        } catch (error) {
            console.error('Error fetching print portfolios', error);
            alert('Failed to fetch print portfolio categories.');
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchItems();
    }, []);

    const parseFolderInput = (value: string) => {
        let folderId = value.trim();
        let folderUrl = value.trim();

        const foldersIndex = value.indexOf('/folders/');
        if (foldersIndex !== -1) {
            const start = foldersIndex + 9;
            const end = value.indexOf('/', start) !== -1 ? value.indexOf('/', start) : value.length;
            folderId = value.substring(start, end);
        } else {
            const idIndex = value.indexOf('id=');
            if (idIndex !== -1) {
                const start = idIndex + 3;
                const end = value.indexOf('&', start) !== -1 ? value.indexOf('&', start) : value.length;
                folderId = value.substring(start, end);
            }
        }

        return { folderId, folderUrl };
    };

    const handleAddNew = () => {
        setCurrentItem({
            title: '',
            description: '',
            folderId: '',
            folderUrl: '',
            coverImageUrl: '',
            order: items.length + 1,
            isPublic: true
        });
        setIsEditing(true);
    };

    const handleEdit = (item: PrintPortfolioCategory) => {
        setCurrentItem(item);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this portfolio category?')) return;
        try {
            await deletePrintPortfolio(id);
            await fetchItems();
        } catch (error) {
            console.error('Error deleting print portfolio', error);
            alert('Failed to delete portfolio category.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentItem.title || !currentItem.folderId) {
            alert('Title and Google Drive folder are required.');
            return;
        }

        setIsSaving(true);
        try {
            if (currentItem.id) {
                await updatePrintPortfolio(currentItem.id, currentItem);
            } else {
                const itemToAdd: Omit<PrintPortfolioCategory, 'id'> = {
                    title: currentItem.title,
                    description: currentItem.description || '',
                    folderId: currentItem.folderId,
                    folderUrl: currentItem.folderUrl || '',
                    coverImageUrl: currentItem.coverImageUrl || '',
                    order: currentItem.order || items.length + 1,
                    isPublic: currentItem.isPublic !== false
                };
                await addPrintPortfolio(itemToAdd);
            }
            await fetchItems();
            setIsEditing(false);
            setCurrentItem({});
        } catch (error) {
            console.error('Error saving print portfolio', error);
            alert('Failed to save portfolio category.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFolderInputChange = (value: string) => {
        const { folderId, folderUrl } = parseFolderInput(value);
        setCurrentItem(prev => ({ ...prev, folderId, folderUrl }));
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Print Portfolio Categories</h1>
                        <p className="text-gray-500 text-sm">Manage print portfolio heads linked to Google Drive folders.</p>
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                    >
                        <Plus size={18} />
                        Add Category
                    </button>
                </div>

                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map(item => (
                            <div
                                key={item.id}
                                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
                            >
                                {item.coverImageUrl ? (
                                    <div className="h-40 bg-gray-100 overflow-hidden">
                                        <img
                                            src={item.coverImageUrl}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                                        No cover image
                                    </div>
                                )}
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h2 className="font-bold text-slate-900">{item.title}</h2>
                                            {item.description && (
                                                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                            {item.isPublic === false ? 'Hidden' : 'Public'}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500 break-all">
                                        <div className="font-semibold text-gray-700">Folder ID</div>
                                        <div>{item.folderId}</div>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center">
                                        <div className="text-xs text-gray-400">Order: {item.order ?? 0}</div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {items.length === 0 && (
                            <div className="col-span-full py-12 text-center bg-white rounded-xl border-2 border-dashed border-gray-200 text-gray-500">
                                No print portfolio categories yet. Click Add Category to create one.
                            </div>
                        )}
                    </div>
                )}

                {isEditing && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-900">
                                    {currentItem.id ? 'Edit Category' : 'Add Category'}
                                </h3>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="text-gray-400 hover:text-slate-900"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={currentItem.title || ''}
                                        onChange={e => setCurrentItem(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        rows={3}
                                        value={currentItem.description || ''}
                                        onChange={e => setCurrentItem(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Google Drive Folder Link or ID
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={currentItem.folderUrl || currentItem.folderId || ''}
                                        onChange={e => handleFolderInputChange(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        placeholder="Paste folder link or ID"
                                    />
                                    {currentItem.folderId && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            Detected folder ID: {currentItem.folderId}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cover Image URL (optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={currentItem.coverImageUrl || ''}
                                        onChange={e => setCurrentItem(prev => ({ ...prev, coverImageUrl: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <input
                                            id="isPublic"
                                            type="checkbox"
                                            checked={currentItem.isPublic !== false}
                                            onChange={e =>
                                                setCurrentItem(prev => ({ ...prev, isPublic: e.target.checked }))
                                            }
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                        <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                                            Public on website
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm font-medium text-gray-700">Order</label>
                                        <input
                                            type="number"
                                            value={currentItem.order ?? items.length + 1}
                                            onChange={e =>
                                                setCurrentItem(prev => ({
                                                    ...prev,
                                                    order: parseInt(e.target.value || '0', 10)
                                                }))
                                            }
                                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className={`px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {isSaving ? (
                                            <>
                                                <Save size={18} className="animate-pulse" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                Save Category
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminPrintPortfolio;

