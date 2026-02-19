import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Clapperboard, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const VideoAnimation: React.FC = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Video and Animation Production',
    provider: {
      '@type': 'Organization',
      name: 'Vance Graphix & Print (VGP)',
    },
    areaServed: 'Australia',
    description:
      'Video editing, logo animation, explainer videos and social media content to help businesses tell their story.',
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <SEO
        title="Video & Animation Services | Video Editing, Logo Animation & More"
        description="Bring your brand to life with professional video editing, logo animation, explainer videos and social media content crafted by Vance Graphix & Print (VGP)."
        canonical="/video-animation"
        structuredData={structuredData}
      />

      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-indigo-500/30 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-100 text-sm font-medium">
                <Video size={16} />
                <span>Video &amp; Animation</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Make Your Brand <span className="text-yellow-400">Move.</span>
              </h1>
              <p className="text-xl text-gray-200 max-w-xl leading-relaxed">
                From logo stings and social shorts to full explainer videos, we craft motion content that
                captures attention and clearly communicates your message.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/inquiry?type=video">
                  <button className="px-8 py-4 bg-yellow-400 text-slate-900 rounded-full font-bold hover:bg-yellow-300 transition-all shadow-lg flex items-center gap-2">
                    Start a Video Project <ArrowRight size={18} />
                  </button>
                </Link>
                <a
                  href="https://www.youtube.com/@videofiy1853/videos"
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 bg-transparent border border-gray-400 text-white rounded-full font-medium hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2"
                >
                  View YouTube Channel
                </a>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-200">
                  <Clapperboard size={20} className="text-yellow-400" />
                  <span>Featured video from our YouTube channel</span>
                </div>
                <div className="rounded-3xl overflow-hidden shadow-2xl bg-black relative w-full pt-[56.25%]">
                  <iframe
                    title="Videofiy YouTube Channel"
                    src="https://www.youtube.com/embed/n5IR_ViPuQ0"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What We Produce</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Motion content tailored for websites, e‑commerce, social media and paid advertising.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'Logo Animation',
                description:
                  'Short logo stings and intros for your website, YouTube channel, social reels and presentations.',
              },
              {
                icon: Video,
                title: 'Explainer & Promo Video',
                description:
                  'Script, storyboard and animation/editing to clearly explain your product or service.',
              },
              {
                icon: Clapperboard,
                title: 'Social Media Video',
                description:
                  'Short, punchy vertical videos for Instagram, Facebook, TikTok and YouTube Shorts.',
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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose VGP for Video?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Design, animation and editing under one roof, with a clear process from concept to delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Story‑first Approach',
                points: [
                  'We focus on the message before the motion.',
                  'Script and structure aligned to your goals.',
                ],
              },
              {
                title: 'Optimised for Platforms',
                points: [
                  'Deliverables for web, social and presentations.',
                  'Aspect ratios and file types tailored to each platform.',
                ],
              },
              {
                title: 'End‑to‑end Production',
                points: [
                  'Concept, storyboard, design and editing.',
                  'Voiceover and music sourcing if required.',
                ],
              },
            ].map((block, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-4">{block.title}</h3>
                <ul className="space-y-3 text-gray-600">
                  {block.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to turn your ideas into motion?
          </h2>
          <p className="text-lg text-slate-200 mb-8">
            Share your brief with us and we will recommend the best video or animation format for your
            goals and budget.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/inquiry?type=video">
              <button className="px-8 py-4 bg-yellow-400 text-slate-900 rounded-full font-bold hover:bg-yellow-300 transition-all shadow-lg">
                Get a Video Quote
              </button>
            </Link>
            <a
              href="https://www.youtube.com/@videofiy1853/videos"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 bg-transparent border border-white/40 text-white rounded-full font-medium hover:bg-white/10 transition-all"
            >
              Browse YouTube Samples
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VideoAnimation;
