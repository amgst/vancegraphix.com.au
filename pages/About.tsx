import React from 'react';
import { Heart, Users, Zap, Target, Award, Rocket, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import SEO from '../components/SEO';

const About: React.FC = () => {
  const aboutStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    mainEntity: {
      '@type': 'Organization',
      name: 'wbify Creative Studio',
      description: 'A digital creative studio dedicated to transforming businesses through exceptional design and technology',
      foundingDate: '2020',
      url: 'https://www.wbify.com'
    }
  };

  return (
    <div className="min-h-screen bg-white ">
      <SEO
        title="About wbify | Your Partners in Digital Transformation"
        description="We are a creative studio dedicated to your success. Learn about our journey from PixelPro to wbify, our core values, and our commitment to excellence."
        canonical="/about"
        structuredData={aboutStructuredData}
      />

      {/* Hero Section */}
      <div className="relative bg-slate-50 py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 skew-x-12 translate-x-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              We Are <span className="text-blue-600">wbify Creative Studio</span>
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              A digital creative studio dedicated to transforming businesses through exceptional design, cutting-edge technology, and strategic thinking.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-slate-900 mb-1">500+</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-900 mb-1">98%</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-900 mb-1">15+</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-900 mb-1">24/7</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">From PixelPro to wbify</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  The world was moving online, and our clients needed more than just paper—they needed a digital presence.
                </p>
                <p>
                  We evolved. We sharpened our skills in web development, mastered the Shopify ecosystem, and refined our digital branding expertise.
                </p>
                <p>
                  Today, we are <strong>wbify</strong>. Our name reflects our mission: to "web-ify" your business. We bridge the gap between traditional business values and modern digital solutions, helping you scale, automate, and look good doing it.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center text-slate-700">
                  <CheckCircle className="text-green-500 mr-2" size={20} />
                  <span>Shopify Experts</span>
                </div>
                <div className="flex items-center text-slate-700">
                  <CheckCircle className="text-green-500 mr-2" size={20} />
                  <span>Full-Stack Development</span>
                </div>
                <div className="flex items-center text-slate-700">
                  <CheckCircle className="text-green-500 mr-2" size={20} />
                  <span>Brand Strategy</span>
                </div>
                <div className="flex items-center text-slate-700">
                  <CheckCircle className="text-green-500 mr-2" size={20} />
                  <span>UI/UX Design</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl transform rotate-3 opacity-20"></div>
              <div className="bg-slate-900 text-white p-10 rounded-2xl relative shadow-xl">
                <h3 className="text-2xl font-bold mb-6">Why We Do It</h3>
                <p className="text-slate-300 mb-6">
                  "We believe that every business, no matter how small, deserves a world-class digital presence. Technology shouldn't be a barrier; it should be a bridge to your customers."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-bold text-xl">W</div>
                  <div className="ml-4">
                    <div className="font-bold">The wbify Team</div>
                    <div className="text-sm text-blue-400">Creative Studio</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">The principles that guide every pixel we push and every line of code we write.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-6 text-red-500">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Passion First</h3>
              <p className="text-gray-500">
                We don't just build websites; we build relationships. We care about your success as much as you do.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-500">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Radical Collaboration</h3>
              <p className="text-gray-500">
                We work with you, not just for you. Your feedback is integral to our process at every stage.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mb-6 text-amber-500">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Efficiency & Speed</h3>
              <p className="text-gray-500">
                In the digital world, speed matters. We deliver high-quality work on time, every time.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 text-purple-500">
                <Target size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Result Oriented</h3>
              <p className="text-gray-500">
                Pretty isn't enough. We design for conversion, functionality, and measurable growth.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 text-green-500">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Excellence</h3>
              <p className="text-gray-500">
                We sweat the small stuff. Every detail matters, from the code structure to the final pixel.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 text-indigo-500">
                <Rocket size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Innovation</h3>
              <p className="text-gray-500">
                We stay ahead of the curve, constantly learning new technologies to give you the edge.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Ready to start your journey?</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto relative z-10">
              Let's build something amazing together. Whether you need a new store, a custom app, or a brand refresh, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link to="/contact">
                <button className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-blue-50 transition-colors w-full sm:w-auto">
                  Get in Touch
                </button>
              </Link>
              <Link to="/services">
                <button className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-colors w-full sm:w-auto">
                  View Services
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;