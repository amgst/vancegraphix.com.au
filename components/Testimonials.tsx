import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: "Australian Sikh Association ASA",
        role: "Community Organisation",
        company: "Sydney",
        image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=128&q=80",
        content: "I would like to commend Vance Graphix & Print for their exceptional competence and reliability. They produced excellent quality printing, social media service and web development.",
        rating: 5
    },
    {
        id: 2,
        name: "Anytime Body Beyond",
        role: "Business Owner",
        company: "Australia",
        image: "https://images.unsplash.com/photo-1544723795-432537cae302?auto=format&fit=crop&w=128&q=80",
        content: "I was very happy with my print and web project, the team did this job very well. They were professional and focused to make sure everything was as per brief.",
        rating: 5
    },
    {
        id: 3,
        name: "Aircon & Carpentry",
        role: "Business Owner",
        company: "Australia",
        image: "https://images.unsplash.com/photo-1544723795-3fb0b90c07c7?auto=format&fit=crop&w=128&q=80",
        content: "Really friendly, great team and excellent service. I highly recommend Vance Graphix & Print printing solutions and website development.",
        rating: 5
    }
];

const Testimonials: React.FC = () => {
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Trusted by Australian Businesses</h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Don't just take our word for it. Here's what our clients say about working with Vance Graphix &amp; Print (VGP).
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
