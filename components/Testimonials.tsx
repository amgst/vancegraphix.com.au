import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: "Sarah Jenkins",
        role: "Founder",
        company: "EcoStyle Boutique",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80",
        content: "wbify transformed our Shopify store. Sales increased by 40% in the first month after the redesign. The team was professional, fast, and understood our brand perfectly.",
        rating: 5
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "CTO",
        company: "TechFlow Solutions",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80",
        content: "We needed a complex custom web app for our internal operations. wbify delivered a robust, scalable solution that exceeded our expectations. Highly recommended for custom dev work.",
        rating: 5
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        role: "Marketing Director",
        company: "Fresh Eats",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80",
        content: "The branding package we received was incredible. They captured our vision perfectly and gave us a visual identity that stands out in a crowded market.",
        rating: 5
    }
];

const Testimonials: React.FC = () => {
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Trusted by Founders & CTOs</h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Don't just take our word for it. Here's what our partners have to say about working with wbify.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 relative">
                            <Quote className="absolute top-8 right-8 text-blue-100" size={48} />

                            <div className="flex items-center gap-1 mb-6">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            <p className="text-gray-600 mb-8 leading-relaxed relative z-10">
                                "{testimonial.content}"
                            </p>

                            <div>
                                <div className="font-bold text-slate-900">{testimonial.name}</div>
                                <div className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
