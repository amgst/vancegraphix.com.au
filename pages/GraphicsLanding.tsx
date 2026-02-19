import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, CheckCircle, ArrowRight, Sparkles, Layers, PenTool } from 'lucide-react';
import SEO from '../components/SEO';

const GraphicsLanding: React.FC = () => {
    const serviceStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Graphics Design and Branding',
        provider: {
            '@type': 'Organization',
            name: 'Vance Graphix & Print (VGP)'
        },
        areaServed: 'Worldwide',
        description: 'Professional graphics design and branding services including logos, brand identities, and social media graphics'
    };

    return (
        <div className="flex flex-col min-h-screen">
            <SEO
                title="Premium Branding & Graphic Design Services | Logos & UI/UX"
                description="Make your brand unforgettable. Get professional logo design, complete brand identity packages, and stunning UI/UX that captures attention and builds trust."
                canonical="/graphics"
                structuredData={serviceStructuredData}
            />
            {/* Hero Section */}
            <section className="relative py-24 bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 text-white overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-pink-500/30 via-transparent to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-200 text-sm font-medium">
                                <Palette size={16} />
                                <span>Graphics & Branding</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                                Elevate Your <br /><span className="text-pink-400">Brand Identity.</span>
                            </h1>
                            <p className="text-xl text-gray-200 max-w-xl leading-relaxed">
                                From stunning logos to complete brand identities and social media graphics. We create visuals that capture attention and build trust.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link to="/inquiry?type=graphics">
                                    <button className="px-8 py-4 bg-pink-600 text-white rounded-full font-bold hover:bg-pink-500 transition-all shadow-lg hover:shadow-pink-500/25 flex items-center gap-2">
                                        Start Your Design <ArrowRight size={18} />
                                    </button>
                                </Link>
                                <Link to="/portfolio?category=Graphics">
                                    <button className="px-8 py-4 bg-transparent border border-gray-400 text-white rounded-full font-medium hover:bg-white/10 transition-all">
                                        View Portfolio
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <img src="https://picsum.photos/300/300?random=20" alt="Design 1" className="rounded-2xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform" />
                                    <img src="https://picsum.photos/300/400?random=21" alt="Design 2" className="rounded-2xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform" />
                                </div>
                                <div className="space-y-4 pt-8">
                                    <img src="https://picsum.photos/300/400?random=22" alt="Design 3" className="rounded-2xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform" />
                                    <img src="https://picsum.photos/300/300?random=23" alt="Design 4" className="rounded-2xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">What We Design</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Professional design services to elevate your brand across all touchpoints.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Sparkles,
                                title: 'Logo & Brand Identity',
                                description: 'Memorable logos, color palettes, typography, and complete brand guidelines to establish your unique identity.',
                                price: 'From $250'
                            },
                            {
                                icon: Layers,
                                title: 'Social Media Graphics',
                                description: 'Eye-catching posts, stories, banners, and ad creatives for Instagram, Facebook, LinkedIn, and more.',
                                price: 'From $100'
                            },
                            {
                                icon: PenTool,
                                title: 'UI/UX Design',
                                description: 'Beautiful and intuitive interfaces for websites and mobile apps, designed in Figma with full prototypes.',
                                price: 'From $500'
                            }
                        ].map((service, idx) => (
                            <div key={idx} className="p-8 border border-gray-100 rounded-2xl hover:shadow-xl transition-all bg-white group">
                                <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-pink-600 group-hover:text-white transition-colors text-pink-600">
                                    <service.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                                <p className="text-gray-500 leading-relaxed mb-4">{service.description}</p>
                                <div className="text-pink-600 font-bold text-lg">{service.price}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Packages */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Design Packages</h2>
                        <p className="text-gray-500">Choose the perfect package for your brand needs.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Logo Only',
                                price: '$250',
                                desc: 'Perfect for startups needing a professional logo.',
                                features: ['3 Logo Concepts', '3 Revisions', 'Vector Files (AI, EPS)', 'PNG & JPG Exports', '5 Day Delivery']
                            },
                            {
                                name: 'Brand Identity',
                                price: '$550',
                                popular: true,
                                desc: 'Complete branding package for serious businesses.',
                                features: ['Logo Design', 'Brand Guidelines', 'Color Palette', 'Typography System', 'Social Media Kit', 'Business Card Design', '7 Day Delivery']
                            },
                            {
                                name: 'UI/UX Design',
                                price: '$1,200',
                                desc: 'Full interface design for web or mobile apps.',
                                features: ['Wireframes', 'High-Fidelity Mockups', 'Interactive Prototype', 'Design System', 'Figma Source Files', 'Developer Handoff', '14 Day Delivery']
                            }
                        ].map((pkg, idx) => (
                            <div key={idx} className={`relative p-8 rounded-2xl bg-white border ${pkg.popular ? 'border-pink-500 shadow-xl scale-105' : 'border-gray-100 shadow-sm'} transition-all`}>
                                {pkg.popular && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-pink-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                                <div className="text-4xl font-bold text-pink-600 mb-4">{pkg.price}</div>
                                <p className="text-gray-500 mb-8">{pkg.desc}</p>
                                <ul className="space-y-4 mb-8">
                                    {pkg.features.map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-700">
                                            <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/inquiry?type=graphics">
                                    <button className={`w-full py-4 rounded-xl font-bold transition-all ${pkg.popular ? 'bg-pink-600 text-white hover:bg-pink-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                                        Select Package
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-gradient-to-r from-purple-900 to-pink-900 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to elevate your brand?</h2>
                    <p className="text-xl text-gray-200 mb-10">Let's create something beautiful together. Get started with a free consultation.</p>
                    <Link to="/contact">
                        <button className="px-10 py-5 bg-white text-purple-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl">
                            Get Your Free Quote
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default GraphicsLanding;
