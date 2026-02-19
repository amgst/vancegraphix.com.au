import React from 'react';
import SEO from '../components/SEO';

const DesignProcess: React.FC = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Our Design Process',
    description:
      'Learn how Vance Graphix & Print (VGP) takes your project from first conversation through research, development, presentation and final production.',
    provider: {
      '@type': 'Organization',
      name: 'Vance Graphix & Print (VGP)',
    },
  };

  return (
    <div className="min-h-screen bg-white py-20">
      <SEO
        title="Our Design Process | Vance Graphix & Print (VGP)"
        description="Discover how Vance Graphix & Print (VGP) manages every project from briefing and research through concept development, presentation and final production."
        canonical="/design-process"
        structuredData={structuredData}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight uppercase">
              <span>Our Design </span>
              <span className="text-yellow-500">Process</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              If you are looking for a creative studio, you have come to the right place. Under one roof,
              our team delivers graphic design, website design and development using the latest and most
              effective techniques.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We produce results driven, creative solutions that give you a real advantage over your
              competitors. At VGP, we make sure you consistently receive high-end, cost effective graphic
              design, development and advertising outcomes.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://vancegraphix.com.au/wp-content/uploads/2022/02/Design_Processing_ImageB-462x500.jpg"
              alt="VGP design process layout with branding work"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        <section className="bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://vancegraphix.com.au/wp-content/uploads/2024/09/37980.jpg"
                alt="Project commencing discussion at VGP"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                <span>Project </span>
                <span className="text-yellow-500">Commencing</span>
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                One of the most important steps in the design process is understanding what the client
                needs to achieve. We do this through face-to-face meetings, structured questionnaires or
                online sessions such as a video call. Once we gather this information, the VGP team can
                focus on the details for inclusion in the design brief.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Topics for inclusion in the design brief may vary, but strong starting points include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                <li>Corporate profile – a summary of the business.</li>
                <li>
                  Market position – how the product or service sits in the market compared to competitors.
                </li>
                <li>
                  Communication task – the message being conveyed and the channels used, including
                  taglines, copy, photography and layout.
                </li>
                <li>
                  Target market – demographics such as age, gender, income, location, lifestyle and buying
                  behaviour.
                </li>
                <li>
                  Objectives and schedule – clear goals and a realistic timeline for how the project should
                  proceed.
                </li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                At this stage it is also common to collect a deposit for the first stage of the project.
              </p>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <img
              src="https://vancegraphix.com.au/wp-content/uploads/2023/09/design-process-1536x529.jpg"
              alt="VGP design process steps diagram"
              className="w-full max-w-4xl rounded-2xl shadow-md object-contain"
            />
          </div>
        </section>

        <section className="mt-16 bg-slate-50 rounded-3xl px-6 sm:px-10 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                <span>Research </span>
                <span className="text-yellow-500">/ Brainstorming</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                After we have a solid brief, we move into research. This includes reviewing competitors,
                analysing market trends, understanding how your product or service is different, and
                looking at both the history and future direction of the business. During this stage we may
                suggest alternate approaches that could help you achieve your goals faster, while always
                respecting your final decision.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://vancegraphix.com.au/wp-content/uploads/2020/01/desktop-of-hard-working-entrepreneur.jpg"
                alt="Research and brainstorming at VGP workstation"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mt-16 bg-white rounded-3xl px-6 sm:px-10 py-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://vancegraphix.com.au/wp-content/uploads/2020/01/young-male-graphic-designer-at-computer-screen-while-holding-graphic-pen-at-desk-in-office.jpg"
                alt="Designer developing concepts on screen"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                <span>Development </span>
                <span className="text-yellow-500">Process</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                With a clear strategy in place, our designers and developers begin creating preliminary
                design concepts. Concepts are developed through sketching, digital mockups and interactive
                prototypes, all guided by the goals we defined together in the brief and research stages.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16 bg-slate-50 rounded-3xl px-6 sm:px-10 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                <span>Presentation </span>
                <span className="text-yellow-500">/ Modification</span>
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Concepts are usually presented as PDF or online presentations showing the design in
                context. Your role is to review the work and provide feedback based on your objectives and
                the needs of your target audience.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our team then refines layout, colour, typography and imagery, making modifications based on
                your feedback and preparing the final approved design ready for production.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://vancegraphix.com.au/wp-content/uploads/2020/01/white-male-executive-leading-a-meeting.jpg"
                alt="Presentation of design concepts in meeting"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mt-16 bg-white rounded-3xl px-6 sm:px-10 py-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://vancegraphix.com.au/wp-content/uploads/2020/01/color-shade-swatch-stationary-designer-creative-concept.jpg"
                alt="Color swatches and stationery for production"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                <span>Production </span>
                <span className="text-yellow-500">/ Launch</span>
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Once designs are approved, we implement them across all required deliverables, which may
                include both print and digital assets. This can involve working with print partners, media
                outlets, social platforms or deploying to the web.
              </p>
              <p className="text-gray-600 leading-relaxed">
                For web projects we can also provide instructions and documentation for your team, as well
                as support around search engine submission and launch activities.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16 mb-8 bg-slate-50 rounded-3xl px-6 sm:px-10 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                <span>Completion </span>
                <span className="text-yellow-500">/ Commitment</span>
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Our full-time team of professional graphic designers and developers has proven success
                delivering exciting visual solutions, from logo design through to complex integrated
                branding and marketing concepts.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Develop a professional understanding of your target audience and market.</li>
                <li>
                  Work in an open and realistic way, allowing clear communication between you and our
                  designers and developers.
                </li>
                <li>
                  Provide creative and development services that fully satisfy your goals and requirements.
                </li>
                <li>Deliver work within your budget and agreed timeframes.</li>
                <li>Supply finished artwork that is ready for the required method of reproduction.</li>
              </ul>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://vancegraphix.com.au/wp-content/uploads/2020/01/successful-business-meeting.jpg"
                alt="Successful business meeting after project completion"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignProcess;
