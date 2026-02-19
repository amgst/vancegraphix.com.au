import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Layout, ShoppingCart, Zap, ArrowRight } from 'lucide-react';
import { ReadySite } from '../data/readySitesData';
import { getReadySites } from '../lib/readySitesService';
import SEO from '../components/SEO';

const WebsitesForSale: React.FC = () => {
    const [templates, setTemplates] = useState<ReadySite[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const fetchedTemplates = await getReadySites();
                setTemplates(fetchedTemplates);
            } catch (error) {
                console.error("Error fetching ready sites:", error);
                // Fallback to empty array on error
                setTemplates([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    const productStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Fast-Track Business Launch',
        description: 'Turnkey website launch in 48 hours: SEO-ready, optimized, and guided.',
        offers: {
            '@type': 'Offer',
            price: '499',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <SEO
                title="Launch Your Digital Business in 48 Hours | Fast-Track"
                description="Skip the 3-month dev cycle. Our turnkey launch service delivers an SEO-ready, optimized website in 48 hours."
                canonical="/websites-for-sale"
                structuredData={productStructuredData}
            />
            {/* Hero Section */}
            <section className="bg-slate-900 text-white py-24 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 rounded-l-full blur-3xl"></div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold mb-6">
                        Fast-Track Launch
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Launch Your Digital Business in 48 Hours
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                        Skip the 3-month development cycle. We’ve built the foundation; you lead the brand.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href="#templates" className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-500/25">
                            View Templates
                        </a>
                        <Link to="/contact">
                            <button className="px-8 py-4 bg-transparent border border-gray-600 text-white rounded-full font-medium hover:bg-slate-800 transition-all">
                                Contact Us
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* What's Included */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">What You Get in the Launchpad</h2>
                        <p className="text-gray-500">A turnkey foundation optimized for speed, SEO, and growth.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Layout,
                                title: 'Foundation Design',
                                desc: 'Choose a modern, responsive base tailored to your industry.'
                            },
                            {
                                icon: Zap,
                                title: 'Brand Integration',
                                desc: 'We apply your logo, colors, and core content for a cohesive presence.'
                            },
                            {
                                icon: CheckCircle,
                                title: 'Deployment & SEO Setup',
                                desc: 'Technical setup, domain connection, and baseline SEO configuration to go live fast.'
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                                    <item.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Process Section */}
            <section className="py-24 px-4 bg-white border-y border-gray-100">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
                        <p className="text-gray-500">A simple, transparent process to get your website live.</p>
                    </div>

                    <div className="space-y-12 relative">
                        {/* Vertical Line */}
                        <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-100 hidden md:block"></div>

                        {[
                            {
                                step: "01",
                                title: "Kickoff & Strategy",
                                icon: ShoppingCart,
                                content: (
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle size={18} className="text-blue-500 mt-1 flex-shrink-0" />
                                            <span>Select your foundation and define goals for launch.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle size={18} className="text-blue-500 mt-1 flex-shrink-0" />
                                            <span>We align on brand, content, and deployment plan.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle size={18} className="text-blue-500 mt-1 flex-shrink-0" />
                                            <span>Receive next steps and timeline to go live within 48 hours.</span>
                                        </li>
                                    </ul>
                                )
                            },
                            {
                                step: "02",
                                title: "Domain & Hosting Credentials",
                                icon: Layout,
                                content: (
                                    <div className="space-y-3 text-gray-600">
                                        <p>We need a place to host your new site. Please provide:</p>
                                        <ul className="space-y-2 pl-4 border-l-2 border-blue-100">
                                            <li>• Your <strong>Domain Name</strong> (e.g., mybusiness.com)</li>
                                            <li>• <strong>Hosting Credentials</strong> (if you already have hosting)</li>
                                            <li>• We can help you set up a Vercel account.</li>
                                        </ul>
                                    </div>
                                )
                            },
                            {
                                step: "03",
                                title: "Assets, Content & Contact Details",
                                icon: Zap,
                                content: (
                                    <div className="space-y-3 text-gray-600">
                                        <p>Send us the materials to make the site yours:</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="bg-slate-50 p-3 rounded-lg text-sm">
                                                <span className="font-semibold block text-slate-900">Branding</span>
                                                Your Logo, Brand Colors, Fonts
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-lg text-sm">
                                                <span className="font-semibold block text-slate-900">Contact Info</span>
                                                Email, Phone, Address, Social Links
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-lg text-sm col-span-1 sm:col-span-2">
                                                <span className="font-semibold block text-slate-900">Site Content</span>
                                                Text for About Us, Services, and any images you want to use.
                                            </div>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                step: "04",
                                title: "Special Instructions & Launch",
                                icon: CheckCircle,
                                content: (
                                    <div className="space-y-3 text-gray-600">
                                        <p>Final touches before we go live:</p>
                                        <ul className="space-y-2">
                                            <li className="flex items-start gap-2">
                                                <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">!</span>
                                                <span>Let us know any specific requirements or customizations.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">✓</span>
                                                <span>We review everything and launch your site within 48 hours.</span>
                                            </li>
                                        </ul>
                                    </div>
                                )
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="relative flex flex-col md:flex-row gap-8 md:gap-12">
                                {/* Icon/Step Marker */}
                                <div className="flex-shrink-0 flex md:flex-col items-center md:items-end gap-4 md:w-32">
                                    <div className="w-16 h-16 rounded-2xl bg-white border-2 border-blue-50 shadow-sm flex items-center justify-center text-blue-600 relative z-10">
                                        <item.icon size={28} />
                                        <div className="absolute -top-3 -right-3 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            {item.step}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Card */}
                                <div className="flex-grow bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                    {item.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link to="/contact">
                            <button className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                                Start Your Project Now
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Key Features */}
            <section className="py-20 px-4 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Our Ready Sites?</h2>
                        <p className="text-gray-500">Built with modern technology for speed, security, and growth.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Mobile Responsive',
                                desc: 'Looks perfect on every device, from smartphones to large desktop screens.',
                                icon: '📱'
                            },
                            {
                                title: 'SEO Optimized',
                                desc: 'Built with best practices to help you rank higher on Google search results.',
                                icon: '🔍'
                            },
                            {
                                title: 'Blazing Fast',
                                desc: 'Hosted on Vercel\'s global edge network for instant page loads anywhere.',
                                icon: '🚀'
                            },
                            {
                                title: 'Contact Ready',
                                desc: 'Includes working contact forms so you never miss a customer inquiry.',
                                icon: '✉️'
                            },
                            {
                                title: 'Analytics Included',
                                desc: 'Pre-configured for Google Analytics so you can track your visitors.',
                                icon: '📊'
                            },
                            {
                                title: 'Easy to Update',
                                desc: 'Clean code structure makes it simple to update text and images later.',
                                icon: '✏️'
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Templates Grid */}
            <section id="templates" className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Launch Foundations</h2>
                        <p className="text-gray-500">Pick a starting point and we’ll tailor it to your brand.</p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                                <p className="text-gray-500">Loading templates...</p>
                            </div>
                        </div>
                    ) : templates.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg mb-4">No templates available at the moment.</p>
                            <Link to="/contact">
                                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
                                    Contact Us
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                            {templates.map((template) => (
                                <div key={template.id} className="group bg-slate-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                                    <div className="relative h-80 overflow-hidden bg-gray-200">
                                        {template.image ? (
                                            <img
                                                src={template.image}
                                                alt={template.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                    const parent = (e.target as HTMLImageElement).parentElement;
                                                    if (parent) {
                                                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><span>No Image</span></div>';
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <span>No Image Available</span>
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                                            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 uppercase tracking-wide">
                                                {template.category}
                                            </div>
                                            {template.isConcept && (
                                                <div className="bg-purple-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1 shadow-lg">
                                                    <Zap size={12} className="fill-white" /> Concept Demo
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-3">{template.title}</h3>
                                        <p className="text-gray-500 mb-6">{template.description}</p>

                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {template.features && template.features.map((feature, i) => (
                                                <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600">
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Link to="/contact" className="flex-1">
                                                <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                                                    Request Launch <ShoppingCart size={18} />
                                                </button>
                                            </Link>
                                            {template.previewLink ? (
                                                <a href={template.previewLink} target="_blank" rel="noopener noreferrer">
                                                    <button className="px-6 py-3 bg-white border border-gray-200 text-slate-900 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                                                        Preview
                                                    </button>
                                                </a>
                                            ) : (
                                                <button className="px-6 py-3 bg-white border border-gray-200 text-slate-900 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                                                    Preview
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4 bg-slate-50 border-t border-gray-200">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-gray-500">Everything you need to know about your new website.</p>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                q: "Is there a monthly fee?",
                                a: "Your hosting is billed by your provider (e.g., Vercel). Our setup is a one-time fee with no ongoing charges from us."
                            },
                            {
                                q: "Do I need to pay for hosting?",
                                a: "Yes. Hosting costs depend on the provider and plan you choose."
                            },
                            {
                                q: "Is SSL included?",
                                a: "Most hosting providers include SSL certificates (HTTPS) at no additional cost."
                            },
                            {
                                q: "What do I need to provide?",
                                a: "You'll need a Vercel account and a GitHub (or GitLab/Bitbucket) account so we can transfer ownership of the code and project to you."
                            }
                        ].map((faq, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.q}</h3>
                                <p className="text-gray-600">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4 bg-slate-900 text-white text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Don't see what you need?</h2>
                    <p className="text-xl text-gray-300 mb-10">
                        We also offer fully custom web design and development services tailored to your specific requirements.
                    </p>
                    <Link to="/contact">
                        <button className="px-10 py-5 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-all">
                            Get a Custom Quote
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default WebsitesForSale;
