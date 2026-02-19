import React, { useState, useEffect } from 'react';
import { ArrowUpRight, X, ChevronLeft, ChevronRight, Loader, ExternalLink, AlertCircle, ArrowLeft, Zap, Search, ShieldCheck, CheckCircle } from 'lucide-react';
import { getPortfolios, PortfolioItem } from '../lib/portfolioService';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface ProjectItem {
  id: string | number;
  title: string;
  category: string;
  img: string;
}

const Portfolio: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const specificFolderId = searchParams.get('folderId');
  const specificTitle = searchParams.get('title');

  const [activeTab, setActiveTab] = useState(categoryParam || 'All');

  useEffect(() => {
    if (categoryParam) {
      setActiveTab(categoryParam);
    }
  }, [categoryParam]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  // Pagination & Layout State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [gridCols, setGridCols] = useState(3);

  // Data State
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ['All', 'Shopify', 'React', 'WordPress', 'Graphics', 'Other'];

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setProjects([]);
      setCurrentPage(1);

      try {
        const fetchedItems = await getPortfolios();

        // Sort by order if available
        const sortedItems = [...fetchedItems].sort((a, b) => (a.order || 0) - (b.order || 0));

        // Filter based on active tab or specific params
        let filteredItems = sortedItems;

        if (activeTab !== 'All') {
          filteredItems = filteredItems.filter(item => item.category === activeTab);
        }

        setProjects(filteredItems);

      } catch (err: any) {
        console.error("Error fetching portfolios:", err);
        setError("Failed to load portfolio items.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, specificFolderId, specificTitle]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const totalResults = projects.length;
  const showingStart = totalResults > 0 ? indexOfFirstItem + 1 : 0;
  const showingEnd = Math.min(indexOfLastItem, totalResults);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const gridElement = document.getElementById('portfolio-grid');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getGridClass = () => {
    switch (gridCols) {
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  // Lightbox Handlers
  const openLightbox = (index: number) => {
    setCurrentProjectIndex(indexOfFirstItem + index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const nextProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentProjectIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const currentProject = projects[currentProjectIndex];

  return (
    <div className="min-h-screen bg-white py-20">
      <Helmet>
        <title>Our Portfolio | wbify Creative Studio</title>
        <meta name="description" content="Explore our portfolio of graphic design, web development, and video projects. See how we help brands stand out." />
        <link rel="canonical" href="https://www.wbify.com/portfolio" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          {specificFolderId ? (
            <div className="mb-4">
              <Link to="/portfolio" className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-6">
                <ArrowLeft size={18} className="mr-2" /> Back to Main Portfolio
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{specificTitle || 'Project Gallery'}</h1>
            </div>
          ) : (
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Our Portfolio</h1>
          )}

          <p className="text-gray-500 max-w-2xl mx-auto">
            Explore our latest work. Select a category below.
          </p>
        </div>

        {/* Tabs - Hide if viewing specific folder */}
        {!specificFolderId && (
          <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-gray-100 pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-3 text-sm font-medium transition-all relative ${activeTab === cat
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-slate-900'
                  }`}
              >
                {cat}
                {activeTab === cat && (
                  <span className="absolute bottom-[-5px] left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Status Indicators */}
        <div className="flex justify-center mb-10 space-x-4">
          {error && (
            <div className="flex items-center text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}
        </div>

        {/* Controls Bar */}
        {!isLoading && (
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <div className="text-sm text-gray-500 font-medium">
              Showing <span className="text-slate-900">{showingStart}-{showingEnd}</span> of <span className="text-slate-900">{totalResults}</span> projects
            </div>

            <div className="flex items-center gap-6">
              {/* Items Per Page */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-gray-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-2 py-1 outline-none cursor-pointer hover:border-gray-300 transition-colors"
                >
                  <option value={6}>6</option>
                  <option value={9}>9</option>
                  <option value={12}>12</option>
                  <option value={18}>18</option>
                  <option value={24}>24</option>
                </select>
              </div>

              {/* Grid Columns */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Layout:</span>
                <div className="flex bg-white border border-gray-200 rounded-lg p-0.5">
                  {[2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setGridCols(num)}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${gridCols === num
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-gray-400 hover:text-slate-900'
                        }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid or Loader */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin text-blue-600" size={40} />
          </div>
        ) : (
          <>
            <div id="portfolio-grid" className={`grid ${getGridClass()} gap-8`}>
              {currentItems.length > 0 ? (
                currentItems.map((project, index) => (
                  <div
                    key={project.id}
                    className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    {/* Browser Mockup Frame */}
                    <div
                      className="relative aspect-[16/10] bg-gray-100 overflow-hidden cursor-pointer flex flex-col"
                      onClick={() => openLightbox(index)}
                    >
                      {/* Browser Header */}
                      <div className="h-6 bg-gray-200 border-b border-gray-300 flex items-center px-3 gap-1.5 shrink-0">
                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <div className="ml-2 flex-1 bg-white/50 rounded h-3.5 flex items-center px-2">
                          <div className="w-1/3 h-1.5 bg-gray-300/50 rounded-full"></div>
                        </div>
                      </div>

                      <div className="relative flex-1 overflow-hidden">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full text-slate-900 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <ArrowUpRight size={24} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 text-[10px] font-bold tracking-wider uppercase px-2 py-1 bg-blue-50 rounded">
                            {project.category}
                          </span>
                          {project.isConcept && (
                            <span className="text-purple-600 text-[10px] font-bold tracking-wider uppercase px-2 py-1 bg-purple-50 rounded flex items-center gap-1">
                              <Zap size={10} className="fill-purple-600" /> Concept
                            </span>
                          )}
                        </div>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                      <h3 className="text-slate-900 text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h3>

                      {project.performanceScore !== undefined && (
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1" title="Performance Score">
                            <Zap size={12} className={project.performanceScore >= 90 ? 'text-green-500' : project.performanceScore >= 50 ? 'text-yellow-500' : 'text-red-500'} />
                            <span className="text-[10px] font-bold text-gray-600">{project.performanceScore}</span>
                          </div>
                          <div className="flex items-center gap-1" title="SEO Score">
                            <Search size={12} className={(project.seoScore || 0) >= 90 ? 'text-green-500' : (project.seoScore || 0) >= 50 ? 'text-yellow-500' : 'text-red-500'} />
                            <span className="text-[10px] font-bold text-gray-600">{project.seoScore}</span>
                          </div>
                        </div>
                      )}

                      {project.technologies && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {project.technologies.slice(0, 3).map(tech => (
                            <span key={tech} className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="text-[10px] text-gray-400 px-1">+{project.technologies.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-gray-400">
                  <p>No projects found in this collection.</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {!isLoading && projects.length > itemsPerPage && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-16 pt-8 border-t border-gray-100 gap-6">
                <div className="text-sm text-gray-500">
                  Page <span className="font-bold text-slate-900">{currentPage}</span> of <span className="font-bold text-slate-900">{totalPages}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium transition-all ${currentPage === 1
                      ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-slate-900 hover:border-gray-300'
                      }`}
                  >
                    <ChevronLeft size={18} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        onClick={() => handlePageChange(number)}
                        className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === number
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-slate-900'
                          }`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium transition-all ${currentPage === totalPages
                      ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-slate-900 hover:border-gray-300'
                      }`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && currentProject && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-fade-in" onClick={closeLightbox}>
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 z-[110]"
          >
            <X size={32} />
          </button>

          <div className="w-full h-full flex flex-col md:flex-row items-center justify-center p-4 md:p-12 gap-8" onClick={(e) => e.stopPropagation()}>
            {/* Image Container */}
            <div className="relative flex-1 flex items-center justify-center w-full h-full max-h-[50vh] md:max-h-full">
              <button
                onClick={prevProject}
                className="absolute left-0 text-white/50 hover:text-white transition-colors p-2 z-10"
              >
                <ChevronLeft size={48} />
              </button>

              <img
                src={currentProject.imageUrl}
                alt={currentProject.title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />

              <button
                onClick={nextProject}
                className="absolute right-0 text-white/50 hover:text-white transition-colors p-2 z-10"
              >
                <ChevronRight size={48} />
              </button>
            </div>

            {/* Project Details */}
            <div className="w-full md:w-80 flex flex-col text-white animate-fade-in-up">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-400 text-sm font-bold tracking-wider uppercase">
                  {currentProject.category}
                </span>
                {currentProject.isConcept && (
                  <span className="text-purple-400 text-[10px] font-bold tracking-wider uppercase px-2 py-1 bg-purple-50/10 rounded border border-purple-400/20 flex items-center gap-1">
                    <Zap size={10} className="fill-purple-400" /> Concept
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-bold mb-4">{currentProject.title}</h2>

              {currentProject.performanceScore !== undefined && (
                <div className="flex gap-4 mb-6">
                  <div className="flex flex-col items-center p-3 bg-white/5 rounded-xl border border-white/10 min-w-[70px]">
                    <Zap size={20} className={currentProject.performanceScore >= 90 ? 'text-green-400' : currentProject.performanceScore >= 50 ? 'text-yellow-400' : 'text-red-400'} />
                    <span className="text-xl font-bold mt-1">{currentProject.performanceScore}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Perf</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-white/5 rounded-xl border border-white/10 min-w-[70px]">
                    <Search size={20} className={(currentProject.seoScore || 0) >= 90 ? 'text-green-400' : (currentProject.seoScore || 0) >= 50 ? 'text-yellow-400' : 'text-red-400'} />
                    <span className="text-xl font-bold mt-1">{currentProject.seoScore}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">SEO</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-white/5 rounded-xl border border-white/10 min-w-[70px]">
                    <ShieldCheck size={20} className={(currentProject.accessibilityScore || 0) >= 90 ? 'text-green-400' : (currentProject.accessibilityScore || 0) >= 50 ? 'text-yellow-400' : 'text-red-400'} />
                    <span className="text-xl font-bold mt-1">{currentProject.accessibilityScore}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Access</span>
                  </div>
                </div>
              )}

              {currentProject.description && (
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {currentProject.description}
                </p>
              )}

              {currentProject.technologies && (
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-3">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentProject.technologies.map(tech => (
                      <span key={tech} className="text-xs bg-white/10 px-3 py-1 rounded-full border border-white/10">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {currentProject.link && (
                <a
                  href={currentProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20"
                >
                  Visit Website <ExternalLink size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {projects.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${i === currentProjectIndex ? 'w-8 bg-blue-600' : 'bg-white/20'}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;