import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Layout, Settings, Shield, Smartphone, ExternalLink, Zap, Search, Globe, Database } from 'lucide-react';
import SEO from '../components/SEO';

const WordPressLanding: React.FC = () => {
    const serviceStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'WordPress Development',
        provider: {
            '@type': 'Organization',
            name: 'wbify Creative Studio'
        },
        areaServed: 'Worldwide',
        description: 'Professional WordPress design, development, and optimization services'
    };

    return (
        <div className="flex flex-col min-h-screen">
            <SEO
                title="WordPress Experts | Custom Themes, Elementor & Speed Optimization"
                description="Launch a high-performance WordPress site. We offer custom theme development, Elementor expertise, and advanced speed optimization for business websites."
                canonical="/wordpress"
                structuredData={serviceStructuredData}
            />
            {/* Hero Section */}
            <section className="relative bg-slate-900 text-white py-32 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?random=11')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                            <Globe size={16} />
                            <span>WordPress Specialists</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                            Modern <span className="text-blue-400">WordPress</span> Sites Built for Growth.
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                            From business websites to complex LMS platforms, we build secure, fast, and easy-to-manage WordPress solutions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/contact">
                                <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-600/25 flex items-center gap-2">
                                    Get Started <ArrowRight size={18} />
                                </button>
                            </Link>
                            <Link to="/portfolio?category=WordPress">
                                <button className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition-all backdrop-blur-sm flex items-center gap-2">
                                    See Our Work <ExternalLink size={18} />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">WordPress Done Right</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">We don't just install plugins. We build high-performance web experiences.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Layout,
                                title: "Custom Theme Design",
                                desc: "Bespoke designs tailored to your brand, ensuring you stand out from the competition with a unique look."
                            },
                            {
                                icon: Settings,
                                title: "Page Builder Mastery",
                                desc: "Expertise in Elementor, Divi, and Gutenberg to give you full control over your content with ease."
                            },
                            {
                                icon: Zap,
                                title: "Core Web Vitals",
                                desc: "We optimize for speed and performance, ensuring your site passes Google's Core Web Vitals with flying colors."
                            },
                            {
                                icon: Shield,
                                title: "Advanced Security",
                                desc: "Hardened security setups to protect your site from vulnerabilities, including firewalls and regular backups."
                            },
                            {
                                icon: Search,
                                title: "SEO Ready",
                                desc: "Built-in SEO best practices to help your site rank higher and attract more organic traffic from day one."
                            },
                            {
                                icon: Database,
                                title: "Plugin Development",
                                desc: "Need custom functionality? We develop custom plugins and integrations to solve your specific business needs."
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="p-8 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why WordPress Section */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Why Choose WordPress for Your Business?</h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                WordPress powers over 40% of the internet for a reason. It's the most flexible and scalable content management system available today.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "Complete Ownership of Your Content",
                                    "Limitless Customization Options",
                                    "Excellent SEO Capabilities Out-of-the-Box",
                                    "Huge Ecosystem of Plugins and Support",
                                    "Easy for Your Team to Update and Manage"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                            <CheckCircle size={14} />
                                        </div>
                                        <span className="text-slate-700 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                                <img src="https://picsum.photos/800/600?random=12" alt="WordPress Dashboard" className="w-full" />
                            </div>
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -z-10"></div>
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Ready to Build Your WordPress Site?</h2>
                    <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                        Join hundreds of businesses that trust us for their WordPress development needs.
                    </p>
                    <Link to="/contact">
                        <button className="px-10 py-5 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 mx-auto">
                            Start Your Project Today <ArrowRight size={20} />
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default WordPressLanding;
