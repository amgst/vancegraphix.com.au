import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin, Facebook, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';
import { useSettings } from './SettingsProvider';

const Footer: React.FC = () => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-gray-200 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-12 mb-12">
          <div className="space-y-6">
            <div className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.siteName} className="h-9 w-auto object-contain" />
              ) : (
                <>
                  Vance<span className="text-yellow-400">Graphix</span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              All your print, signage, graphics and web handled under one roof with local support.
            </p>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">Average customer rating</p>
              <a
                href="https://au.trustpilot.com/review/vancegraphix.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <div className="bg-slate-800/60 rounded-lg px-4 py-3">
                  <p className="text-xs text-gray-300 mb-1">Excellent on Trustpilot</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      <span className="text-emerald-400 text-lg leading-none">★★★★★</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">Print Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/print-portfolio/flyer-leaflets/" className="flex items-center gap-2 text-gray-200 hover:text-white">
                  <ChevronRight size={14} /> Flyer &amp; Leaflets
                </a>
              </li>
              <li>
                <a href="/print-portfolio/menu-cafe/" className="flex items-center gap-2 text-gray-200 hover:text-white">
                  <ChevronRight size={14} /> Restaurant Menu
                </a>
              </li>
              <li>
                <a href="/print-portfolio/business-cards/" className="flex items-center gap-2 text-gray-200 hover:text-white">
                  <ChevronRight size={14} /> Business Cards
                </a>
              </li>
              <li>
                <a href="/print-portfolio/office-stationary/" className="flex items-center gap-2 text-gray-200 hover:text-white">
                  <ChevronRight size={14} /> Office Stationery
                </a>
              </li>
              <li>
                <a href="/print-portfolio/logo/" className="flex items-center gap-2 text-gray-200 hover:text-white">
                  <ChevronRight size={14} /> Logo
                </a>
              </li>
              <li>
                <a href="/print-portfolio/signage/" className="flex items-center gap-2 text-gray-200 hover:text-white">
                  <ChevronRight size={14} /> Signage
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">Web Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/web-dev" className="flex items-center gap-2 text-gray-200 hover:text-white">
                  <ChevronRight size={14} /> Web Development
                </Link>
              </li>
              <li>
                <Link to="/services" className="flex items-center gap-2 text-gray-200 hover:text-white">
                  <ChevronRight size={14} /> Website Maintenance
                </Link>
              </li>
              <li>
                <Link to="/services" className="flex items-center gap-2 text-gray-200 hover:text-white">
                  <ChevronRight size={14} /> Social Media Marketing
                </Link>
              </li>
              <li>
                <Link to="/services" className="flex items-center gap-2 text-gray-200 hover:text-white">
                  <ChevronRight size={14} /> Email Marketing
                </Link>
              </li>
              <li>
                <Link to="/services" className="flex items-center gap-2 text-gray-200 hover:text-white">
                  <ChevronRight size={14} /> Web Hosting
                </Link>
              </li>
              <li>
                <Link to="/services" className="flex items-center gap-2 text-gray-200 hover:text-white">
                  <ChevronRight size={14} /> Domain Name
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">About VGP</h3>
            <ul className="space-y-2 text-sm mb-6">
              <li>
                <Link to="/about-us" className="flex items-center gap-2 text-gray-200 hover:text-white">
                  <ChevronRight size={14} /> About Us
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="flex items-center gap-2 text-gray-200 hover:text-white">
                  <ChevronRight size={14} /> Contact Us
                </Link>
              </li>
              <li>
                <Link to="/our-team" className="flex items-center gap-2 text-gray-200 hover:text-white">
                  <ChevronRight size={14} /> Our Team
                </Link>
              </li>
              <li>
                <Link to="/blog" className="flex items-center gap-2 text-gray-200 hover:text-white">
                  <ChevronRight size={14} /> Our Blog
                </Link>
              </li>
            </ul>
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">Our Partner</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-gray-200">
                <ChevronRight size={14} /> VGP Paper Cups
              </li>
              <li className="flex items-center gap-2 text-gray-200">
                <ChevronRight size={14} /> VGP Host
              </li>
              <li className="flex items-center gap-2 text-gray-200">
                <ChevronRight size={14} /> Vgpstore
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">Australia Offices</h3>
            <div className="space-y-5 text-sm">
              <div>
                <p className="font-semibold text-white">Sydney Office</p>
                <div className="mt-1 space-y-1 text-gray-300">
                  <p className="flex items-start gap-2">
                    <MapPin size={14} className="mt-[2px]" />
                    <span>44 Flushcombe Rd, Blacktown</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={14} /> <span>+61 470 642 633</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail size={14} /> <span>ahmed@vancegraphix.com.au</span>
                  </p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-white">Brisbane Office</p>
                <div className="mt-1 space-y-1 text-gray-300">
                  <p className="flex items-start gap-2">
                    <MapPin size={14} className="mt-[2px]" />
                    <span>280 Yarrabilba Dr, Yarrabilba, QLD, 4207</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={14} /> <span>+61 404 777 738</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail size={14} /> <span>info@vancegraphix.com.au</span>
                  </p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-white">UAE Office</p>
                <div className="mt-1 space-y-1 text-gray-300">
                  <p className="flex items-start gap-2">
                    <MapPin size={14} className="mt-[2px]" />
                    <span>Industrial Area 3, Sharjah UAE</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={14} /> <span>+971 50 49 94 143</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail size={14} /> <span>rashiprint@gmail.com</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 mt-4" />

        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © 2012-{currentYear} | VGP All rights reserved | ABN 24 940 357 580
          </p>
          <div className="flex items-center gap-4">
            {settings.socialUrls?.facebook && (
              <a
                href={settings.socialUrls.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-gray-300 hover:text-white hover:border-yellow-400 transition-colors"
              >
                <Facebook size={16} />
              </a>
            )}
            {settings.socialUrls?.instagram && (
              <a
                href={settings.socialUrls.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-gray-300 hover:text-white hover:border-yellow-400 transition-colors"
              >
                <Instagram size={16} />
              </a>
            )}
            {settings.socialUrls?.twitter && (
              <a
                href={settings.socialUrls.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-gray-300 hover:text-white hover:border-yellow-400 transition-colors"
              >
                <Twitter size={16} />
              </a>
            )}
            {settings.socialUrls?.linkedin && (
              <a
                href={settings.socialUrls.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-gray-300 hover:text-white hover:border-yellow-400 transition-colors"
              >
                <Linkedin size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
