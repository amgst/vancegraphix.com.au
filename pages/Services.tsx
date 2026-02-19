import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ExternalLink,
  Loader,
  ShoppingBag,
  Code,
  Palette,
  Globe,
  Monitor,
  Smartphone,
  PenTool,
  Layout
} from 'lucide-react';
import { getServiceCategories, ServiceCategory } from '../lib/servicesService';
import FAQ from '../components/FAQ';
import ProcessTimeline from '../components/ProcessTimeline';
import SEO from '../components/SEO';

const Services: React.FC = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getServiceCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getCategoryLink = (id: string) => {
    switch (id) {
      case 'shopify-services': return '/shopify';
      case 'custom-web-dev': return '/web-dev';
      case 'graphics-services': return '/graphics';
      default: return '/contact';
    }
  };

  const getIconByName = (name: string) => {
    const icons: { [key: string]: any } = {
      ShoppingBag, Code, Palette, Globe, Monitor, Smartphone, PenTool, Layout
    };
    return icons[name] || Code;
  };

  const servicesStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Web Development and Design Services',
    provider: {
      '@type': 'Organization',
      name: 'Vance Graphix & Print (VGP)'
    },
    areaServed: 'Worldwide',
    description: 'Professional web development, design, and digital marketing services'
  };

  return (
    <div className="pb-24 bg-white min-h-screen">
      <SEO
        title="Comprehensive Digital Services | Web Design, Dev & Branding"
        description="Explore our full range of digital services. From expert Shopify setups and custom app development to professional logo design, we build brands that sell."
        canonical="/services"
        structuredData={servicesStructuredData}
      />

      {/* Header */}
      <div className="bg-slate-50 py-20 mb-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Our Core Digital Services</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Everything you need to build your brand and grow your business.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin text-blue-600" size={40} />
          </div>
        ) : (
          categories.map((category) => {
            const Icon = getIconByName(category.iconName);
            return (
              <div key={category.id} id={category.id} className="scroll-mt-28">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <Icon className="text-blue-600" size={32} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900">{category.title}</h2>
                      <p className="text-gray-500 mt-1">{category.description}</p>
                    </div>
                  </div>
                  <Link to={getCategoryLink(category.id)}>
                    <button className="px-6 py-3 bg-white border border-gray-200 text-slate-900 rounded-full font-medium hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2">
                      Explore {category.title} <ExternalLink size={16} />
                    </button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {category.services.map((service) => (
                    <div key={service.id} className="group border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 bg-white hover:border-blue-100 flex flex-col">
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-grow">
                        {service.description}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                        <div className="text-xs font-semibold bg-gray-50 text-slate-700 px-2 py-1 rounded">
                          Starting at {service.pricing?.basic || 'Contact us'}
                        </div>
                        <Link
                          to={`/service/${service.id}`}
                          className="inline-flex items-center text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors"
                        >
                          View Details <ArrowRight size={14} className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Process Timeline */}
      <ProcessTimeline />

      {/* FAQ Section */}
      <FAQ />

      {/* Bottom CTA */}
      <div className="max-w-4xl mx-auto mt-32 bg-slate-900 rounded-3xl p-12 text-center text-white shadow-2xl mx-4 lg:mx-auto">
        <h3 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h3>
        <p className="text-slate-300 mb-8">We offer custom packages tailored to your specific needs.</p>
        <Link to="/contact">
          <button className="px-8 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-blue-50 transition-colors">
            Contact Support
          </button>
        </Link>
      </div>

    </div>
  );
};

export default Services;
