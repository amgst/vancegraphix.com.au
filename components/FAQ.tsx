import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
    {
        question: "How long does a typical project take?",
        answer: "Timelines vary based on complexity. A standard Shopify store setup takes 3-5 days, while a custom web application can take 4-8 weeks. We provide a detailed timeline during our initial consultation."
    },
    {
        question: "Do you offer ongoing support?",
        answer: "Yes! We offer 30 days of free support after launch to ensure everything runs smoothly. We also have monthly maintenance packages for updates, security, and minor tweaks."
    },
    {
        question: "What is your payment process?",
        answer: "We typically require a 50% deposit to start the project, with the remaining 50% due upon completion and your final approval. For larger projects, we can structure milestone-based payments."
    },
    {
        question: "Can you help with content and copywriting?",
        answer: "Absolutely. We can help draft compelling copy for your website, product descriptions, and ad campaigns. We also have access to high-quality stock photography if you don't have your own images."
    },
    {
        question: "Do I own the code and design?",
        answer: "100%. Once the final payment is made, you have full ownership of all assets, code, and design files. We don't lock you into proprietary platforms."
    }
];

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-xl text-blue-600 mb-4">
                        <HelpCircle size={24} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-xl text-gray-500">
                        Everything you need to know about working with us.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`border rounded-2xl transition-all duration-300 ${openIndex === index
                                    ? 'border-blue-200 bg-blue-50/30 shadow-sm'
                                    : 'border-gray-200 hover:border-blue-100'
                                }`}
                        >
                            <button
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span className={`font-bold text-lg ${openIndex === index ? 'text-blue-700' : 'text-slate-900'}`}>
                                    {faq.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className="text-blue-600 flex-shrink-0 ml-4" />
                                ) : (
                                    <ChevronDown className="text-gray-400 flex-shrink-0 ml-4" />
                                )}
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="p-6 pt-0 text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
