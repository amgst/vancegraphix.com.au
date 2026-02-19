import React, { useState, useEffect } from 'react';
import { Check, DollarSign, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingCalculator: React.FC = () => {
    const [pages, setPages] = useState(5);
    const [isEcommerce, setIsEcommerce] = useState(false);
    const [isSEO, setIsSEO] = useState(false);
    const [isDesign, setIsDesign] = useState(true);
    const [isCMS, setIsCMS] = useState(true);
    const [estimatedCost, setEstimatedCost] = useState(0);

    useEffect(() => {
        let base = 500; // Base setup fee

        // Page cost
        base += pages * 150;

        // Feature costs
        if (isEcommerce) base += 1000;
        if (isSEO) base += 500;
        if (isDesign) base += 800; // Custom design vs template
        if (isCMS) base += 300; // CMS integration

        setEstimatedCost(base);
    }, [pages, isEcommerce, isSEO, isDesign, isCMS]);

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 md:p-12 bg-slate-900 text-white text-center">
                <h2 className="text-3xl font-bold mb-4">Project Cost Estimator</h2>
                <p className="text-slate-300">Get a rough idea of your investment.</p>

                <div className="mt-8 flex items-center justify-center gap-2">
                    <span className="text-2xl opacity-50">$</span>
                    <span className="text-6xl font-bold tracking-tight">{estimatedCost.toLocaleString()}</span>
                    <span className="text-xl opacity-50 self-end mb-2">*</span>
                </div>
                <p className="text-sm text-slate-400 mt-2">*Estimated starting price. Final quote may vary.</p>
            </div>

            <div className="p-8 md:p-12 space-y-8">
                {/* Pages Slider */}
                <div>
                    <div className="flex justify-between mb-4">
                        <label className="font-bold text-slate-900">Number of Pages</label>
                        <span className="text-blue-600 font-bold">{pages} Pages</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={pages}
                        onChange={(e) => setPages(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>1 Page</span>
                        <span>20 Pages</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Toggles */}
                    <div
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isEcommerce ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                        onClick={() => setIsEcommerce(!isEcommerce)}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-slate-900">E-Commerce Functionality</span>
                            {isEcommerce && <Check size={20} className="text-blue-600" />}
                        </div>
                        <p className="text-sm text-gray-500">Product management, cart, checkout.</p>
                    </div>

                    <div
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isSEO ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                        onClick={() => setIsSEO(!isSEO)}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-slate-900">Advanced SEO</span>
                            {isSEO && <Check size={20} className="text-blue-600" />}
                        </div>
                        <p className="text-sm text-gray-500">Keyword optimization, meta tags, sitemap.</p>
                    </div>

                    <div
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isDesign ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                        onClick={() => setIsDesign(!isDesign)}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-slate-900">Custom UI/UX Design</span>
                            {isDesign && <Check size={20} className="text-blue-600" />}
                        </div>
                        <p className="text-sm text-gray-500">Unique branding, no templates.</p>
                    </div>

                    <div
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isCMS ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                        onClick={() => setIsCMS(!isCMS)}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-slate-900">CMS Integration</span>
                            {isCMS && <Check size={20} className="text-blue-600" />}
                        </div>
                        <p className="text-sm text-gray-500">Easy content updates (Shopify/WordPress/Sanity).</p>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 text-center">
                    <Link to="/contact">
                        <button className="w-full md:w-auto px-10 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/25">
                            Get Official Quote
                        </button>
                    </Link>
                    <p className="text-xs text-gray-400 mt-4">
                        This is an estimate. <button onClick={() => { setPages(5); setIsEcommerce(false); setIsSEO(false); setIsDesign(true); setIsCMS(true); }} className="text-blue-600 hover:underline inline-flex items-center gap-1"><RefreshCw size={10} /> Reset Calculator</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PricingCalculator;
