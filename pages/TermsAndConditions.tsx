import React from 'react';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms and Conditions</h1>
          <p className="text-lg text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-slate max-w-none">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="text-blue-600" size={24} />
              1. Agreement to Terms
            </h2>
            <p className="text-slate-600 mb-4">
              By accessing our website and using our services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not access the service.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle className="text-blue-600" size={24} />
              2. Intellectual Property
            </h2>
            <p className="text-slate-600 mb-4">
              The service and its original content, features, and functionality are and will remain the exclusive property of wbify and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of wbify.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <AlertCircle className="text-blue-600" size={24} />
              3. Limitation of Liability
            </h2>
            <p className="text-slate-600 mb-4">
              In no event shall wbify, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Questions?</h3>
            <p className="text-slate-600">
              Please send any questions or comments regarding these Terms to:
              <br />
              <a href="mailto:wbify.com@gmail.com" className="text-blue-600 hover:text-blue-700 font-medium">
                wbify.com@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
