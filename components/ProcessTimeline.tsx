import React from 'react';
import { Search, PenTool, Code, Rocket } from 'lucide-react';

const steps = [
    {
        id: 1,
        title: 'Discovery',
        description: 'We start by understanding your business, goals, and target audience. We research your competitors and define the project scope.',
        icon: Search,
    },
    {
        id: 2,
        title: 'Design',
        description: 'Our designers create wireframes and high-fidelity mockups. We focus on user experience (UX) and beautiful, on-brand visuals.',
        icon: PenTool,
    },
    {
        id: 3,
        title: 'Build',
        description: 'We turn designs into reality using clean, modern code. We build on Shopify or custom stacks, ensuring speed, security, and responsiveness.',
        icon: Code,
    },
    {
        id: 4,
        title: 'Launch',
        description: 'After rigorous testing, we go live! We handle the deployment, domain setup, and ensure everything runs smoothly from day one.',
        icon: Rocket,
    },
];

const ProcessTimeline: React.FC = () => {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">How We Work</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Our Process</h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        A simple, transparent journey from idea to launch.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <div key={step.id} className="relative group">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 text-center h-full">
                                    <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative">
                                        <step.icon className="text-blue-600" size={32} />
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-white">
                                            {step.id}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProcessTimeline;
