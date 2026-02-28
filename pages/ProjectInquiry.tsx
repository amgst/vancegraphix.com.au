import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import { submitInquiry } from '../lib/inquiryService';

interface FormData {
    name: string;
    email: string;
    phone: string;
    serviceType: string;
    // Shopify specific
    shopifyProductType?: string;
    shopifyHasProducts?: string;
    shopifyBudget?: string;
    // Web Dev specific
    webDevType?: string;
    webDevPages?: string;
    webDevFeatures?: string[];
    // Graphics specific
    graphicsType?: string;
    graphicsBrandExists?: string;
    graphicsUsage?: string;
    // Common
    timeline: string;
    additionalInfo: string;
}

const ProjectInquiry: React.FC = () => {
    const [searchParams] = useSearchParams();
    const serviceType = searchParams.get('type') || 'shopify';

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        serviceType: serviceType,
        timeline: '',
        additionalInfo: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFormData(prev => ({ ...prev, serviceType }));
    }, [serviceType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Inquiry submission started', formData);
        setIsSubmitting(true);
        try {
            // Save to Firestore
            console.log('Saving to Firestore...');
            await submitInquiry(formData);
            console.log('Form submitted to Firestore');

            // Send email via Vercel API
            console.log('Sending email notification...');
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

            try {
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: 'inquiry',
                        data: formData
                    }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                let result;
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    result = await response.json();
                } else {
                    result = { message: await response.text() };
                }

                if (!response.ok) {
                    if (response.status === 404) {
                        console.warn('Email API not found (404). If you are running locally with Vite, use "vercel dev" to test APIs.');
                    } else {
                        console.warn('Email API responded with error:', response.status, result);
                    }
                } else {
                    console.log('Email sent successfully:', result);
                }
            } catch (emailError: any) {
                clearTimeout(timeoutId);
                if (emailError.name === 'AbortError') {
                    console.error('Email API timed out');
                } else {
                    console.error('Error sending email:', emailError);
                }
                // Don't fail the whole submission if just the email fails
            }

            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting inquiry:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = e.target;
        setFormData(prev => {
            const currentValues = (prev as any)[name] || [];
            if (checked) {
                return { ...prev, [name]: [...currentValues, value] };
            } else {
                return { ...prev, [name]: currentValues.filter((v: string) => v !== value) };
            }
        });
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Send className="text-green-600" size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Thank You!</h2>
                    <p className="text-gray-600 mb-8">
                        We've received your project inquiry. Our team will review your requirements and get back to you within 24 hours.
                    </p>
                    <Link to="/">
                        <button className="px-8 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-all">
                            Back to Home
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-16 px-4">
            <div className="max-w-3xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors">
                    <ArrowLeft size={20} />
                    <span>Back to Home</span>
                </Link>

                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Start Your Project Journey</h1>
                    <p className="text-gray-600 mb-8">
                        Tell us about your project and we'll provide a custom quote within 24 hours.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Contact Information</h3>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Service Type Selector */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Service Type *</label>
                            <select
                                name="serviceType"
                                required
                                value={formData.serviceType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            >
                                <option value="shopify">Shopify Store</option>
                                <option value="web-dev">Custom Web Development</option>
                                <option value="graphics">Graphics & Branding</option>
                            </select>
                        </div>

                        {/* Shopify Specific Questions */}
                        {formData.serviceType === 'shopify' && (
                            <div className="space-y-4 p-6 bg-blue-50 rounded-xl">
                                <h3 className="text-xl font-bold text-slate-900">Shopify Project Details</h3>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">What will you be selling? *</label>
                                    <input
                                        type="text"
                                        name="shopifyProductType"
                                        required
                                        value={formData.shopifyProductType || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Do you already have products/suppliers? *</label>
                                    <select
                                        name="shopifyHasProducts"
                                        required
                                        value={formData.shopifyHasProducts || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    >
                                        <option value="">Select...</option>
                                        <option value="yes-products">Yes, I have products ready</option>
                                        <option value="yes-supplier">Yes, I have a supplier</option>
                                        <option value="need-help">No, I need help finding products</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Estimated Budget *</label>
                                    <select
                                        name="shopifyBudget"
                                        required
                                        value={formData.shopifyBudget || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    >
                                        <option value="">Select...</option>
                                        <option value="under-500">Under $500</option>
                                        <option value="500-1000">$500 - $1,000</option>
                                        <option value="1000-2500">$1,000 - $2,500</option>
                                        <option value="2500-plus">$2,500+</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Web Dev Specific Questions */}
                        {formData.serviceType === 'web-dev' && (
                            <div className="space-y-4 p-6 bg-green-50 rounded-xl">
                                <h3 className="text-xl font-bold text-slate-900">Web Development Details</h3>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">What type of website do you need? *</label>
                                    <select
                                        name="webDevType"
                                        required
                                        value={formData.webDevType || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                    >
                                        <option value="">Select...</option>
                                        <option value="landing-page">Landing Page</option>
                                        <option value="business-website">Business Website</option>
                                        <option value="web-app">Web Application</option>
                                        <option value="portfolio">Portfolio/Personal Site</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">How many pages? *</label>
                                    <select
                                        name="webDevPages"
                                        required
                                        value={formData.webDevPages || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                    >
                                        <option value="">Select...</option>
                                        <option value="1-5">1-5 pages</option>
                                        <option value="6-10">6-10 pages</option>
                                        <option value="11-20">11-20 pages</option>
                                        <option value="20-plus">20+ pages</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">Features needed (select all that apply)</label>
                                    <div className="space-y-2">
                                        {['Contact Form', 'Blog', 'User Login', 'Payment Integration', 'Admin Dashboard', 'API Integration'].map((feature) => (
                                            <label key={feature} className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="webDevFeatures"
                                                    value={feature}
                                                    onChange={handleCheckboxChange}
                                                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                />
                                                <span className="text-slate-700">{feature}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Graphics Specific Questions */}
                        {formData.serviceType === 'graphics' && (
                            <div className="space-y-4 p-6 bg-pink-50 rounded-xl">
                                <h3 className="text-xl font-bold text-slate-900">Graphics Project Details</h3>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">What do you need designed? *</label>
                                    <select
                                        name="graphicsType"
                                        required
                                        value={formData.graphicsType || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                                    >
                                        <option value="">Select...</option>
                                        <option value="logo">Logo Only</option>
                                        <option value="brand-identity">Complete Brand Identity</option>
                                        <option value="social-media">Social Media Graphics</option>
                                        <option value="ui-ux">UI/UX Design</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Do you have existing branding? *</label>
                                    <select
                                        name="graphicsBrandExists"
                                        required
                                        value={formData.graphicsBrandExists || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                                    >
                                        <option value="">Select...</option>
                                        <option value="yes">Yes, I have brand guidelines</option>
                                        <option value="partial">Partial (logo only)</option>
                                        <option value="no">No, starting from scratch</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Primary usage *</label>
                                    <input
                                        type="text"
                                        name="graphicsUsage"
                                        required
                                        value={formData.graphicsUsage || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Common Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">When do you need this completed? *</label>
                                <select
                                    name="timeline"
                                    required
                                    value={formData.timeline}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                >
                                    <option value="">Select...</option>
                                    <option value="asap">ASAP (Rush)</option>
                                    <option value="1-2-weeks">1-2 weeks</option>
                                    <option value="3-4-weeks">3-4 weeks</option>
                                    <option value="1-2-months">1-2 months</option>
                                    <option value="flexible">Flexible</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Additional Information</label>
                                <textarea
                                    name="additionalInfo"
                                    value={formData.additionalInfo}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    Submit Project Inquiry <Send size={20} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectInquiry;
