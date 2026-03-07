import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getPrintPortfolios, PrintPortfolioCategory } from '../lib/printPortfolioService';
import { Loader, AlertCircle, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

interface LightboxState {
    open: boolean;
    categoryId: string | null;
    index: number;
}

interface PortfolioImage {
    id: string;
    src: string;
}

interface PortfolioManifest {
    generatedAt: string;
    categories: Record<string, string[]>;
}

const getCategorySlug = (category: Pick<PrintPortfolioCategory, 'id' | 'title'>) => {
    const base = category.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return base || category.id;
};

const normalizeFolderName = (value?: string) =>
    (value || '')
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '')
        .trim();

const getFolderKeyForCategory = (
    category: PrintPortfolioCategory,
    manifestCategories: Record<string, string[]>
) => {
    const keys = Object.keys(manifestCategories);
    if (keys.length === 0) return null;

    const normalizedMap = new Map<string, string>();
    keys.forEach((key) => normalizedMap.set(normalizeFolderName(key), key));

    const folderIdMatch = normalizedMap.get(normalizeFolderName(category.folderId));
    if (folderIdMatch) return folderIdMatch;

    const titleMatch = normalizedMap.get(normalizeFolderName(category.title));
    if (titleMatch) return titleMatch;

    return null;
};

const PrintPortfolio: React.FC = () => {
    const { slug } = useParams<{ slug?: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [categories, setCategories] = useState<PrintPortfolioCategory[]>([]);
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [imagesByCategory, setImagesByCategory] = useState<Record<string, PortfolioImage[]>>({});
    const [portfolioManifest, setPortfolioManifest] = useState<PortfolioManifest | null>(null);
    const [failedImageIdsByCategory, setFailedImageIdsByCategory] = useState<Record<string, string[]>>({});
    const [hasMappedLocalImages, setHasMappedLocalImages] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lightbox, setLightbox] = useState<LightboxState>({ open: false, categoryId: null, index: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);
    const [initializedFromUrl, setInitializedFromUrl] = useState(false);

    useEffect(() => {
        const fetchManifest = async () => {
            try {
                const res = await fetch('/portfolio-manifest.json', { cache: 'no-store' });
                if (!res.ok) {
                    throw new Error(`Manifest fetch failed: ${res.status}`);
                }
                const manifest = (await res.json()) as PortfolioManifest;
                setPortfolioManifest(manifest);
            } catch (e) {
                console.error('Failed to load portfolio manifest', e);
                setError('Failed to load local portfolio images manifest.');
            }
        };

        fetchManifest();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoadingCategories(true);
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
        if (!portfolioManifest) return;
        if (categories.length === 0) return;
        if (hasMappedLocalImages) return;

        try {
            const mappedImagesByCategory: Record<string, PortfolioImage[]> = {};
            const mappedFailedByCategory: Record<string, string[]> = {};

            categories.forEach((category) => {
                const folderKey = getFolderKeyForCategory(category, portfolioManifest.categories);
                const files = folderKey ? portfolioManifest.categories[folderKey] || [] : [];
                mappedImagesByCategory[category.id] = files.map((src, index) => ({
                    id: `${category.id}-${index + 1}`,
                    src
                }));
                mappedFailedByCategory[category.id] = [];
            });

            setImagesByCategory(mappedImagesByCategory);
            setFailedImageIdsByCategory(mappedFailedByCategory);
            setHasMappedLocalImages(true);
            setError(null);
        } catch (e) {
            console.error('Failed to map local images by category', e);
            setError('Failed to prepare local images for this page.');
        }
    }, [portfolioManifest, categories, hasMappedLocalImages]);

    const markImageFailed = (categoryId: string | null, imageId: string) => {
        if (!categoryId) return;
        setFailedImageIdsByCategory(prev => {
            const existing = prev[categoryId] || [];
            if (existing.includes(imageId)) return prev;
            return { ...prev, [categoryId]: [...existing, imageId] };
        });
    };

    const activeCategory = categories.find(c => c.id === activeCategoryId) || null;
    const activeSlug = activeCategory ? getCategorySlug(activeCategory) : null;
    const activeImages =
        activeCategoryId
            ? (imagesByCategory[activeCategoryId] || []).filter(
                  img => !(failedImageIdsByCategory[activeCategoryId] || []).includes(img.id)
              )
            : [];

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

    const updateCategoryUrlSilently = (nextSlug: string) => {
        const params = new URLSearchParams(searchParams);
        params.delete('image');
        const query = params.toString();
        const nextUrl = query
            ? `/print-portfolio/${nextSlug}?${query}`
            : `/print-portfolio/${nextSlug}`;
        window.history.replaceState(window.history.state, '', nextUrl);
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
                        pulled directly from our local portfolio library.
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
                                            updateCategoryUrlSilently(slugForCategory);
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
                                                src={coverImage.src}
                                                alt={`${activeCategory.title} cover`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onLoad={(e) => {
                                                    console.log('PrintPortfolio: cover image loaded', {
                                                        categoryId: activeCategory.id,
                                                        imageId: coverImage.id,
                                                        src: e.currentTarget.currentSrc,
                                                        width: e.currentTarget.naturalWidth,
                                                        height: e.currentTarget.naturalHeight
                                                    });
                                                }}
                                                onError={(e) => {
                                                    const target = e.currentTarget;
                                                    const failedSrc = target.currentSrc || target.src;
                                                    console.error('PrintPortfolio: cover image failed', {
                                                        categoryId: activeCategory.id,
                                                        imageId: coverImage.id,
                                                        src: failedSrc
                                                    });
                                                    markImageFailed(activeCategory.id, coverImage.id);
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                                        </button>
                                    </div>
                                )}
                                {!hasMappedLocalImages && (
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Loader className="animate-spin mr-2" size={18} />
                                        Preparing images...
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
                                {totalImages === 0 && hasMappedLocalImages && (
                                    <div className="border border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400 text-sm">
                                        No images found in this local folder yet.
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
                                            {paginatedImages.map((image, index) => (
                                                <button
                                                    key={`${image.id}-${index}`}
                                                    type="button"
                                                    className="group relative aspect-[3/4] md:aspect-[4/5] rounded-xl overflow-hidden bg-gray-50 shadow-sm hover:shadow-md transition-all"
                                                    onClick={() => openLightbox(indexOfFirst + index)}
                                                >
                                                    <img
                                                        src={image.src}
                                                        alt={`${activeCategory.title} sample ${indexOfFirst + index + 1}`}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        onLoad={(e) => {
                                                            console.log('PrintPortfolio: grid image loaded', {
                                                                categoryId: activeCategory.id,
                                                                imageId: image.id,
                                                                index: indexOfFirst + index,
                                                                src: e.currentTarget.currentSrc,
                                                                width: e.currentTarget.naturalWidth,
                                                                height: e.currentTarget.naturalHeight
                                                            });
                                                        }}
                                                        onError={(e) => {
                                                            const target = e.currentTarget;
                                                            const failedSrc = target.currentSrc || target.src;
                                                            console.error('PrintPortfolio: grid image failed', {
                                                                categoryId: activeCategory.id,
                                                                imageId: image.id,
                                                                index: indexOfFirst + index,
                                                                src: failedSrc
                                                            });
                                                            markImageFailed(activeCategory.id, image.id);
                                                        }}
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
                            src={lightboxCurrentImage.src}
                            alt="Print portfolio item"
                            className="w-full h-full object-contain rounded-lg shadow-2xl"
                            onLoad={(e) => {
                                console.log('PrintPortfolio: lightbox image loaded', {
                                    categoryId: lightbox.categoryId,
                                    imageId: lightboxCurrentImage.id,
                                    index: lightbox.index,
                                    src: e.currentTarget.currentSrc,
                                    width: e.currentTarget.naturalWidth,
                                    height: e.currentTarget.naturalHeight
                                });
                            }}
                            onError={(e) => {
                                const target = e.currentTarget;
                                const failedSrc = target.currentSrc || target.src;
                                console.error('PrintPortfolio: lightbox image failed', {
                                    categoryId: lightbox.categoryId,
                                    imageId: lightboxCurrentImage.id,
                                    index: lightbox.index,
                                    src: failedSrc
                                });
                                markImageFailed(lightbox.categoryId, lightboxCurrentImage.id);
                                closeLightbox();
                            }}
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
