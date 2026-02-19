import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, ArrowRight, Sparkles, Send } from 'lucide-react';
import SEO from '../components/SEO';
import { submitJobApplication } from '../lib/careersService';

const roles = [
  {
    title: 'Frontend Engineer (React)',
    type: 'Full-time',
    location: 'Remote',
    description: 'Build fast, accessible React interfaces with modern tooling and best practices.',
  },
  {
    title: 'Shopify Developer',
    type: 'Contract',
    location: 'Remote',
    description: 'Implement high-converting Shopify storefronts with custom themes and apps.',
  },
  {
    title: 'UI/UX Designer',
    type: 'Part-time',
    location: 'Hybrid',
    description: 'Design elegant interfaces and UX flows across web and mobile experiences.',
  },
];

const benefits = [
  'Remote-first culture',
  'Flexible hours',
  'Growth-focused environment',
  'Modern tooling and processes',
  'Supportive, collaborative team',
];

const Careers: React.FC = () => {
  const [appData, setAppData] = React.useState({
    fullName: '',
    email: '',
    role: roles[0].title,
    experienceYears: '',
    skills: '',
    portfolioUrl: '',
    linkedinUrl: '',
    coverLetter: '',
  });
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAppData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitJobApplication(appData);

      // Email notification
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'application', data: appData }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
          // Log but don't fail submission
          const text = await response.text();
          console.warn('Application email API error:', response.status, text);
        }
      } catch (err) {
        clearTimeout(timeoutId);
        console.warn('Application email send failed:', err);
      }

      setStatus('success');
      setAppData({
        fullName: '',
        email: '',
        role: roles[0].title,
        experienceYears: '',
        skills: '',
        portfolioUrl: '',
        linkedinUrl: '',
        coverLetter: '',
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Careers at Vance Graphix & Print (VGP)"
        description="Join Vance Graphix & Print (VGP) and help deliver high quality design, web and print solutions. Explore open roles and apply."
        canonical="/careers"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-white pt-16 lg:pt-20 lg:pb-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold">
              <Sparkles size={16} />
              <span>We’re Hiring</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
              Build the future with VGP
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Join a team focused on speed, craft, and delightful user experiences.
            </p>
            <div className="pt-2">
              <Link to="/contact">
                <button className="px-8 py-4 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-all">
                  General Applications
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Open Roles</h2>
              <p className="text-gray-500 mt-2">We’re always looking for exceptional talent.</p>
            </div>
            <div className="hidden md:block">
              <a href="#apply" className="px-6 py-3 bg-white border border-gray-200 text-slate-900 rounded-full font-medium hover:bg-slate-50 hover:border-slate-300 transition-all inline-flex items-center gap-2">
                Submit Resume <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role, idx) => (
              <div key={idx} className="p-8 border border-gray-100 rounded-2xl hover:shadow-xl transition-all bg-white group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{role.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{role.type}</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={14} />
                        {role.location}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{role.description}</p>
                <div className="mt-6">
                  <a href="#apply" className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                    Apply Now <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Submit Your Application</h2>
            <p className="text-gray-500">This form is tailored for careers, not general contact.</p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={appData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={appData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  name="role"
                  value={appData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-white"
                >
                  {roles.map(r => (
                    <option key={r.title} value={r.title}>{r.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                <input
                  type="text"
                  name="experienceYears"
                  value={appData.experienceYears}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="e.g., 3+ years"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Key Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={appData.skills}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="React, Shopify, Figma"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio URL</label>
                <input
                  type="url"
                  name="portfolioUrl"
                  value={appData.portfolioUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="https://your-portfolio.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={appData.linkedinUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="https://linkedin.com/in/you"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter</label>
              <textarea
                name="coverLetter"
                value={appData.coverLetter}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="Share why you’d be a great fit..."
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {status === 'submitting' ? (
                <>Submitting...</>
              ) : (
                <>
                  <Send size={18} /> Submit Application
                </>
              )}
            </button>

            {status === 'success' && (
              <div className="p-4 bg-green-50 text-green-700 rounded-lg">
                Application submitted! We’ll be in touch soon.
              </div>
            )}
            {status === 'error' && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                Something went wrong. Please try again later.
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Benefits & Culture</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We believe in craftsmanship, ownership, and continuous growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((b, idx) => (
              <div key={idx} className="p-8 bg-white border border-gray-100 rounded-2xl text-slate-900">
                <h3 className="text-lg font-semibold">{b}</h3>
                <p className="text-gray-500 mt-2">Made possible by a supportive team and modern processes.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Don’t see a perfect match?</h3>
          <p className="text-gray-500 mb-6">We still want to hear from you. Tell us how you can help.</p>
          <a href="#apply" className="px-8 py-4 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-all inline-block">
            Send a General Application
          </a>
        </div>
      </section>
    </div>
  );
};

export default Careers;
