import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';
import { useSettings } from './SettingsProvider';

const Footer: React.FC = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-slate-50 border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <span className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.siteName} className="h-8 w-auto object-contain" />
              ) : (
                <>wb<span className="text-blue-600">ify</span></>
              )}
            </span>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed">
              All your creative & digital services in one place. From web design to printing, we deliver premium quality for your business.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-3">
              <li><Link to="/services" className="text-gray-500 hover:text-blue-600 text-sm">Graphic Design & Print</Link></li>
              <li><Link to="/services" className="text-gray-500 hover:text-blue-600 text-sm">Web / Digital Services</Link></li>
              <li><Link to="/services" className="text-gray-500 hover:text-blue-600 text-sm">Video & Animation</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-500 hover:text-blue-600 text-sm">About Us</Link></li>
              <li><Link to="/portfolio" className="text-gray-500 hover:text-blue-600 text-sm">Portfolio</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-blue-600 text-sm">Contact</Link></li>
              <li><Link to="/careers" className="text-gray-500 hover:text-blue-600 text-sm">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Connect</h3>
            <div className="flex space-x-4">
              {settings.socialUrls?.instagram && (
                <a href={settings.socialUrls.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Instagram size={20} />
                </a>
              )}
              {settings.socialUrls?.twitter && (
                <a href={settings.socialUrls.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Twitter size={20} />
                </a>
              )}
              {settings.socialUrls?.linkedin && (
                <a href={settings.socialUrls.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Linkedin size={20} />
                </a>
              )}
              {settings.socialUrls?.facebook && (
                <a href={settings.socialUrls.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Facebook size={20} />
                </a>
              )}
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-500">wbify.com@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} wbify Creative Studio. All rights reserved.</p>
          <div className="flex flex-col md:flex-row items-center gap-6 mt-4 md:mt-0">
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer">Privacy Policy</Link>
              <Link to="/terms-and-conditions" className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
