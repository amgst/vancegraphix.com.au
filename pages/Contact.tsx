import React from 'react';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import { submitContactMessage } from '../lib/contactService';

import SEO from '../components/SEO';

const Contact: React.FC = () => {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    service: 'Graphic Design',
    message: ''
  });
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started', formData);
    setStatus('submitting');

    try {
      // Save to Firestore
      console.log('Saving to Firestore...');
      await submitContactMessage(formData);
      console.log('Saved to Firestore successfully');

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
            type: 'contact',
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

      setStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        service: 'Graphic Design',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting message:', error);
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Vance Graphix & Print (VGP)',
    description: 'Get in touch with Vance Graphix & Print (VGP) for graphic design, web development, printing, e-commerce, and email marketing services.',
    mainEntity: {
      '@type': 'Organization',
      name: 'Vance Graphix & Print (VGP)',
      email: 'ahmed@vancegraphix.com.au',
      telephone: '+61 470 642 633'
    }
  };

  return (
    <div className="min-h-screen bg-white py-20">
      <SEO
        title="Contact Vance Graphix & Print (VGP) | Start Your Project Today"
        description="Ready to upgrade your brand, web presence or printing? Contact Vance Graphix & Print (VGP) for a free consultation and quote."
        canonical="/contact-us"
        structuredData={contactStructuredData}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Let's Discuss Your Project</h1>
          <p className="text-gray-500">Have a project in mind? We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Australia Office</h3>

              <div className="space-y-8">
                <div>
                  <p className="font-semibold text-slate-900 mb-2">Sydney Office</p>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Phone className="text-blue-600 mt-1 mr-4" />
                      <p className="text-gray-500">+61 470 642 633</p>
                    </div>
                    <div className="flex items-start">
                      <Mail className="text-blue-600 mt-1 mr-4" />
                      <p className="text-gray-500">ahmed@vancegraphix.com.au</p>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="text-blue-600 mt-1 mr-4" />
                      <p className="text-gray-500">44 Flushcombe Rd, Blacktown</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-slate-900 mb-2">Brisbane Office</p>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Phone className="text-blue-600 mt-1 mr-4" />
                      <p className="text-gray-500">+61 404 777 738</p>
                    </div>
                    <div className="flex items-start">
                      <Mail className="text-blue-600 mt-1 mr-4" />
                      <p className="text-gray-500">info@vancegraphix.com.au</p>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="text-blue-600 mt-1 mr-4" />
                      <p className="text-gray-500">280 Yarrabilba Dr., Yarrabilba, QLD, 4207</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Payment Details</h3>
              <div className="space-y-4 text-gray-500">
                <div>
                  <p className="font-semibold text-slate-900 mb-1">EFT</p>
                  <p>Bank: ANZ</p>
                  <p>Account Name: Vance Graphix &amp; Print</p>
                  <p>BSB: 012 408</p>
                  <p>Account: 192580993</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Check Post To</p>
                  <p>Vance Graphix &amp; Print</p>
                  <p>82 Tallwoods Circuit,</p>
                  <p>Yarrabilba, QLD 4207</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Interested In</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-white"
              >
                <option>Graphic Design</option>
                <option>Web Development</option>
                <option>Digital Marketing</option>
                <option>Video & Animation</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'success' && (
              <div className="p-4 bg-green-50 text-green-700 rounded-lg">
                Message sent successfully! We'll get back to you soon.
              </div>
            )}

            {status === 'error' && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                Something went wrong. Please try again later.
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
};

export default Contact;
