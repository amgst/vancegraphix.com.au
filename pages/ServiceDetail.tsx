import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Check, Clock, Shield, X, ChevronLeft, ChevronRight, Loader, ArrowRight, LayoutGrid } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../data/portfolioConfig';
import { getServiceCategories, ServiceCategory, ServiceItem } from '../lib/servicesService';
import { Helmet } from 'react-helmet-async';

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [serviceData, setServiceData] = useState<{ service: ServiceItem, category: ServiceCategory } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Gallery State
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch Service Data
  useEffect(() => {
    const fetchService = async () => {
      setIsLoading(true);
      try {
        const categories = await getServiceCategories();
        let found = null;
        for (const cat of categories) {
          const s = cat.services.find(item => item.id === id);
          if (s) {
            found = { service: s, category: cat };
            break;
          }
        }
        setServiceData(found);
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchService();
  }, [id]);

  // Fetch gallery images if ID is present
  useEffect(() => {
    const fetchGallery = async () => {
      setGalleryImages([]);

      const service = serviceData?.service;
      if (!service?.galleryFolderId || !PORTFOLIO_CONFIG.apiKey) return;

      setLoadingImages(true);
      try {
        const query = `'${service.galleryFolderId}' in parents and trashed = false and mimeType contains 'image/'`;
        const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,mimeType)&key=${PORTFOLIO_CONFIG.apiKey}&pageSize=6`;

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`API Error: ${res.status}`);
        }

        const result = await res.json();

        if (result.files) {
          const images = result.files.map(
            (f: any) =>
              `https://www.googleapis.com/drive/v3/files/${f.id}?alt=media&key=${PORTFOLIO_CONFIG.apiKey}`
          );
          setGalleryImages(images);
        }
      } catch (e) {
        console.error("Failed to load service gallery", e);
      } finally {
        setLoadingImages(false);
      }
    };

    if (serviceData) {
      fetchGallery();
    }
  }, [serviceData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!serviceData) {
    return <Navigate to="/services" replace />;
  }

  const { service, category } = serviceData;

  // Lightbox handlers
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(-1);
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
  };
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const portfolioLink = service.galleryFolderId
    ? `/portfolio?folderId=${service.galleryFolderId}&title=${encodeURIComponent(service.title + ' Portfolio')}`
    : '/portfolio';

  return (
    <div className="min-h-screen bg-white pb-20">
      <Helmet>
        <title>{service.title} | Vance Graphix &amp; Print (VGP)</title>
        <meta name="description" content={service.description} />
        <link rel="canonical" href={`https://vancegraphix.com.au/service/${service.id}`} />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/services" className="hover:text-slate-900">Services</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900 font-medium">{category.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{service.title}</h1>
              <p className="text-xl text-gray-500 leading-relaxed">{service.longDescription || service.description}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Check className="text-blue-600 mr-3" size={20} />
                    <span className="text-slate-800 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery Preview Section */}
            {(loadingImages || galleryImages.length > 0) && (
              <div className="border-t border-gray-100 pt-10">
                <div className="flex justify-between items-end mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Recent Projects</h2>
                  <Link to={portfolioLink} className="text-blue-600 font-medium text-sm hover:underline flex items-center">
                    View Full Portfolio <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>

                {loadingImages ? (
                  <div className="flex justify-center py-10">
                    <Loader className="animate-spin text-blue-600" size={32} />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer shadow-sm hover:shadow-md transition-all"
                        onClick={() => openLightbox(idx)}
                      >
                        <img
                          src={img}
                          alt="Work Sample"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Why Choose Us */}
            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100 mt-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Why choose Vance Graphix &amp; Print for {service.title}?</h3>
              <p className="text-slate-700 mb-4 leading-relaxed">
                We don't just deliver files; we deliver results. Our team of experts follows industry best practices to ensure your project stands out. We offer unlimited revisions during the draft phase to ensure you are 100% happy.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-slate-700 text-sm">
                  <Shield className="w-4 h-4 mr-2 text-blue-600" /> 100% Satisfaction Guarantee
                </li>
                <li className="flex items-center text-slate-700 text-sm">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" /> On-time Delivery
                </li>
              </ul>
            </div>

            {/* Bottom Portfolio CTA */}
            {service.galleryFolderId && (
              <div className="mt-10 p-1">
                <Link to={portfolioLink}>
                  <button className="w-full py-6 border-2 border-slate-900 rounded-2xl text-slate-900 font-bold text-lg hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-3">
                    <LayoutGrid size={24} />
                    View Complete {service.title} Portfolio
                  </button>
                </Link>
              </div>
            )}

          </div>

          {/* Sidebar / Pricing Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-slate-900 p-6 text-white text-center">
                <h3 className="text-lg font-medium opacity-90">Standard Package</h3>
                <div className="text-4xl font-bold mt-2">{service.pricing?.standard || 'Contact Us'}</div>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-4">
                  <span className="text-gray-500 flex items-center"><Clock size={16} className="mr-2" /> Delivery Time</span>
                  <span className="font-semibold text-slate-900">{service.deliveryTime || 'Flexible'}</span>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-900">Features:</p>
                  {service.features.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-start text-sm text-gray-600">
                      <Check size={16} className="text-green-500 mr-2 mt-0.5" />
                      {f}
                    </div>
                  ))}
                </div>

                <Link to="/contact" className="block">
                  <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                    Continue ({service.pricing?.standard || 'Get Quote'})
                  </button>
                </Link>

                <div className="text-center text-xs text-gray-400">
                  Need a custom quote? <Link to="/contact" className="text-blue-600 underline">Contact us</Link>
                </div>
              </div>

              {/* Pricing Tiers Table Preview (Mini) */}
              {service.pricing && (
                <div className="bg-gray-50 p-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <div className="font-bold text-gray-900">Basic</div>
                    <div className="text-gray-500">{service.pricing.basic}</div>
                  </div>
                  <div className="border-x border-gray-200">
                    <div className="font-bold text-blue-600">Standard</div>
                    <div className="text-gray-500">{service.pricing.standard}</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Premium</div>
                    <div className="text-gray-500">{service.pricing.premium}</div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex >= 0 && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-fade-in" onClick={closeLightbox}>
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
          >
            <X size={32} />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors p-4 hover:bg-white/10 rounded-full"
          >
            <ChevronLeft size={40} />
          </button>

          <div className="max-w-5xl max-h-[85vh] w-full px-4 relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={galleryImages[lightboxIndex]}
              alt="Work Detail"
              className="w-full h-full object-contain rounded-lg shadow-2xl"
            />
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors p-4 hover:bg-white/10 rounded-full"
          >
            <ChevronRight size={40} />
          </button>

          <div className="absolute top-6 left-6 text-white/50 text-sm">
            {lightboxIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetail;
