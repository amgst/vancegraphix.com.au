import React from 'react';
import { Link } from 'react-router-dom';
import { Code, CheckCircle, ArrowRight, Layout, Smartphone, Zap, Globe } from 'lucide-react';
import SEO from '../components/SEO';

const WebDevLanding: React.FC = () => {
    const serviceStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Custom Web Development',
        provider: {
            '@type': 'Organization',
            name: 'Vance Graphix & Print (VGP)'
        },
        areaServed: 'Worldwide',
        description: 'Custom web development services using modern technologies like React and Next.js'
    };

    return (
        <div className="flex flex-col min-h-screen">
            <SEO
                title="Custom Web Development | Fast React & Next.js Websites"
                description="Need more than a template? We build blazing fast, scalable, and secure custom websites using modern tech like React and Next.js. Performance guaranteed."
                canonical="/web-dev"
                structuredData={serviceStructuredData}
            />
            {/* Hero Section */}
            <section className="relative py-24 bg-slate-900 text-white overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium">
                                <Code size={16} />
                                <span>Custom Web Development</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                                <span className="text-blue-500">React</span> & Next.js <br />Web Development.
                            </h1>
                            <p className="text-xl text-gray-300 max-w-xl leading-relaxed">
                                We design and develop custom websites that are fast, secure, and built to convert. From simple landing pages to complex web applications.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link to="/inquiry?type=web-dev">
                                    <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-2">
                                        Start Your Project <ArrowRight size={18} />
                                    </button>
                                </Link>
                                <Link to="/portfolio?category=React">
                                    <button className="px-8 py-4 bg-transparent border border-gray-600 text-white rounded-full font-medium hover:bg-white/5 transition-all">
                                        View Portfolio
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-30"></div>
                                <div className="relative bg-slate-800 rounded-2xl p-4 border border-slate-700">
                                    <img src="https://picsum.photos/800/600?random=10" alt="Web Development" className="rounded-lg w-full h-auto" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Custom Development?</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Templates are great, but sometimes you need a solution tailored exactly to your business needs.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Zap,
                                title: 'Blazing Fast Performance',
                                description: 'We build with modern frameworks like React and Next.js to ensure your site loads instantly and ranks high on Google.'
                            },
                            {
                                icon: Smartphone,
                                title: 'Mobile-First Design',
                                description: 'Your website will look and function perfectly on every device, from large desktop monitors to the smallest smartphones.'
                            },
                            {
                                icon: Layout,
                                title: 'Scalable Architecture',
                                description: 'Built to grow with your business. Add new features, pages, and functionality without rebuilding from scratch.'
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="p-8 border border-gray-100 rounded-2xl hover:shadow-xl transition-all bg-white group">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors text-blue-600">
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Packages */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Development Packages</h2>
                        <p className="text-gray-500">Transparent pricing for every stage of your business.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Starter Site',
                                price: '$999',
                                desc: 'Perfect for small businesses and personal portfolios.',
                                features: ['5 Page Custom Design', 'Mobile Responsive', 'Contact Form', 'Basic SEO Setup', '1 Month Support']
                            },
                            {
                                name: 'Business Pro',
                                price: '$1,999',
                                popular: true,
                                desc: 'For growing businesses needing more features.',
                                features: ['10 Page Custom Design', 'CMS Integration', 'Blog Functionality', 'Advanced SEO', 'Speed Optimization', '3 Months Support']
                            },
                            {
                                name: 'Custom Web App',
                                price: '$3,999+',
                                desc: 'Complex functionality and custom applications.',
                                features: ['React/Next.js Application', 'User Authentication', 'Database Integration', 'API Development', 'Admin Dashboard', '6 Months Support']
                            }
                        ].map((pkg, idx) => (
                            <div key={idx} className={`relative p-8 rounded-2xl bg-white border ${pkg.popular ? 'border-blue-500 shadow-xl scale-105' : 'border-gray-100 shadow-sm'} transition-all`}>
                                {pkg.popular && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                                <div className="text-4xl font-bold text-blue-600 mb-4">{pkg.price}</div>
                                <p className="text-gray-500 mb-8">{pkg.desc}</p>
                                <ul className="space-y-4 mb-8">
                                    {pkg.features.map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-700">
                                            <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/inquiry?type=web-dev">
                                    <button className={`w-full py-4 rounded-xl font-bold transition-all ${pkg.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                                        Select Package
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Not sure what you need?</h2>
                    <p className="text-xl text-gray-500 mb-10">Let's discuss your project and find the perfect solution for your budget and goals.</p>
                    <Link to="/contact">
                        <button className="px-10 py-5 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all">
                            Book a Free Consultation
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default WebDevLanding;
