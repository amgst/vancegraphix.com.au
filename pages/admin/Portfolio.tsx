import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { PortfolioItem, getPortfolios, addPortfolio, updatePortfolio, deletePortfolio } from '../../lib/portfolioService';
import { Plus, Trash2, Edit2, Save, X, Upload, Loader2, LayoutGrid, List, ExternalLink, ChevronLeft, ChevronRight, Download, CheckCircle, Search } from 'lucide-react';
import { uploadFileWithProgress, generateUniqueFileName, uploadFromUrl } from '../../lib/storageService';

const AdminPortfolio: React.FC = () => {
    const [items, setItems] = React.useState<PortfolioItem[]>([]);
    const [viewMode, setViewMode] = React.useState<'card' | 'list'>('card');
    const [isEditing, setIsEditing] = React.useState(false);
    const [currentItem, setCurrentItem] = React.useState<Partial<PortfolioItem>>({});
    const [isLoading, setIsLoading] = React.useState(true);
    const [isUploading, setIsUploading] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const [isFetchingScreenshot, setIsFetchingScreenshot] = React.useState(false);

    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [searchQuery, setSearchQuery] = React.useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);

    // Filter + Pagination Logic
    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.link?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when changing page size
    };

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const fetchedItems = await getPortfolios();
            setItems(fetchedItems);
        } catch (error) {
            console.error("Error fetching portfolios:", error);
            alert("Failed to fetch portfolios.");
        } finally {
            setIsLoading(false);
        }
    };



    const handleAutoFetchData = async () => {
        if (!currentItem.link) {
            alert("Please provide a website link first.");
            return;
        }

        setIsFetchingScreenshot(true);
        try {
            // 1. Fetch Metadata (Title, Description, etc.)
            const metaResponse = await fetch(`https://api.microlink.io?url=${encodeURIComponent(currentItem.link)}&palette=true`);
            const metaData = await metaResponse.json();

            if (metaData.status === 'success') {
                const { title, description, publisher } = metaData.data;

                // Update text fields if they are empty
                setCurrentItem(prev => ({
                    ...prev,
                    title: prev.title || title || '',
                    description: prev.description || description || '',
                    // Try to guess category if publisher matches common ones
                    category: prev.category || (publisher?.toLowerCase().includes('shopify') ? 'Shopify' :
                        publisher?.toLowerCase().includes('wordpress') ? 'WordPress' : 'Other')
                }));

                // Auto-detect technologies from metadata/publisher
                const techList: string[] = [];
                if (publisher?.toLowerCase().includes('shopify')) techList.push('Shopify', 'Liquid');
                if (publisher?.toLowerCase().includes('wordpress')) techList.push('WordPress', 'PHP');
                if (currentItem.link.includes('vercel.app')) techList.push('React', 'Next.js');

                if (techList.length > 0) {
                    setCurrentItem(prev => ({
                        ...prev,
                        technologies: Array.from(new Set([...(prev.technologies || []), ...techList]))
                    }));
                }
            }

            // 2. Fetch & Upload Screenshot (optimized for size)
            const screenshotUrl = `https://api.microlink.io?url=${encodeURIComponent(currentItem.link)}&screenshot=true&meta=false&embed=screenshot.url&screenshot.width=1000&screenshot.type=jpeg&screenshot.quality=80`;
            const fileName = generateUniqueFileName('screenshot.jpg');
            const uploadPath = `portfolios/${fileName}`;
            const downloadURL = await uploadFromUrl(screenshotUrl, uploadPath);

            setCurrentItem(prev => ({ ...prev, imageUrl: downloadURL }));
            alert("Website data and screenshot imported successfully!");
        } catch (error) {
            console.error("Error auto-fetching data:", error);
            alert("Failed to auto-fetch some data. You may need to fill it manually.");
        } finally {
            setIsFetchingScreenshot(false);
        }
    };

    const handleImportFromUrl = async () => {
        if (!currentItem.imageUrl || currentItem.imageUrl.includes('firebasestorage.googleapis.com')) {
            return;
        }

        setIsUploading(true);
        try {
            const fileName = generateUniqueFileName('imported-image.jpg');
            const uploadPath = `portfolios/${fileName}`;
            const downloadURL = await uploadFromUrl(currentItem.imageUrl, uploadPath);
            setCurrentItem(prev => ({ ...prev, imageUrl: downloadURL }));
            alert("Image imported and saved to your hosting!");
        } catch (error) {
            console.error("Error importing image:", error);
            alert("Failed to import image from URL.");
        } finally {
            setIsUploading(false);
        }
    };

    React.useEffect(() => {
        fetchItems();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);
        try {
            // Generate a filename, forcing .jpg if it's an image since we optimize to JPEG
            const baseName = file.name.split('.')[0];
            const fileName = file.type.startsWith('image/')
                ? generateUniqueFileName(`${baseName}.jpg`)
                : generateUniqueFileName(file.name);

            const uploadPath = `portfolios/${fileName}`;
            const downloadURL = await uploadFileWithProgress(file, uploadPath, (progress) => {
                setUploadProgress(progress);
            });
            setCurrentItem(prev => ({ ...prev, imageUrl: downloadURL }));
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image.");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deletePortfolio(id);
                await fetchItems();
            } catch (error) {
                console.error("Error deleting item:", error);
                alert("Failed to delete item.");
            }
        }
    };

    const handleEdit = (item: PortfolioItem) => {
        setCurrentItem(item);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setCurrentItem({
            title: '',
            category: 'Shopify',
            imageUrl: '',
            description: '',
            link: '',
            technologies: [],
            isFeatured: false,
            isConcept: false,
            isPublic: true,
            order: 0
        });
        setIsEditing(true);
    };

    const toggleTechnology = (tech: string) => {
        const currentTechs = currentItem.technologies || [];
        if (currentTechs.includes(tech)) {
            setCurrentItem({ ...currentItem, technologies: currentTechs.filter(t => t !== tech) });
        } else {
            setCurrentItem({ ...currentItem, technologies: [...currentTechs, tech] });
        }
    };

    const techOptions = [
        'React', 'Next.js', 'Tailwind CSS', 'Shopify', 'Liquid', 'WordPress',
        'PHP', 'Node.js', 'Firebase', 'TypeScript', 'SEO', 'UI/UX'
    ];

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600 bg-green-50 border-green-100';
        if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-100';
        return 'text-red-600 bg-red-50 border-red-100';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentItem.title || !currentItem.imageUrl) {
            alert("Title and Image are required.");
            return;
        }

        setIsSaving(true);
        try {
            if (currentItem.id) {
                await updatePortfolio(currentItem.id, currentItem);
            } else {
                await addPortfolio(currentItem as PortfolioItem);
            }
            await fetchItems();
            setIsEditing(false);
            setCurrentItem({});
        } catch (error) {
            console.error("Error saving item:", error);
            alert("Failed to save item.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Manage Portfolio</h1>
                        <p className="text-gray-500">Add or edit portfolio items.</p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="flex items-center gap-2 mr-2">
                            <span className="text-sm text-gray-500 hidden md:block">Show</span>
                            <select
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                                className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1.5 outline-none"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode('card')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'card' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                title="Card View"
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                title="List View"
                            >
                                <List size={18} />
                            </button>
                        </div>
                        <button
                            onClick={handleAddNew}
                            className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus size={18} /> Add New Item
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by title, category, or URL..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900">
                                {currentItem.id ? 'Edit Item' : 'Add New Item'}
                            </h3>
                            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-slate-900">
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
                                    onChange={e => setCurrentItem({ ...currentItem, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Live Website URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        value={currentItem.link || ''}
                                        onChange={e => setCurrentItem({ ...currentItem, link: e.target.value })}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="https://example.com"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAutoFetchData}
                                        disabled={isFetchingScreenshot || !currentItem.link}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${isFetchingScreenshot || !currentItem.link
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-slate-900 text-white hover:bg-slate-800'
                                            }`}
                                        title="Auto-fetch title, description, tags, and screenshot"
                                    >
                                        {isFetchingScreenshot ? <Loader2 size={14} className="animate-spin" /> : <LayoutGrid size={14} />}
                                        Magic Fill
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio Image</label>
                                <div className="mt-1 flex items-center gap-4">
                                    {currentItem.imageUrl ? (
                                        <div className="relative group">
                                            <img
                                                src={currentItem.imageUrl}
                                                alt="Preview"
                                                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                                <label className="cursor-pointer text-white p-1">
                                                    <Upload size={16} />
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all overflow-hidden relative">
                                            {isUploading ? (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90">
                                                    <div className="relative w-12 h-12 flex items-center justify-center">
                                                        <Loader2 className="w-full h-full text-blue-600 animate-spin absolute" />
                                                        <span className="text-[10px] font-bold text-blue-700">{uploadProgress}%</span>
                                                    </div>
                                                    <div className="w-16 h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-600 transition-all duration-300"
                                                            style={{ width: `${uploadProgress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="w-6 h-6 text-gray-400" />
                                                    <span className="text-[10px] text-gray-500 mt-1">Upload</span>
                                                </>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                        </label>
                                    )}
                                    <div className="flex-1 space-y-2">
                                        <div className="relative flex-1">
                                            <input
                                                type="url"
                                                placeholder="Or paste image URL"
                                                value={currentItem.imageUrl || ''}
                                                onChange={e => setCurrentItem({ ...currentItem, imageUrl: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm pr-10"
                                            />
                                            {currentItem.imageUrl && !currentItem.imageUrl.includes('firebasestorage.googleapis.com') && (
                                                <button
                                                    type="button"
                                                    onClick={handleImportFromUrl}
                                                    title="Save to our hosting"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 p-1"
                                                >
                                                    {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-gray-500">Recommended: Square or 4:3 aspect ratio</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={currentItem.category || 'Shopify'}
                                    onChange={e => setCurrentItem({ ...currentItem, category: e.target.value as any })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="Shopify">Shopify</option>
                                    <option value="React">React</option>
                                    <option value="WordPress">WordPress</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
                                <div className="flex flex-wrap gap-2">
                                    {techOptions.map(tech => (
                                        <button
                                            key={tech}
                                            type="button"
                                            onClick={() => toggleTechnology(tech)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${(currentItem.technologies || []).includes(tech)
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {tech}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={currentItem.isFeatured || false}
                                        onChange={e => setCurrentItem({ ...currentItem, isFeatured: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Featured Project</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={currentItem.isPublic !== false}
                                        onChange={e => setCurrentItem({ ...currentItem, isPublic: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Public on website</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={currentItem.isConcept || false}
                                        onChange={e => setCurrentItem({ ...currentItem, isConcept: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Concept Demo</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-gray-700">Order</label>
                                    <input
                                        type="number"
                                        value={currentItem.order || 0}
                                        onChange={e => setCurrentItem({ ...currentItem, order: parseInt(e.target.value) })}
                                        className="w-16 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={currentItem.description || ''}
                                    onChange={e => setCurrentItem({ ...currentItem, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
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
                                    disabled={isSaving || isUploading}
                                    className={`px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 ${(isSaving || isUploading) ? 'opacity-70 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Save Item
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                            <div className="relative aspect-video overflow-hidden bg-gray-100">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="p-1.5 bg-white/90 text-blue-600 rounded-md shadow-sm hover:bg-white"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-1.5 bg-white/90 text-red-600 rounded-md shadow-sm hover:bg-white"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="absolute bottom-2 left-2 flex flex-col gap-1">
                                    <span className="px-2 py-0.5 bg-black/60 text-white text-[10px] font-medium rounded backdrop-blur-sm">
                                        {item.category}
                                    </span>
                                    {item.isConcept && (
                                        <span className="px-2 py-0.5 bg-purple-600/80 text-white text-[10px] font-bold rounded backdrop-blur-sm uppercase">
                                            Concept
                                        </span>
                                    )}
                                    {item.isPublic === false && (
                                        <span className="px-2 py-0.5 bg-yellow-500/80 text-black text-[10px] font-bold rounded backdrop-blur-sm uppercase">
                                            Hidden
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{item.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-3 flex-1">
                                    {item.description || 'No description provided.'}
                                </p>



                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex gap-3">
                                        {item.link ? (
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1"
                                            >
                                                <ExternalLink size={12} /> View
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">No link</span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && !isLoading && (
                        <div className="col-span-full py-12 text-center bg-white rounded-xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500">No portfolio items found. Start by adding a new one!</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Image</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Title</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Category</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Performance</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Visibility</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <img src={item.imageUrl} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        <div className="flex items-center gap-2">
                                            {item.title}
                                            {item.isConcept && (
                                                <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded uppercase">
                                                    Concept
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                            {item.category}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        {item.isPublic === false ? (
                                            <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full flex items-center gap-1">
                                                <CheckCircle size={10} className="text-yellow-500" />
                                                Hidden
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                                                <CheckCircle size={10} className="text-green-500" />
                                                Public
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No items found. Click "Add New Item" to create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Controls */}
            {items.length > itemsPerPage && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, items.length)}</span> of <span className="font-medium">{items.length}</span> items
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                        }`}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminPortfolio;
