import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PORTFOLIO_CONFIG } from '../data/portfolioConfig';
import { getPrintPortfolios, PrintPortfolioCategory } from '../lib/printPortfolioService';
import { Loader, AlertCircle, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

interface LightboxState {
    open: boolean;
    categoryId: string | null;
    index: number;
}

const PrintPortfolio: React.FC = () => {
    const [categories, setCategories] = useState<PrintPortfolioCategory[]>([]);
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [imagesByCategory, setImagesByCategory] = useState<Record<string, string[]>>({});
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [lightbox, setLightbox] = useState<LightboxState>({ open: false, categoryId: null, index: 0 });

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoadingCategories(true);
            setError(null);
            try {
                const items = await getPrintPortfolios();
                const visible = items.filter(item => item.isPublic !== false);
                const sorted = visible.sort((a, b) => (a.order || 0) - (b.order || 0));
                setCategories(sorted);
                if (sorted.length > 0) {
                    setActiveCategoryId(sorted[0].id);
                }
            } catch (e) {
                console.error('Failed to load print portfolios', e);
                setError('Failed to load print portfolio categories.');
            } finally {
                setIsLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const loadImages = async () => {
            if (!activeCategoryId) return;
            if (imagesByCategory[activeCategoryId]) return;

            const category = categories.find(c => c.id === activeCategoryId);
            if (!category || !category.folderId || !PORTFOLIO_CONFIG.apiKey) return;

            setLoadingCategoryId(activeCategoryId);
            setError(null);

            try {
                const query = `'${category.folderId}' in parents and trashed = false and mimeType contains 'image/'`;
                const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)&key=${PORTFOLIO_CONFIG.apiKey}&pageSize=80`;

                const res = await fetch(url);
                if (!res.ok) {
                    throw new Error(`Google Drive API error: ${res.status}`);
                }

                const result = await res.json();
                if (result.files) {
                    const images = result.files.map((f: any) => `https://lh3.googleusercontent.com/d/${f.id}`);
                    setImagesByCategory(prev => ({ ...prev, [activeCategoryId]: images }));
                }
            } catch (e) {
                console.error('Failed to load images for category', e);
                setError('Failed to load images from Google Drive for this category.');
            } finally {
                setLoadingCategoryId(null);
            }
        };

        loadImages();
    }, [activeCategoryId, categories, imagesByCategory]);

    const activeCategory = categories.find(c => c.id === activeCategoryId) || null;
    const activeImages = activeCategoryId ? imagesByCategory[activeCategoryId] || [] : [];

    const openLightbox = (index: number) => {
        if (!activeCategoryId) return;
        setLightbox({ open: true, categoryId: activeCategoryId, index });
    };

    const closeLightbox = () => {
        setLightbox(prev => ({ ...prev, open: false }));
    };

    const navigateLightbox = (direction: 1 | -1, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!lightbox.categoryId) return;
        const images = imagesByCategory[lightbox.categoryId] || [];
        if (images.length === 0) return;
        setLightbox(prev => ({
            ...prev,
            index: (prev.index + direction + images.length) % images.length
        }));
    };

    const lightboxImages = lightbox.categoryId ? imagesByCategory[lightbox.categoryId] || [] : [];
    const lightboxCurrentImage =
        lightbox.open && lightboxImages.length > 0 ? lightboxImages[lightbox.index] : null;

    return (
        <div className="min-h-screen bg-white py-20">
            <Helmet>
                <title>Print Portfolio | Vance Graphix &amp; Print (VGP)</title>
                <meta
                    name="description"
                    content="Explore our print design portfolio including business cards, brochures, packaging, signage and more."
                />
                <link rel="canonical" href="https://vancegraphix.com.au/print-portfolio" />
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Print Portfolio</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Browse our print work by category. Select a category on the left to explore full galleries
                        pulled directly from our studio Google Drive.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 border-b border-gray-100 lg:border-b-0 lg:border-r lg:pr-4">
                            {isLoadingCategories && (
                                <div className="flex items-center justify-center w-full py-6">
                                    <Loader className="animate-spin text-blue-600" size={24} />
                                </div>
                            )}

                            {!isLoadingCategories &&
                                categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveCategoryId(category.id)}
                                        className={`flex items-center justify-between lg:justify-start gap-3 px-4 py-3 rounded-xl whitespace-nowrap text-sm font-medium transition-all ${
                                            category.id === activeCategoryId
                                                ? 'bg-slate-900 text-white shadow-sm'
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span>{category.title}</span>
                                        {category.order !== undefined && (
                                            <span className="text-[10px] uppercase tracking-wider text-gray-400 lg:hidden">
                                                #{category.order}
                                            </span>
                                        )}
                                    </button>
                                ))}

                            {!isLoadingCategories && categories.length === 0 && (
                                <div className="text-sm text-gray-400 py-4">
                                    No print portfolio categories yet. Add some in the admin panel.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        {error && (
                            <div className="flex items-center mb-4 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
                                <AlertCircle size={16} className="mr-2" />
                                {error}
                            </div>
                        )}

                        {activeCategory && (
                            <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                                            <LayoutGrid size={18} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900">
                                            {activeCategory.title}
                                        </h2>
                                    </div>
                                    {activeCategory.description && (
                                        <p className="text-gray-500 text-sm max-w-xl">
                                            {activeCategory.description}
                                        </p>
                                    )}
                                </div>
                                {loadingCategoryId === activeCategory.id && (
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Loader className="animate-spin mr-2" size={18} />
                                        Loading images from Google Drive...
                                    </div>
                                )}
                            </div>
                        )}

                        {!activeCategory && !isLoadingCategories && (
                            <div className="text-gray-400 text-sm">
                                Select a category from the left to view its portfolio.
                            </div>
                        )}

                        {activeCategory && (
                            <>
                                {activeImages.length === 0 && loadingCategoryId !== activeCategory.id && (
                                    <div className="border border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400 text-sm">
                                        No images found in this Google Drive folder yet.
                                    </div>
                                )}

                                {activeImages.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {activeImages.map((src, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                className="group relative aspect-[3/4] md:aspect-[4/5] rounded-xl overflow-hidden bg-gray-50 shadow-sm hover:shadow-md transition-all"
                                                onClick={() => openLightbox(index)}
                                            >
                                                <img
                                                    src={src}
                                                    alt={`${activeCategory.title} sample ${index + 1}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {lightbox.open && lightboxCurrentImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
                    >
                        ×
                    </button>

                    <button
                        onClick={e => navigateLightbox(-1, e)}
                        className="absolute left-4 md:left-10 text-white/70 hover:text-white transition-colors p-4 hover:bg-white/10 rounded-full"
                    >
                        <ChevronLeft size={40} />
                    </button>

                    <div className="max-w-5xl max-h-[85vh] w-full px-4" onClick={e => e.stopPropagation()}>
                        <img
                            src={lightboxCurrentImage}
                            alt="Print portfolio item"
                            className="w-full h-full object-contain rounded-lg shadow-2xl"
                        />
                    </div>

                    <button
                        onClick={e => navigateLightbox(1, e)}
                        className="absolute right-4 md:right-10 text-white/70 hover:text-white transition-colors p-4 hover:bg-white/10 rounded-full"
                    >
                        <ChevronRight size={40} />
                    </button>

                    <div className="absolute top-6 left-6 text-white/60 text-sm">
                        {lightbox.index + 1} / {lightboxImages.length}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrintPortfolio;

