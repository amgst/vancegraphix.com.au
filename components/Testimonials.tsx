import React from 'react';
import { Star, Quote } from 'lucide-react';
import { getTestimonials, Testimonial } from '../lib/testimonialsService';

const Testimonials: React.FC = () => {
    const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        getTestimonials()
            .then(data => setTestimonials(data))
            .catch(err => console.error('Failed to load testimonials:', err))
            .finally(() => setIsLoading(false));
    }, []);

    // Don't render the section at all if there's nothing to show
    if (!isLoading && testimonials.length === 0) return null;

    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Trusted by Australian Businesses</h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Don't just take our word for it. Here's what our clients say about working with Vance Graphix &amp; Print (VGP).
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm animate-pulse">
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, j) => (
                                        <div key={j} className="w-4 h-4 bg-gray-200 rounded-full" />
                                    ))}
                                </div>
                                <div className="space-y-2 mb-8">
                                    <div className="h-3 bg-gray-200 rounded w-full" />
                                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                                    <div className="h-3 bg-gray-200 rounded w-4/6" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                    <div className="space-y-1">
                                        <div className="h-3 bg-gray-200 rounded w-24" />
                                        <div className="h-2 bg-gray-100 rounded w-16" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 relative">
                                <Quote className="absolute top-8 right-8 text-blue-100" size={48} />

                                <div className="flex items-center gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            className={i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}
                                        />
                                    ))}
                                </div>

                                <p className="text-gray-600 mb-8 leading-relaxed relative z-10">
                                    "{testimonial.content}"
                                </p>

                                <div className="flex items-center gap-3">
                                    {testimonial.image ? (
                                        <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-bold text-slate-900">{testimonial.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Testimonials;
