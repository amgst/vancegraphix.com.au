import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { ReadySite } from '../../data/readySitesData';
import { getReadySites, addReadySite, updateReadySite, deleteReadySite } from '../../lib/readySitesService';
import { uploadImage } from '../../lib/imageUploadService';
import { Plus, Trash2, Edit2, Save, X, Upload, Image as ImageIcon } from 'lucide-react';

const AdminReadySites: React.FC = () => {
    const [readySites, setReadySites] = useState<ReadySite[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSite, setCurrentSite] = useState<Partial<ReadySite>>({});
    const [isLoading, setIsLoading] = useState(true);

    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const fetchReadySites = async () => {
        setIsLoading(true);
        try {
            const fetchedSites = await getReadySites();
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
        setImagePreview(site.image || null);
        setSelectedImageFile(null);
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
            isConcept: false
        });
        setImagePreview(null);
        setSelectedImageFile(null);
        setIsEditing(true);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file.');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB.');
                return;
            }
            setSelectedImageFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        if (!selectedImageFile) return;

        setIsUploading(true);
        try {
            const imageUrl = await uploadImage(selectedImageFile, 'ready-sites');
            setCurrentSite({ ...currentSite, image: imageUrl });
            setImagePreview(imageUrl);
            setSelectedImageFile(null);
            alert('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
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
                features,
                order: currentSite.order || readySites.length + 1
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
                                    setImagePreview(null);
                                    setSelectedImageFile(null);
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

                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="mb-3">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg border border-gray-200"
                                        />
                                    </div>
                                )}

                                {/* Upload Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <label className="flex-1 cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageSelect}
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                                <ImageIcon size={20} className="text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    {selectedImageFile ? selectedImageFile.name : 'Choose Image to Upload'}
                                                </span>
                                            </div>
                                        </label>
                                        {selectedImageFile && (
                                            <button
                                                type="button"
                                                onClick={handleImageUpload}
                                                disabled={isUploading}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Upload size={18} />
                                                {isUploading ? 'Uploading...' : 'Upload'}
                                            </button>
                                        )}
                                    </div>

                                    {/* Or use URL */}
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-300"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white text-gray-500">OR</span>
                                        </div>
                                    </div>

                                    {/* URL Input */}
                                    <input
                                        type="text"
                                        value={currentSite.image || ''}
                                        onChange={e => {
                                            setCurrentSite({ ...currentSite, image: e.target.value });
                                            setImagePreview(e.target.value || null);
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Enter image URL (https://example.com/image.png or /template_cars.png)"
                                    />
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
                                                src={site.image}
                                                alt={site.title}
                                                className="w-16 h-16 object-cover rounded-lg"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/template_cars.png';
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
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
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

