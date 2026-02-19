import React from 'react';
import SEO from '../components/SEO';

const Printing: React.FC = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Printing Solutions',
    provider: {
      '@type': 'Organization',
      name: 'Vance Graphix & Print (VGP)',
    },
    areaServed: 'Australia',
    description:
      'Large format and digital printing solutions including signage, banners, proposals, brochures and more.',
  };

  return (
    <div className="min-h-screen bg-white py-20">
      <SEO
        title="Printing Solutions | Large Format & Digital Printing in Australia"
        description="Vance Graphix & Print (VGP) delivers fast, cost-effective printing solutions from one purpose-built premises, including large format signage and digital print services."
        canonical="/printing"
        structuredData={structuredData}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight uppercase">
              <span>Printing </span>
              <span className="text-yellow-500">Solutions</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              Unique to many creative agencies, Vance Graphix &amp; Print handles its print production
              and output from the one, purpose-built premises. Conveniently placed, we believe this offers
              the best possible service to you and your business.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Featuring state-of-the-art large format and digital printing equipment, we can provide our
              clients with fast turnaround and extremely cost-effective marketing solutions.
            </p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-blue-600">
              Print in Australia with VGP.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://vancegraphix.com.au/wp-content/uploads/2022/02/20964-scaled-1.png"
              alt="VGP printing solutions hero artwork"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        <section className="mt-10 bg-slate-50 rounded-3xl px-6 sm:px-10 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
                <span>Large Format Print </span>
                <span className="text-yellow-500">Division</span>
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Specifically geared towards small to medium businesses, we can easily cater for
                specialised print runs or low minimum quantities.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We can print on just about anything. Our production team is responsible for applying
                incredible designs to all sorts of materials every day – from paper prints through to
                glass, acrylic, aluminium composite board, corflute, foamboard, timber and much more.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Flexible materials such as banner vinyl or mesh are printed on our large format solvent
                printers and are suitable for exterior use. They can be finished with ropes and eyelets or
                sail-track frames for building and hoarding display, or eyelets for property fencing. These
                low-cost options are popular for short-term promotions and signage and are easily
                transported, stored and re-used.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://vancegraphix.com.au/wp-content/uploads/2020/01/16278-scaled.jpg"
                alt="Large format printing and signage at VGP"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mt-16 bg-white rounded-3xl px-6 sm:px-10 py-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://vancegraphix.com.au/wp-content/uploads/2020/01/23592-scaled.jpg"
                alt="Digital printing section with marketing materials"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
                <span>Digital Print </span>
                <span className="text-yellow-500">Section</span>
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                The digital print department is perfect for proposals, flyers, menus, brochures,
                newsletters and letters, with the added flexibility of variable data. Letters and vouchers
                can be uniquely numbered or personalised in any combination, making it easier to track and
                pinpoint your marketing.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Providing an on-demand print service, Vance Graphix &amp; Print can store your data and
                print to your requirements within short time frames and for specific targets, eliminating
                waste and mass generic mail outs.
              </p>
              <p className="text-gray-600 leading-relaxed">
                High quality finishing options are also available for your small run printing such as matt
                and gloss celloglaze, scoring and folding and custom shapes and sizes.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16 mb-8">
          <div className="rounded-3xl bg-slate-50 px-6 sm:px-10 py-10 flex justify-center">
            <img
              src="https://vancegraphix.com.au/wp-content/uploads/2023/08/Design-Process_2023-02-1536x433.png"
              alt="Overview of VGP print and design capabilities"
              className="w-full max-w-4xl object-contain"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Printing;

