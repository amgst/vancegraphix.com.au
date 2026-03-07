import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { getPrintPortfolios, PrintPortfolioCategory } from '../lib/printPortfolioService';

interface PortfolioManifest {
  generatedAt: string;
  categories: Record<string, string[]>;
}

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

const Printing: React.FC = () => {
  const [printHeroImages, setPrintHeroImages] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchPrintHeroImages = async () => {
      try {
        const [categories, manifestRes] = await Promise.all([
          getPrintPortfolios(),
          fetch('/portfolio-manifest.json', { cache: 'no-store' })
        ]);
        const visibleCategories = categories.filter((cat) => cat.isPublic !== false);
        const manifest: PortfolioManifest | null = manifestRes.ok
          ? ((await manifestRes.json()) as PortfolioManifest)
          : null;

        const images = visibleCategories
          .flatMap((cat) => {
            const folderKey = manifest ? getFolderKeyForCategory(cat, manifest.categories) : null;
            return folderKey ? manifest!.categories[folderKey] || [] : [];
          })
          .filter(Boolean) as string[];
        setPrintHeroImages(images.slice(0, 8));
      } catch (error) {
        console.error('Failed to load print portfolio images for hero section', error);
      }
    };

    fetchPrintHeroImages();
  }, []);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [printHeroImages.length]);

  useEffect(() => {
    if (printHeroImages.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % printHeroImages.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [printHeroImages.length]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Printing Solutions',
    provider: {
      '@type': 'Organization',
      name: 'Vance Graphix & Print (VGP)',
    },
    areaServed: 'Australia',
    description:
      'Large format and digital printing solutions including signage, banners, proposals, brochures and more.',
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Printing Solutions | Large Format & Digital Printing in Australia"
        description="Vance Graphix & Print (VGP) delivers fast, cost-effective printing solutions from one purpose-built premises, including large format signage and digital print services."
        canonical="/printing"
        structuredData={structuredData}
      />

      <section className="relative bg-slate-900 text-white py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium">
                <CheckCircle size={16} />
                <span>Print &amp; Signage Specialists</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Professional <span className="text-blue-400">Printing</span> Solutions.
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                From shopfront signage and vehicle wraps to business cards and brochures, we deliver fast,
                high-quality print from one purpose-built production facility.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-2">
                    Start Your Print Project <ArrowRight size={18} />
                  </button>
                </Link>
                <Link to="/print-portfolio">
                  <button className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition-all backdrop-blur-sm">
                    View Print Portfolio
                  </button>
                </Link>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-slate-800 rounded-2xl p-4 border border-slate-700">
                  {printHeroImages.length > 0 ? (
                    <div className="relative rounded-lg overflow-hidden h-[22rem]">
                      {printHeroImages.map((image, index) => (
                        <img
                          key={`${image}-${index}`}
                          src={image}
                          alt="Printing portfolio project"
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                            index === activeImageIndex ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                      ))}
                    </div>
                  ) : (
                    <img
                      src="https://vancegraphix.com.au/wp-content/uploads/2022/02/20964-scaled-1.png"
                      alt="VGP printing solutions hero artwork"
                      className="rounded-lg w-full h-[22rem] object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mt-10 bg-slate-50 rounded-3xl px-6 sm:px-10 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Large Format <span className="text-blue-600">Printing</span>
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Specifically geared towards small to medium businesses, we can easily cater for specialised
                print runs or low minimum quantities.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We can print on just about anything. Our production team applies designs to materials every
                day, from paper through to glass, acrylic, aluminium composite board, corflute, foamboard,
                timber and much more.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Flexible materials such as banner vinyl or mesh are printed on our large format solvent
                printers and are suitable for exterior use. They can be finished with ropes and eyelets or
                sail-track frames for building and hoarding display.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="brand.jpg"
                alt="Large format printing and signage at VGP"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mt-16 bg-white rounded-3xl px-6 sm:px-10 py-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://vancegraphix.com.au/wp-content/uploads/2020/01/23592-scaled.jpg"
                alt="Digital printing section with marketing materials"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Digital Print <span className="text-blue-600">Services</span>
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                The digital print department is perfect for proposals, flyers, menus, brochures,
                newsletters and letters, with the added flexibility of variable data.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Providing an on-demand print service, Vance Graphix &amp; Print can store your data and
                print to your requirements within short time frames and for specific targets, eliminating
                waste and mass generic mail outs.
              </p>
              <p className="text-gray-600 leading-relaxed">
                High quality finishing options are also available for your small run printing such as matt
                and gloss celloglaze, scoring and folding and custom shapes and sizes.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16 mb-8">
          <div className="rounded-3xl bg-slate-50 px-6 sm:px-10 py-10 flex justify-center">
            <img
              src="https://vancegraphix.com.au/wp-content/uploads/2023/08/Design-Process_2023-02-1536x433.png"
              alt="Overview of VGP print and design capabilities"
              className="w-full max-w-4xl object-contain"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Printing;
