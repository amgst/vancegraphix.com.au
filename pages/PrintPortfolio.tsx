import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PORTFOLIO_CONFIG } from '../data/portfolioConfig';
import { getPrintPortfolios, PrintPortfolioCategory } from '../lib/printPortfolioService';
import { Loader, AlertCircle, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

interface LightboxState {
    open: boolean;
    categoryId: string | null;
    index: number;
}

const getCategorySlug = (category: Pick<PrintPortfolioCategory, 'id' | 'title'>) => {
    const base = category.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return base || category.id;
};

const PrintPortfolio: React.FC = () => {
    const { slug } = useParams<{ slug?: string }>();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [categories, setCategories] = useState<PrintPortfolioCategory[]>([]);
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [imagesByCategory, setImagesByCategory] = useState<Record<string, string[]>>({});
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [lightbox, setLightbox] = useState<LightboxState>({ open: false, categoryId: null, index: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);
    const [initializedFromUrl, setInitializedFromUrl] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoadingCategories(true);
            setError(null);
            try {
                const items = await getPrintPortfolios();
                console.log('PrintPortfolio: fetched categories from Firestore', items);
                const visible = items.filter(item => item.isPublic !== false);
                const sorted = visible.sort((a, b) => (a.order || 0) - (b.order || 0));
                console.log('PrintPortfolio: visible sorted categories', sorted);
                setCategories(sorted);
                if (sorted.length > 0) {
                    let initialId: string | null = sorted[0].id;
                    if (slug) {
                        const match = sorted.find(cat => getCategorySlug(cat) === slug);
                        if (match) {
                            initialId = match.id;
                        }
                    }
                    setActiveCategoryId(initialId);
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
            if (imagesByCategory[activeCategoryId]) {
                console.log('PrintPortfolio: images already loaded for category', activeCategoryId);
                return;
            }

            const category = categories.find(c => c.id === activeCategoryId);
            if (!category) {
                console.log('PrintPortfolio: no category found for id', activeCategoryId);
                return;
            }
            if (!category.folderId) {
                console.log('PrintPortfolio: category has no folderId', category);
                return;
            }
            if (!PORTFOLIO_CONFIG.apiKey) {
                console.log('PrintPortfolio: missing Google Drive API key');
                return;
            }

            console.log('PrintPortfolio: loading images', {
                activeCategoryId,
                folderId: category.folderId,
                apiKeyPresent: !!PORTFOLIO_CONFIG.apiKey
            });

            setLoadingCategoryId(activeCategoryId);
            setError(null);

            try {
                const query = `'${category.folderId}' in parents and trashed = false and mimeType contains 'image/'`;
                const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)&key=${PORTFOLIO_CONFIG.apiKey}&pageSize=80`;
                console.log('PrintPortfolio: requesting Google Drive API', url);

                const res = await fetch(url);
                console.log('PrintPortfolio: response status', res.status, res.ok);
                if (!res.ok) {
                    throw new Error(`Google Drive API error: ${res.status}`);
                }

                const result = await res.json();
                console.log('PrintPortfolio: API result', result);
                if (result.files) {
                    const images = result.files.map(
                        (f: any) => `https://drive.google.com/uc?export=view&id=${f.id}`
                    );
                    console.log('PrintPortfolio: mapped image URLs', images);
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
    const activeSlug = activeCategory ? getCategorySlug(activeCategory) : null;
    const activeImages = activeCategoryId ? imagesByCategory[activeCategoryId] || [] : [];

    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategoryId, activeImages.length]);

    const totalImages = activeImages.length;
    const coverImage = totalImages > 0 ? activeImages[0] : null;
    const totalPages = Math.ceil(totalImages / itemsPerPage) || 1;
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const paginatedImages = activeImages.slice(indexOfFirst, indexOfLast);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const getGridClass = () => {
        if (gridCols === 2) return "grid-cols-2 md:grid-cols-2 xl:grid-cols-2";
        if (gridCols === 4) return "grid-cols-2 md:grid-cols-3 xl:grid-cols-4";
        return "grid-cols-2 md:grid-cols-3 xl:grid-cols-3";
    };

    const openLightbox = (index: number) => {
        if (!activeCategoryId) return;
        setLightbox({ open: true, categoryId: activeCategoryId, index });
        const params = new URLSearchParams(searchParams);
        params.set('image', String(index + 1));
        setSearchParams(params);
    };

    const closeLightbox = () => {
        setLightbox(prev => ({ ...prev, open: false }));
        const params = new URLSearchParams(searchParams);
        params.delete('image');
        setSearchParams(params);
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

    useEffect(() => {
        if (initializedFromUrl) return;
        if (!activeCategoryId) return;
        if (activeImages.length === 0) return;

        const imageParam = searchParams.get('image');
        const indexFromUrl = imageParam ? parseInt(imageParam, 10) - 1 : -1;
        if (indexFromUrl >= 0 && indexFromUrl < activeImages.length) {
            setLightbox({ open: true, categoryId: activeCategoryId, index: indexFromUrl });
        }
        setInitializedFromUrl(true);
    }, [activeCategoryId, activeImages.length, searchParams, initializedFromUrl]);

    const pageTitle = activeCategory
        ? `${activeCategory.title} Print Portfolio | Vance Graphix & Print (VGP)`
        : 'Print Portfolio | Vance Graphix & Print (VGP)';

    const metaDescription =
        activeCategory?.description ||
        'Explore our print design portfolio including business cards, brochures, packaging, signage and more.';

    const canonicalPath = activeSlug ? `/print-portfolio/${activeSlug}` : '/print-portfolio';

    return (
        <div className="min-h-screen bg-white py-20">
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={metaDescription} />
                <link rel="canonical" href={`https://vancegraphix.com.au${canonicalPath}`} />
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
                                        onClick={() => {
                                            setActiveCategoryId(category.id);
                                            const slugForCategory = getCategorySlug(category);
                                            navigate(`/print-portfolio/${slugForCategory}`);
                                        }}
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
                            <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                                <div className="flex-1">
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
                                {coverImage && (
                                    <div className="w-full max-w-xs lg:max-w-sm">
                                        <button
                                            type="button"
                                            className="group relative aspect-[3/2] rounded-2xl overflow-hidden bg-gray-50 shadow-sm hover:shadow-md transition-all w-full"
                                            onClick={() => openLightbox(0)}
                                        >
                                            <img
                                                src={coverImage}
                                                alt={`${activeCategory.title} cover`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                                        </button>
                                    </div>
                                )}
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
                                {totalImages === 0 && loadingCategoryId !== activeCategory.id && (
                                    <div className="border border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400 text-sm">
                                        No images found in this Google Drive folder yet.
                                    </div>
                                )}

                                {totalImages > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-gray-500">
                                            <div>
                                                Showing{" "}
                                                <span className="font-semibold text-slate-900">
                                                    {indexOfFirst + 1}-{Math.min(indexOfLast, totalImages)}
                                                </span>{" "}
                                                of{" "}
                                                <span className="font-semibold text-slate-900">{totalImages}</span>{" "}
                                                images
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="uppercase tracking-wider font-semibold text-[10px] text-gray-400">
                                                    Layout
                                                </span>
                                                <div className="flex bg-white border border-gray-200 rounded-lg p-0.5">
                                                    {[2, 3, 4].map(num => (
                                                        <button
                                                            key={num}
                                                            type="button"
                                                            onClick={() => setGridCols(num as 2 | 3 | 4)}
                                                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                                                                gridCols === num
                                                                    ? "bg-slate-900 text-white shadow-sm"
                                                                    : "text-gray-400 hover:text-slate-900"
                                                            }`}
                                                        >
                                                            {num}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`grid ${getGridClass()} gap-4`}>
                                            {paginatedImages.map((src, index) => (
                                                <button
                                                    key={`${src}-${index}`}
                                                    type="button"
                                                    className="group relative aspect-[3/4] md:aspect-[4/5] rounded-xl overflow-hidden bg-gray-50 shadow-sm hover:shadow-md transition-all"
                                                    onClick={() => openLightbox(indexOfFirst + index)}
                                                >
                                                    <img
                                                        src={src}
                                                        alt={`${activeCategory.title} sample ${indexOfFirst + index + 1}`}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        loading="lazy"
                                                        decoding="async"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                                                </button>
                                            ))}
                                        </div>

                                        {totalImages > itemsPerPage && (
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100 text-xs">
                                                <div className="text-gray-500">
                                                    Page{" "}
                                                    <span className="font-semibold text-slate-900">
                                                        {currentPage}
                                                    </span>{" "}
                                                    of{" "}
                                                    <span className="font-semibold text-slate-900">
                                                        {totalPages}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all ${
                                                            currentPage === 1
                                                                ? "border-gray-100 text-gray-300 cursor-not-allowed"
                                                                : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-slate-900"
                                                        }`}
                                                    >
                                                        <ChevronLeft size={14} />
                                                        <span>Prev</span>
                                                    </button>

                                                    <div className="flex items-center gap-1">
                                                        {Array.from(
                                                            { length: totalPages },
                                                            (_, i) => i + 1
                                                        ).map(page => (
                                                            <button
                                                                key={page}
                                                                type="button"
                                                                onClick={() => handlePageChange(page)}
                                                                className={`w-8 h-8 rounded-lg font-semibold transition-all ${
                                                                    currentPage === page
                                                                        ? "bg-blue-600 text-white shadow"
                                                                        : "text-gray-500 hover:bg-gray-50 hover:text-slate-900"
                                                                }`}
                                                            >
                                                                {page}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all ${
                                                            currentPage === totalPages
                                                                ? "border-gray-100 text-gray-300 cursor-not-allowed"
                                                                : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-slate-900"
                                                        }`}
                                                    >
                                                        <span>Next</span>
                                                        <ChevronRight size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
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
