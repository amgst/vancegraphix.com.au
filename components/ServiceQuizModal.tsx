import React, { useState } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceQuizModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const questions = [
    {
        id: 1,
        question: "What is your primary goal?",
        options: [
            { label: "Sell products online", value: "shopify" },
            { label: "Build a custom website/app", value: "web" },
            { label: "Create a brand identity", value: "graphics" },
        ]
    },
    {
        id: 2,
        question: "What is your timeline?",
        options: [
            { label: "ASAP (1-2 weeks)", value: "fast" },
            { label: "Flexible (1 month+)", value: "flexible" },
        ]
    },
    {
        id: 3,
        question: "Do you have existing designs?",
        options: [
            { label: "Yes, I have designs", value: "yes" },
            { label: "No, I need design help", value: "no" },
        ]
    }
];

const ServiceQuizModal: React.FC<ServiceQuizModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});

    if (!isOpen) return null;

    const handleAnswer = (value: string) => {
        setAnswers({ ...answers, [step]: value });
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            setStep(questions.length); // Show result
        }
    };

    const getRecommendation = () => {
        const goal = answers[0];
        if (goal === 'shopify') return {
            title: "Shopify E-Commerce Package",
            desc: "Perfect for launching your online store quickly and professionally.",
            link: "/shopify"
        };
        if (goal === 'web') return {
            title: "Custom Web Development",
            desc: "Tailored solutions for unique business needs and web applications.",
            link: "/web-dev"
        };
        return {
            title: "Graphics & Branding Kit",
            desc: "Stand out with a professional logo and visual identity.",
            link: "/graphics"
        };
    };

    const recommendation = step === questions.length ? getRecommendation() : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-slate-900 transition-colors z-10"
                >
                    <X size={24} />
                </button>

                <div className="p-8 md:p-10">
                    {step < questions.length ? (
                        <>
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    {[...Array(questions.length)].map((_, i) => (
                                        <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-blue-600' : 'bg-gray-100'}`}></div>
                                    ))}
                                </div>
                                <span className="text-blue-600 font-bold text-sm tracking-wide uppercase">Step {step + 1} of {questions.length}</span>
                                <h3 className="text-2xl font-bold text-slate-900 mt-2">{questions[step].question}</h3>
                            </div>

                            <div className="space-y-3">
                                {questions[step].options.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleAnswer(option.value)}
                                        className="w-full p-4 text-left border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-slate-700 flex items-center justify-between group"
                                    >
                                        {option.label}
                                        <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 text-blue-600 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                <Check size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">We Recommend:</h3>
                            <h4 className="text-3xl font-bold text-blue-600 mb-4">{recommendation?.title}</h4>
                            <p className="text-gray-500 mb-8">{recommendation?.desc}</p>

                            <div className="flex flex-col gap-3">
                                <Link to={recommendation?.link || '/services'} onClick={onClose}>
                                    <button className="w-full py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-colors shadow-lg">
                                        View Package Details
                                    </button>
                                </Link>
                                <button onClick={onClose} className="text-gray-400 hover:text-slate-900 text-sm font-medium">
                                    Close Quiz
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceQuizModal;
