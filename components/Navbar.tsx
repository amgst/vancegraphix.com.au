import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Rocket } from 'lucide-react';
import { useSettings } from './SettingsProvider';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();

  const navLinks = [
    { name: 'Home', path: '/', dropdown: false },
    {
      name: 'Services',
      path: '/services',
      dropdown: [
        { name: 'Shopify Solutions', path: '/shopify' },
        { name: 'Custom Web Dev', path: '/web-dev' },
        { name: 'WordPress Development', path: '/wordpress' },
        { name: 'Graphics & Branding', path: '/graphics' },
        { name: 'Printing Solutions', path: '/printing' },
        { name: 'Video & Animation', path: '/video-animation' },
        { name: 'Design Process', path: '/design-process' },
        { name: 'All Services', path: '/services' }
      ]
    },
    { name: 'Blog', path: '/blog', dropdown: false },
    {
      name: 'Portfolio',
      path: '/portfolio',
      dropdown: [
        { name: 'Web Portfolio', path: '/portfolio' },
        { name: 'Print Portfolio', path: '/print-portfolio' }
      ]
    },
    { name: 'POD', path: '/store', dropdown: false },
    { name: 'Fast Track', path: '/websites-for-sale', dropdown: false },
    { name: 'About', path: '/about-us', dropdown: false },
    { name: 'Reviews', path: '/reviews', dropdown: false },
    { name: 'Contact', path: '/contact-us', dropdown: false },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.siteName} className="h-11 w-auto object-contain" />
              ) : (
                <>Vance<span className="text-blue-600">Graphix</span></>
              )}
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                {link.dropdown ? (
                  <button
                    className={`text-sm font-medium transition-colors duration-200 ${isActive(link.path)
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-slate-900'
                      }`}
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    to={link.path}
                    className={`text-sm font-medium transition-colors duration-200 ${isActive(link.path)
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-slate-900'
                      }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {link.name}
                      {link.name === 'Fast Track' && (
                        <Rocket size={16} className="text-blue-600 animate-bounce" />
                      )}
                    </span>
                  </Link>
                )}

                {link.dropdown && (
                  <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Link to="/inquiry">
              <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-slate-900 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <div key={link.name}>
                <Link
                  to={link.path}
                  onClick={() => !link.dropdown && setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-slate-900 hover:bg-gray-50'
                    }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {link.name}
                    {link.name === 'Fast Track' && (
                      <Rocket size={18} className="text-blue-600 animate-bounce" />
                    )}
                  </span>
                </Link>

                {link.dropdown && (
                  <div className="pl-4 mt-1 space-y-1">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="px-3 py-3">
              <Link
                to="/inquiry"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
