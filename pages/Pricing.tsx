import React from 'react';
import PricingCalculator from '../components/PricingCalculator';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
    return (
        <div className="pb-24 bg-white min-h-screen">
            <div className="bg-slate-50 py-20 mb-16 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        No hidden fees. No surprises. Just clear, upfront estimates for your project.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">How we calculate costs</h2>
                        <div className="space-y-8 text-gray-600 leading-relaxed">
                            <p>
                                Every project is unique, but we believe in giving you a ballpark figure before we even talk. Our pricing is based on the complexity of features, the number of pages, and the level of custom design required.
                            </p>

                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                <h3 className="font-bold text-blue-900 mb-2">What's always included:</h3>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Mobile Responsive Design</li>
                                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Basic SEO Setup</li>
                                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> SSL Security Certificate</li>
                                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> 30 Days Post-Launch Support</li>
                                </ul>
                            </div>

                            <p>
                                Use the calculator to estimate your project. If you have specific requirements not listed here, <Link to="/contact" className="text-blue-600 font-bold hover:underline">contact us</Link> for a custom quote.
                            </p>
                        </div>
                    </div>

                    <div>
                        <PricingCalculator />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
