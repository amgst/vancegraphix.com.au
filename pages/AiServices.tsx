import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Bot, Sparkles, Workflow, CheckCircle, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const AiServices: React.FC = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'AI Services and Automation',
    provider: {
      '@type': 'Organization',
      name: 'Vance Graphix & Print (VGP)',
    },
    areaServed: 'Australia',
    description:
      'AI-powered content creation, image generation and workflow automation services for businesses.',
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="AI Services & Automation | Content, Images & Workflows"
        description="Use AI to speed up content creation, image generation and business workflows. Vance Graphix & Print (VGP) helps you integrate AI tools into real projects."
        canonical="/ai-services"
        structuredData={structuredData}
      />

      <section className="relative py-24 bg-slate-900 text-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-700/40 via-slate-900 to-slate-900" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-sm font-medium">
                <Brain size={16} />
                <span>AI Services &amp; Automation</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Make AI <span className="text-yellow-400">Work</span> for Your Business.
              </h1>
              <p className="text-xl text-gray-300 max-w-xl leading-relaxed">
                We combine design, development and AI tools to create content, images and automations that
                save time and increase results – without losing your brand voice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/inquiry?type=ai">
                  <button className="px-8 py-4 bg-yellow-400 text-slate-900 rounded-full font-bold hover:bg-yellow-300 transition-all shadow-lg flex items-center gap-2">
                    Discuss an AI Project <ArrowRight size={18} />
                  </button>
                </Link>
                <Link to="/contact">
                  <button className="px-8 py-4 bg-transparent border border-gray-500 text-white rounded-full font-medium hover:bg-white/10 transition-all">
                    Ask a Question
                  </button>
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-indigo-500 to-blue-500 rounded-2xl blur opacity-30" />
                <div className="relative bg-slate-800 rounded-2xl p-6 border border-slate-700 grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700">
                      <p className="text-xs text-gray-400 mb-2">AI Content</p>
                      <p className="text-sm text-gray-100">
                        Product descriptions, ad copy and email drafts generated, then refined by humans.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700">
                      <p className="text-xs text-gray-400 mb-2">Image Variations</p>
                      <p className="text-sm text-gray-100">
                        Multiple visual options for campaigns using AI image tools and manual polish.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4 pt-4">
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700 flex items-center gap-3">
                      <Bot size={24} className="text-yellow-400 flex-shrink-0" />
                      <p className="text-sm text-gray-100">Chatbot and FAQ assistants for your website.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700 flex items-center gap-3">
                      <Workflow size={24} className="text-indigo-400 flex-shrink-0" />
                      <p className="text-sm text-gray-100">
                        Automated workflows that connect forms, email and CRMs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What We Offer</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Practical AI services that support your existing marketing, design and operations – not
              replace them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'AI Content Support',
                description:
                  'Drafts for blogs, product descriptions, email campaigns and social captions, edited by our team to match your brand tone.',
              },
              {
                icon: Brain,
                title: 'AI Image & Asset Creation',
                description:
                  'Concept visuals, background replacements and image variations prepared with AI tools and finished in professional design software.',
              },
              {
                icon: Workflow,
                title: 'Automation & Workflows',
                description:
                  'Connect forms, CRMs, email marketing and reporting to reduce repetitive manual work and improve response times.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-8 border border-gray-100 rounded-2xl hover:shadow-xl transition-all bg-white group"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How an AI Project Works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              A simple, collaborative process so you always stay in control of quality and messaging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Discovery',
                text: 'We discuss your goals, current workflow and what AI could realistically improve.',
              },
              {
                step: '2',
                title: 'Prototype',
                text: 'We create small test examples – content, images or automations – for you to review.',
              },
              {
                step: '3',
                title: 'Refinement',
                text: 'We refine prompts, rules and templates until the outputs match your expectations.',
              },
              {
                step: '4',
                title: 'Rollout',
                text: 'We document the process and help integrate it into your daily operations.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col items-start"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Start Small, Then Scale Your AI Use.
          </h2>
          <p className="text-lg text-gray-500 mb-10">
            You don&apos;t need a huge budget or complex infrastructure to benefit from AI. We help you
            identify one or two quick wins, prove the value and then expand from there.
          </p>
          <Link to="/inquiry?type=ai">
            <button className="px-10 py-5 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all">
              Talk About AI for My Business
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AiServices;

