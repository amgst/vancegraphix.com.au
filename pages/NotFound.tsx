import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8">
            <Helmet>
                <title>404 - Page Not Found | Vance Graphix &amp; Print (VGP)</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="max-w-md w-full text-center">
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                        <div className="relative bg-white p-4 rounded-full shadow-sm">
                            <AlertCircle className="h-16 w-16 text-blue-600" />
                        </div>
                    </div>
                </div>

                <h1 className="text-6xl font-extrabold text-slate-900 mb-4 tracking-tight">404</h1>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Page not found</h2>
                <p className="text-gray-500 mb-8 text-lg">
                    Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
                </p>

                <Link to="/">
                    <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                        <Home className="mr-2 h-5 w-5" />
                        Back to Home
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
