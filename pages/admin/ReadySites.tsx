import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { ReadySite } from '../../data/readySitesData';
import { getReadySites, addReadySite, updateReadySite, deleteReadySite } from '../../lib/readySitesService';
import { getReadySiteImageUrl, normalizeReadySiteImage, READY_SITE_IMAGE_FOLDER, READY_SITE_IMAGE_PLACEHOLDER } from '../../lib/readySiteImage';
import { Plus, Trash2, Edit2, Save, X, Eye, EyeOff } from 'lucide-react';

const AdminReadySites: React.FC = () => {
    const [readySites, setReadySites] = useState<ReadySite[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSite, setCurrentSite] = useState<Partial<ReadySite>>({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchReadySites = async () => {
        setIsLoading(true);
        try {
            const fetchedSites = await getReadySites(true);
            setReadySites(fetchedSites);
        } catch (error) {
            console.error("Error fetching ready sites:", error);
            alert("Failed to fetch ready sites. Check console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReadySites();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this ready site?')) {
            try {
                await deleteReadySite(id);
                await fetchReadySites(); // Refresh list
            } catch (error) {
                console.error("Error deleting ready site:", error);
                alert("Failed to delete ready site.");
            }
        }
    };

    const handleEdit = (site: ReadySite) => {
        setCurrentSite(site);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setCurrentSite({
            title: '',
            category: '',
            image: '',
            description: '',
            features: [],
            previewLink: '',
            order: readySites.length + 1,
            isConcept: false,
            published: true
        });
        setIsEditing(true);
    };

    const handleTogglePublished = async (site: ReadySite) => {
        try {
            await updateReadySite(site.id, { published: site.published === false });
            await fetchReadySites();
        } catch (error) {
            console.error("Error updating ready site visibility:", error);
            alert("Failed to update publish status.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentSite.title || !currentSite.description) return;

        try {
            // Ensure features is an array
            const features = typeof currentSite.features === 'string'
                ? currentSite.features.split(',').map(f => f.trim()).filter(f => f)
                : currentSite.features || [];

            const siteData = {
                ...currentSite,
                image: normalizeReadySiteImage(currentSite.image),
                features,
                order: currentSite.order || readySites.length + 1,
                published: currentSite.published ?? true
            };

            if (currentSite.id) {
                // Update existing
                await updateReadySite(currentSite.id, siteData);
            } else {
                // Add new
                await addReadySite(siteData as Omit<ReadySite, 'id'>);
            }
            await fetchReadySites(); // Refresh list
            setIsEditing(false);
            setCurrentSite({});
        } catch (error) {
            console.error("Error saving ready site:", error);
            alert("Failed to save ready site.");
        }
    };



    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Loading ready sites...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Manage Ready Sites</h1>
                    <p className="text-gray-500">Add or edit ready-made website templates displayed on the public page.</p>
                </div>
                <div className="flex gap-3">

                    <button
                        onClick={handleAddNew}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={18} /> Add New Site
                    </button>
                </div>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900">
                                {readySites.find(s => s.id === currentSite.id) ? 'Edit Ready Site' : 'Add New Ready Site'}
                            </h3>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                }}
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
                                    value={currentSite.title || ''}
                                    onChange={e => setCurrentSite({ ...currentSite, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <input
                                        type="text"
                                        required
                                        value={currentSite.category || ''}
                                        onChange={e => setCurrentSite({ ...currentSite, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="e.g., Automotive, Healthcare"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                    <input
                                        type="number"
                                        value={currentSite.order || readySites.length + 1}
                                        onChange={e => setCurrentSite({ ...currentSite, order: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image (optional)</label>
                                {currentSite.image && (
                                    <div className="mb-3">
                                        <img
                                            src={getReadySiteImageUrl(currentSite.image)}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg border border-gray-200"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = READY_SITE_IMAGE_PLACEHOLDER;
                                            }}
                                        />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={currentSite.image || ''}
                                        onChange={e => {
                                            setCurrentSite({ ...currentSite, image: e.target.value });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="example.jpg or /ready sites/example.jpg"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Store ready-site images in <code>public\ready sites</code>. Enter only the filename and it will save as <code>{READY_SITE_IMAGE_FOLDER}filename</code>.
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Existing absolute URLs still work, but new images should use the local folder.
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={currentSite.description || ''}
                                    onChange={e => setCurrentSite({ ...currentSite, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
                                <input
                                    type="text"
                                    value={Array.isArray(currentSite.features) ? currentSite.features.join(', ') : (currentSite.features || '')}
                                    onChange={e => setCurrentSite({ ...currentSite, features: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Feature 1, Feature 2, Feature 3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preview Link (optional)</label>
                                <input
                                    type="text"
                                    value={currentSite.previewLink || ''}
                                    onChange={e => setCurrentSite({ ...currentSite, previewLink: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="https://example.com"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isConcept"
                                    checked={currentSite.isConcept || false}
                                    onChange={e => setCurrentSite({ ...currentSite, isConcept: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor="isConcept" className="text-sm font-medium text-gray-700">Concept Demo</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="published"
                                    checked={currentSite.published !== false}
                                    onChange={e => setCurrentSite({ ...currentSite, published: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor="published" className="text-sm font-medium text-gray-700">Published</label>
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
                                    className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Save size={18} /> Save Site
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Title</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Category</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Order</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Preview</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {readySites.map((site) => (
                            <tr key={site.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {site.image && (
                                            <img
                                                src={getReadySiteImageUrl(site.image)}
                                                alt={site.title}
                                                className="w-16 h-16 object-cover rounded-lg"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = READY_SITE_IMAGE_PLACEHOLDER;
                                                }}
                                            />
                                        )}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-slate-900">{site.title}</p>
                                                {site.isConcept && (
                                                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded uppercase">
                                                        Concept
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{site.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                        {site.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            site.published === false
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-green-100 text-green-700'
                                        }`}
                                    >
                                        {site.published === false ? 'Unpublished' : 'Published'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-gray-600">{site.order || 0}</span>
                                </td>
                                <td className="px-6 py-4">
                                    {site.previewLink ? (
                                        <a
                                            href={site.previewLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            View Preview
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 text-sm">No preview</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleTogglePublished(site)}
                                            className={`p-2 rounded-lg transition-colors ${
                                                site.published === false
                                                    ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
                                                    : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                                            }`}
                                            title={site.published === false ? 'Publish site' : 'Unpublish site'}
                                        >
                                            {site.published === false ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                        <button
                                            onClick={() => handleEdit(site)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(site.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {readySites.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    No ready sites found. Click "Add New Site" to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default AdminReadySites;
