import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/servicesData';
import Testimonials from '../components/Testimonials';
import ServiceQuizModal from '../components/ServiceQuizModal';
import { getPortfolios, PortfolioItem } from '../lib/portfolioService';
import { getPrintPortfolios, PrintPortfolioCategory } from '../lib/printPortfolioService';
import { PORTFOLIO_CONFIG } from '../data/portfolioConfig';

import SEO from '../components/SEO';

const Home: React.FC = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(true);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [printCategories, setPrintCategories] = useState<PrintPortfolioCategory[]>([]);
  const [isPrintLoading, setIsPrintLoading] = useState(true);
  const [printError, setPrintError] = useState<string | null>(null);
  const [printCoverImages, setPrintCoverImages] = useState<Record<string, string>>({});

  // Take first 4 categories for the preview
  const featuredCategories = SERVICE_CATEGORIES.slice(0, 4);

  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Vance Graphix & Print (VGP)',
    url: 'https://vancegraphix.com.au',
    description: 'Printing, signage, graphic design, web development, e-commerce, and email marketing in Australia',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://vancegraphix.com.au/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setIsPortfolioLoading(true);
        setPortfolioError(null);
        const items = await getPortfolios();
        const publicItems = items.filter((item) => item.isPublic !== false);
        const featured = publicItems.filter((item) => item.isFeatured);
        const sortedSource = featured.length > 0 ? featured : publicItems;
        const sorted = [...sortedSource].sort((a, b) => (a.order || 0) - (b.order || 0));
        setPortfolioItems(sorted.slice(0, 3));
      } catch (err) {
        console.error('Error loading portfolio for home', err);
        setPortfolioError('Unable to load portfolio right now.');
      } finally {
        setIsPortfolioLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  useEffect(() => {
    const fetchPrintPortfolio = async () => {
      try {
        setIsPrintLoading(true);
        setPrintError(null);
        const categories = await getPrintPortfolios();
        const visible = categories.filter((cat) => cat.isPublic !== false);
        const sorted = visible.sort((a, b) => (a.order || 0) - (b.order || 0));
        const topCategories = sorted.slice(0, 3);
        setPrintCategories(topCategories);

        if (!PORTFOLIO_CONFIG.apiKey) {
          return;
        }

        const entries = await Promise.all(
          topCategories.map(async (cat) => {
            if (cat.coverImageUrl) {
              return [cat.id, cat.coverImageUrl] as const;
            }
            if (!cat.folderId) {
              return null;
            }
            try {
              const query = `'${cat.folderId}' in parents and trashed = false and mimeType contains 'image/'`;
              const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
                query
              )}&fields=files(id,name,mimeType)&key=${PORTFOLIO_CONFIG.apiKey}&pageSize=1`;
              const res = await fetch(url);
              if (!res.ok) {
                return null;
              }
              const data = await res.json();
              const file = data.files && data.files[0];
              if (!file || !file.id) {
                return null;
              }
              return [cat.id, `https://drive.google.com/thumbnail?id=${file.id}&sz=w2000`] as const;
            } catch {
              return null;
            }
          })
        );

        const images: Record<string, string> = {};
        for (const entry of entries) {
          if (entry) {
            const [id, url] = entry;
            images[id] = url;
          }
        }
        setPrintCoverImages(images);
      } catch (err) {
        console.error('Error loading print portfolio for home', err);
        setPrintError('Unable to load print portfolio right now.');
      } finally {
        setIsPrintLoading(false);
      }
    };

    fetchPrintPortfolio();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Vance Graphix & Print (VGP) - Print, Signage, Graphics & Web"
        description="Vance Graphix & Print (VGP) delivers high-impact printing, signage and graphic design, plus professional web and digital solutions throughout Australia."
        canonical="/"
        structuredData={websiteStructuredData}
      />
      <ServiceQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16  lg:pt-20 lg:pb-10">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left space-y-8 animate-fade-in-up">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold tracking-wide">
                Vance Graphix &amp; Print (VGP)
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-tight">
                Print, Signage &amp; <br /><span className="text-blue-600">Graphic Design That Gets Seen</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                From business cards, brochures and banners to shopfronts and vehicle graphics, we handle it all in-house. Plus, we back it up with professional web and Shopify solutions to keep your brand consistent everywhere.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link to="/services">
                  <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                    Browse All Services <ArrowRight size={18} />
                  </button>
                </Link>
                <Link to="/contact-us">
                  <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-gray-200 rounded-full font-medium hover:border-slate-300 hover:bg-gray-50 transition-all">
                    Get a Quote
                  </button>
                </Link>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsQuizOpen(true)}
                  className="text-sm text-gray-500 hover:text-blue-600 underline decoration-dotted underline-offset-4 transition-colors"
                >
                  Not sure what you need? Take our 30-second quiz
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="flex-1 w-full max-w-xl lg:max-w-none relative animate-fade-in-up delay-100">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                <img
                  src="https://drive.google.com/thumbnail?id=1q-IfZhsPt2s80xiQeyiClynSf3CdSFwr&sz=w2000"
                  alt="Vance Graphix & Print large format print and signage"
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none"></div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-50 hidden md:flex items-center gap-3 animate-bounce-slow">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Projects Completed</p>
                  <p className="text-lg font-bold text-slate-900">500+</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Services Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Print, Graphics &amp; Digital Services</h2>
            <p className="text-gray-500">From real-world print and signage to branding, websites and digital marketing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((cat) => (
              <div key={cat.id} className="group p-8 border border-gray-100 rounded-2xl hover:shadow-xl hover:border-transparent transition-all duration-300 bg-white">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <cat.icon className="text-blue-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.title}</h3>
                <p className="text-sm text-gray-500 mb-6 min-h-[40px]">{cat.description}</p>
                <Link to="/services" className="text-blue-600 font-medium text-sm hover:text-blue-700 flex items-center gap-1">
                  View {cat.services.length} services <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="inline-flex items-center text-slate-900 font-semibold border-b-2 border-slate-900 pb-1 hover:text-blue-600 hover:border-blue-600 transition-all">
              View Full Service Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Print Highlight Section */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 rounded-l-full blur-3xl -mr-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium">
                <CheckCircle size={16} />
                <span>Print &amp; Signage Specialists</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Make Your Brand Unmissable with <span className="text-blue-400">Print</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
                We produce high-impact printing and signage from one purpose-built premises. From shopfronts and vehicles to marketing materials, we help your brand stand out in the real world.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {['Shopfront signage & windows', 'Banners & corflutes', 'Vehicle wraps & decals', 'Business cards & brochures'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-200">
                    <CheckCircle size={18} className="text-blue-400" /> {item}
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Link to="/printing">
                  <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-500/25">
                    Explore Printing Solutions
                  </button>
                </Link>
                <p className="mt-3 text-sm text-gray-400">
                  Need Shopify or a website too? Our web team can keep your online presence in sync with your print.
                </p>
              </div>
            </div>
            <div className="flex-1 w-full relative">
              <img
                src="https://vancegraphix.com.au/wp-content/uploads/2020/01/16278-scaled.jpg"
                alt="Large format printing and signage at Vance Graphix & Print"
                className="relative z-10 rounded-2xl shadow-2xl border border-slate-700 transform rotate-1 hover:rotate-0 transition-all duration-500 w-full h-auto"
              />
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-slate-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Why businesses trust Vance Graphix &amp; Print for web.</h2>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                We design and build websites and Shopify stores that are fast, secure and simple to manage, backed by local support that understands your business.
              </p>

              <div className="space-y-4">
                {[
                  'Expert Shopify and custom web development',
                  'Conversion-focused design and mobile-friendly builds',
                  'SEO-aware structure and performance best practices',
                  'Ongoing support, updates and improvements'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="text-blue-600 flex-shrink-0" size={20} />
                    <span className="text-slate-800 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80" alt="Coding and Development" className="rounded-2xl shadow-lg w-full h-64 object-cover transform translate-y-8" />
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" alt="Team Collaboration" className="rounded-2xl shadow-lg w-full h-64 object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {portfolioError && (
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 inline-block">
              {portfolioError}
            </p>
          </div>
        </section>
      )}

      {!isPortfolioLoading && portfolioItems.length > 0 && (
        <section className="py-24 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Recent web &amp; design work</h2>
                <p className="text-gray-500 max-w-2xl">
                  A snapshot of websites, Shopify stores and visual campaigns we have launched for clients.
                </p>
              </div>
              <Link
                to="/portfolio"
                className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View full portfolio <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {portfolioItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-1">
                        {item.description}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between">
                      <Link
                        to="/portfolio"
                        className="text-sm font-semibold text-slate-900 hover:text-blue-600 inline-flex items-center gap-1"
                      >
                        View more work <ArrowRight size={14} />
                      </Link>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-400 hover:text-blue-600"
                        >
                          Visit site
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {printError && (
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 inline-block">
              {printError}
            </p>
          </div>
        </section>
      )}

      {!isPrintLoading && printCategories.length > 0 && (
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Print portfolio</h2>
                <p className="text-gray-500 max-w-2xl">
                  A quick look at the kinds of printed pieces and signage we produce every day.
                </p>
              </div>
              <Link
                to="/print-portfolio"
                className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View full print portfolio <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {printCategories.map((cat) => {
                const coverImage = printCoverImages[cat.id] || cat.coverImageUrl;
                return (
                  <Link
                    key={cat.id}
                    to="/print-portfolio"
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all overflow-hidden flex flex-col"
                  >
                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                      {coverImage && (
                        <img
                          src={coverImage}
                          alt={cat.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">
                      {cat.title}
                    </h3>
                    {cat.description && (
                      <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-1">
                        {cat.description}
                      </p>
                    )}
                    <span className="mt-auto text-sm font-semibold text-slate-900 group-hover:text-blue-600 inline-flex items-center gap-1">
                      View category <ArrowRight size={14} />
                    </span>
                  </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Ready to start your project?</h2>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">Join hundreds of satisfied clients who have streamlined their creative needs with us.</p>
          <Link to="/contact">
            <button className="px-10 py-5 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
              Contact Us Today
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
