import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShoppingBag, BarChart, Globe, Settings, Shield, Smartphone, ExternalLink } from 'lucide-react';
import SEO from '../components/SEO';

const ShopifyLanding: React.FC = () => {
    const serviceStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Shopify Store Development',
        provider: {
            '@type': 'Organization',
            name: 'wbify Creative Studio'
        },
        areaServed: 'Worldwide',
        description: 'Professional Shopify store setup, design, and optimization services'
    };

    return (
        <div className="flex flex-col min-h-screen">
            <SEO
                title="Shopify Experts | Store Setup, Dropshipping & Development"
                description="Launch a sales-focused Shopify store. We offer custom themes, automated dropshipping setups, and conversion optimization to maximize your revenue."
                canonical="/shopify"
                structuredData={serviceStructuredData}
            />
            {/* Hero Section */}
            <section className="relative bg-slate-900 text-white py-32 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?random=10')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium mb-6">
                            <ShoppingBag size={16} />
                            <span>Shopify Experts</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                            Build a <span className="text-green-400">High-Converting</span> Shopify Store.
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                            From dropshipping to custom brand stores, we design, build, and scale Shopify businesses that drive sales.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/contact">
                                <button className="px-8 py-4 bg-green-500 text-slate-900 rounded-full font-bold hover:bg-green-400 transition-all shadow-lg hover:shadow-green-500/25 flex items-center gap-2">
                                    Start Your Store <ArrowRight size={18} />
                                </button>
                            </Link>
                            <Link to="/portfolio?category=Shopify">
                                <button className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition-all backdrop-blur-sm flex items-center gap-2">
                                    See Our Work <ExternalLink size={18} />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything You Need to Sell Online</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">We provide end-to-end Shopify solutions tailored to your business goals.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Globe,
                                title: "Store Setup & Design",
                                desc: "Complete store setup with premium themes, custom branding, and responsive design that looks great on all devices."
                            },
                            {
                                icon: Settings,
                                title: "Custom Development",
                                desc: "Need something unique? We build custom features, modify Liquid code, and integrate third-party apps."
                            },
                            {
                                icon: BarChart,
                                title: "Marketing & SEO",
                                desc: "Drive traffic with our SEO optimization, Facebook Ads setup, and email marketing automation flows."
                            },
                            {
                                icon: ShoppingBag,
                                title: "Dropshipping Setup",
                                desc: "Automated dropshipping stores with winning product research, supplier integration, and order fulfillment setup."
                            },
                            {
                                icon: Shield,
                                title: "Speed & Security",
                                desc: "Optimization for lightning-fast load times and secure payment gateway integration to build customer trust."
                            },
                            {
                                icon: Smartphone,
                                title: "Mobile Optimization",
                                desc: "Ensure your store provides a seamless shopping experience for the 70% of users shopping on mobile."
                            }
                        ].map((service, idx) => (
                            <div key={idx} className="p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                                <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <service.icon className="text-green-600" size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-gray-500">Choose the package that fits your business stage.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Basic Package */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all relative">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Basic Store</h3>
                            <div className="text-4xl font-bold text-slate-900 mb-6">$299</div>
                            <p className="text-gray-500 mb-8 text-sm">Perfect for starting a new dropshipping business or simple brand store.</p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    "Premium Theme Installation",
                                    "Up to 10 Products Upload",
                                    "Payment Gateway Setup",
                                    "Basic SEO Setup",
                                    "5 Pages (About, Contact, etc.)",
                                    "Mobile Responsive"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                                        <CheckCircle size={16} className="text-green-500 flex-shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/contact">
                                <button className="w-full py-3 border-2 border-slate-900 text-slate-900 rounded-xl font-bold hover:bg-slate-900 hover:text-white transition-all">
                                    Choose Basic
                                </button>
                            </Link>
                        </div>

                        {/* Standard Package */}
                        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-900 shadow-2xl transform md:-translate-y-4 relative">
                            <div className="absolute top-0 right-0 bg-green-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">POPULAR</div>
                            <h3 className="text-xl font-bold text-white mb-2">Pro Growth</h3>
                            <div className="text-4xl font-bold text-white mb-6">$599</div>
                            <p className="text-gray-400 mb-8 text-sm">For serious businesses looking to scale with marketing integration.</p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    "Everything in Basic",
                                    "Up to 30 Products Upload",
                                    "Social Media Integration",
                                    "Email Marketing Setup",
                                    "Speed Optimization",
                                    "Logo Design Included",
                                    "1 Month Support"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                        <CheckCircle size={16} className="text-green-400 flex-shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/contact">
                                <button className="w-full py-3 bg-green-500 text-slate-900 rounded-xl font-bold hover:bg-green-400 transition-all">
                                    Choose Pro
                                </button>
                            </Link>
                        </div>

                        {/* Premium Package */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Ultimate Brand</h3>
                            <div className="text-4xl font-bold text-slate-900 mb-6">$1,299</div>
                            <p className="text-gray-500 mb-8 text-sm">A completely custom, high-performance store with full automation.</p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    "Everything in Pro",
                                    "Unlimited Products",
                                    "Custom Liquid Coding",
                                    "Advanced SEO & Analytics",
                                    "Dropshipping Automation",
                                    "Facebook & Google Ads Setup",
                                    "3 Months Support"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                                        <CheckCircle size={16} className="text-green-500 flex-shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/contact">
                                <button className="w-full py-3 border-2 border-slate-900 text-slate-900 rounded-xl font-bold hover:bg-slate-900 hover:text-white transition-all">
                                    Choose Ultimate
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Ready to dominate your niche?</h2>
                    <p className="text-xl text-gray-500 mb-10">Let's build a store that not only looks amazing but converts visitors into loyal customers.</p>
                    <Link to="/contact">
                        <button className="px-10 py-5 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                            Get Your Free Consultation
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default ShopifyLanding;
