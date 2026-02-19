import React from 'react';
import { Shield, Lock, Eye } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-slate max-w-none">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="text-blue-600" size={24} />
              1. Information We Collect
            </h2>
            <p className="text-slate-600 mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
              <li>Name and contact information (email address, phone number)</li>
              <li>Project details and requirements</li>
              <li>Communication preferences</li>
              <li>Payment information (processed securely by third-party providers)</li>
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Eye className="text-blue-600" size={24} />
              2. How We Use Your Information
            </h2>
            <p className="text-slate-600 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your transactions and send related information</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Communicate with you about products, services, and events</li>
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Lock className="text-blue-600" size={24} />
              3. Data Security
            </h2>
            <p className="text-slate-600 mb-4">
              We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Contact Us</h3>
            <p className="text-slate-600">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <a href="mailto:ahmed@vancegraphix.com.au" className="text-blue-600 hover:text-blue-700 font-medium">
                ahmed@vancegraphix.com.au
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
