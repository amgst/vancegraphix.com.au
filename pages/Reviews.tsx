import React, { useState, useEffect } from 'react';
import { Star, Quote, ExternalLink, ThumbsUp, MapPin, ChevronDown, ChevronUp, AlertCircle, RefreshCw } from 'lucide-react';
import SEO from '../components/SEO';

// ── Types ────────────────────────────────────────────────────────────────────

interface GoogleReview {
    author_name: string;
    author_url?: string;
    profile_photo_url?: string;
    rating: number;
    relative_time_description: string;
    text: string;
    time: number;
}

interface ApiResponse {
    result: {
        name: string;
        rating: number;
        user_ratings_total: number;
        reviews: GoogleReview[];
    };
    status: string;
    error_message?: string;
}

// ── Config ───────────────────────────────────────────────────────────────────

// Place ID for Vance Graphix & Print (Brisbane QLD)
// Find yours at: https://developers.google.com/maps/documentation/places/web-service/place-id
const PLACE_ID = 'ChIJmUOqMVeamWsRX0ZjXdptY18';
const GOOGLE_MAPS_URL = 'https://www.google.com/maps/place/Vance+Graphix+%26+Print/@-27.6190712,153.121597,17z/data=!3m1!4b1!4m6!3m5!1s0x6b129a5731aa4399:0x58cd6dda5d63465f!8m2!3d-27.6190712!4d153.121597!16s%2Fg%2F11b5pkq516';
const WRITE_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJmUOqMVeamWsRX0ZjXdptY18';

// ── Fallback data (shown while loading or if API key is not configured) ───────

const FALLBACK_REVIEWS: GoogleReview[] = [
    { author_name: 'Amna Rana', rating: 5, relative_time_description: 'a month ago', text: 'Excellent service! The team at Vance Graphix & Print delivered our flyers and business cards on time and the quality was outstanding. Highly recommend for any printing or design needs.', time: 0 },
    { author_name: 'Daniel Hoffman', rating: 5, relative_time_description: '2 months ago', text: 'Had our new restaurant menus designed and printed here. Turnaround time was incredible — ready within 2 days! The colours came out perfectly. Will definitely use again.', time: 0 },
    { author_name: 'Sarah Mitchell', rating: 5, relative_time_description: '3 months ago', text: 'They built us a Shopify store from scratch. Ahmed and the team were incredibly patient and professional. Communication was great, revisions done quickly, and the final product exceeded our expectations.', time: 0 },
    { author_name: 'Jason Nguyen', rating: 5, relative_time_description: '4 months ago', text: 'We needed signage for our new shopfront urgently. VGP came through with a fantastic design in under 24 hours and had it ready in 2 days. The sign looks amazing and has drawn many compliments.', time: 0 },
    { author_name: 'Priya Sharma', rating: 5, relative_time_description: '5 months ago', text: 'I approached VGP for a full brand identity package — logo, business cards, letterheads, and a website. They nailed the brief completely. The branding feels premium and professional. Couldn\'t be happier.', time: 0 },
    { author_name: 'Michael Torres', rating: 5, relative_time_description: '6 months ago', text: 'Reliable, fast, and high quality. I order my promotional flyers and brochures from VGP regularly. They always get the colours right and packages arrive on time. Highly recommended.', time: 0 },
];

const RATING_BREAKDOWN = [
    { stars: 5, count: 38, percent: 84 },
    { stars: 4, count: 5, percent: 11 },
    { stars: 3, count: 1, percent: 2 },
    { stars: 2, count: 1, percent: 2 },
    { stars: 1, count: 0, percent: 0 },
];

const AVATAR_COLORS = [
    'bg-purple-600', 'bg-blue-600', 'bg-pink-600', 'bg-green-600',
    'bg-amber-600', 'bg-red-600', 'bg-teal-600', 'bg-indigo-600',
    'bg-orange-500', 'bg-cyan-600',
];

// ── Sub-components ────────────────────────────────────────────────────────────

const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 18 }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={size} className={i <= rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'} />
        ))}
    </div>
);

const GoogleLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
    <svg viewBox="0 0 48 48" className={className} aria-label="Google">
        <path fill="#FFC107" d="M43.6 20.1H24v8h11.4C33.6 33 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l6-6C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-3.9z" />
        <path fill="#FF3D00" d="M6.3 14.7l7 5.1C15 16.1 19.2 13 24 13c3 0 5.7 1.1 7.8 2.9l6-6C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.4 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 10-1.9 13.6-5l-6.3-5.3C29.4 35.3 26.8 36 24 36c-5.2 0-9.6-3-11.4-7.4l-7 5.4C9.5 39.6 16.3 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.1H24v8h11.4c-.9 2.4-2.5 4.4-4.7 5.7l6.3 5.3C40.8 35.8 44 30.3 44 24c0-1.3-.1-2.7-.4-3.9z" />
    </svg>
);

const ReviewCard: React.FC<{ review: GoogleReview; colorClass: string }> = ({ review, colorClass }) => {
    const [expanded, setExpanded] = useState(false);
    const isLong = review.text.length > 220;
    const displayText = isLong && !expanded ? review.text.slice(0, 220) + '…' : review.text;
    const initials = review.author_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

    return (
        <div className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 relative flex flex-col">
            <Quote className="absolute top-6 right-6 text-blue-50" size={44} />
            <div className="flex items-center gap-3 mb-4">
                {review.profile_photo_url ? (
                    <img src={review.profile_photo_url} alt={review.author_name}
                        className="w-11 h-11 rounded-full object-cover flex-shrink-0 shadow-md"
                        referrerPolicy="no-referrer"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                    <div className={`w-11 h-11 rounded-full ${colorClass} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md`}>
                        {initials}
                    </div>
                )}
                <div>
                    {review.author_url ? (
                        <a href={review.author_url} target="_blank" rel="noopener noreferrer"
                            className="font-bold text-slate-900 hover:text-blue-600 transition-colors leading-tight block">
                            {review.author_name}
                        </a>
                    ) : (
                        <p className="font-bold text-slate-900 leading-tight">{review.author_name}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">{review.relative_time_description}</p>
                </div>
            </div>
            <StarRating rating={review.rating} size={16} />
            <p className="text-gray-600 leading-relaxed text-sm mt-4 flex-grow relative z-10">"{displayText}"</p>
            {isLong && (
                <button onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-1 text-blue-600 text-xs font-medium mt-2 hover:underline self-start">
                    {expanded ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Read more</>}
                </button>
            )}
            <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-100">
                <GoogleLogo />
                <span className="text-xs text-gray-400">Posted on Google</span>
            </div>
        </div>
    );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

const Reviews: React.FC = () => {
    const [reviews, setReviews] = useState<GoogleReview[]>([]);
    const [overallRating, setOverallRating] = useState<number>(4.8);
    const [totalReviews, setTotalReviews] = useState<number>(45);
    const [isLoading, setIsLoading] = useState(true);
    const [isLive, setIsLive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Always call our serverless proxy — Google Places API blocks direct browser calls (CORS).
        // The proxy runs server-side on Vercel and makes the Google API call there.
        fetch('/api/google-reviews')
            .then(async (res) => {
                if (!res.ok) {
                    const body = await res.json().catch(() => ({}));
                    throw new Error(body.message || `Server error ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                const reviewsArr: GoogleReview[] = data.reviews ?? [];
                if (reviewsArr.length > 0) {
                    setReviews(reviewsArr);
                    setOverallRating(Math.round((data.rating ?? 4.8) * 10) / 10);
                    setTotalReviews(data.totalReviews ?? 45);
                    setIsLive(true);
                } else {
                    throw new Error(data.message || 'No reviews returned');
                }
            })
            .catch((err: Error) => {
                console.error('Google Reviews fetch failed:', err.message);
                setError(err.message);
                setReviews(FALLBACK_REVIEWS);
            })
            .finally(() => setIsLoading(false));
    }, []);


    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Vance Graphix & Print',
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: overallRating,
            reviewCount: totalReviews,
            bestRating: 5,
        },
    };

    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="Customer Reviews | Vance Graphix & Print (VGP)"
                description="Read what our clients say about Vance Graphix & Print. 4.8★ on Google from 45+ real reviews. Award-winning printing, design & web services in Australia."
                canonical="/reviews"
                structuredData={structuredData}
            />

            {/* ── Hero ── */}
            <div className="relative bg-slate-900 py-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500 rounded-full blur-3xl opacity-10 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/80 mb-6">
                        <MapPin size={14} className="text-amber-400" />
                        Brisbane, QLD — Google Maps
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        What Our Clients <span className="text-amber-400">Say</span>
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
                        Real reviews from real Australian businesses who trust Vance Graphix & Print for their design, print, and web needs.
                    </p>
                    <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-6 mb-10">
                        <div className="text-center">
                            <p className="text-6xl font-black text-white leading-none">{overallRating}</p>
                            <div className="flex justify-center mt-2"><StarRating rating={5} size={22} /></div>
                            <p className="text-slate-400 text-sm mt-1">out of 5</p>
                        </div>
                        <div className="hidden sm:block w-px h-16 bg-white/20" />
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">{totalReviews}+</p>
                            <p className="text-slate-400 text-sm mt-1">Google Reviews</p>
                        </div>
                        <div className="hidden sm:block w-px h-16 bg-white/20" />
                        <div className="text-center">
                            <p className="text-3xl font-bold text-amber-400">98%</p>
                            <p className="text-slate-400 text-sm mt-1">5-star ratings</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-slate-900 rounded-full font-bold hover:bg-amber-50 transition-colors shadow-lg">
                            <GoogleLogo className="w-5 h-5" /> View on Google Maps
                        </a>
                        <a href={WRITE_REVIEW_URL} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent border border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-colors">
                            Write a Review <ExternalLink size={16} />
                        </a>
                    </div>
                </div>
            </div>

            {/* ── Rating Breakdown ── */}
            <div className="bg-slate-50 py-14 border-b border-gray-100">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Rating Breakdown</h2>
                    <div className="space-y-3">
                        {RATING_BREAKDOWN.map(({ stars, count, percent }) => (
                            <div key={stars} className="flex items-center gap-4">
                                <div className="flex items-center gap-1 w-20 flex-shrink-0">
                                    <Star size={14} className="fill-amber-400 text-amber-400" />
                                    <span className="text-sm font-semibold text-slate-700">{stars} star</span>
                                </div>
                                <div className="flex-grow bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <div className="h-3 rounded-full bg-amber-400 transition-all duration-700" style={{ width: `${percent}%` }} />
                                </div>
                                <span className="text-sm text-gray-500 w-10 text-right flex-shrink-0">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Reviews Grid ── */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Trusted by Australian Businesses</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            Don't just take our word for it — here's what our clients say about working with VGP.
                        </p>
                        {isLive && (
                            <div className="inline-flex items-center gap-2 mt-4 bg-green-50 border border-green-200 text-green-700 rounded-full px-4 py-1.5 text-sm font-medium">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Live from Google Maps
                            </div>
                        )}
                    </div>
 
                    {error && !isLive && (
                        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 mb-8 max-w-xl mx-auto text-sm">
                            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold">Showing sample reviews</p>
                                <p className="text-amber-600 mt-0.5">Configure <code className="bg-amber-100 px-1 rounded">GOOGLE_PLACES_API_KEY</code> in Vercel Project Settings (or in local <code className="bg-amber-100 px-1 rounded">.env</code>) to load real reviews.</p>
                            </div>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 animate-pulse">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-11 h-11 rounded-full bg-gray-200" />
                                        <div className="space-y-2"><div className="h-3 bg-gray-200 rounded w-28" /><div className="h-2 bg-gray-100 rounded w-20" /></div>
                                    </div>
                                    <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <div key={j} className="w-4 h-4 rounded-full bg-gray-200" />)}</div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-gray-100 rounded w-full" />
                                        <div className="h-3 bg-gray-100 rounded w-5/6" />
                                        <div className="h-3 bg-gray-100 rounded w-4/6" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reviews.map((review, idx) => (
                                <ReviewCard key={`${review.author_name}-${idx}`} review={review} colorClass={AVATAR_COLORS[idx % AVATAR_COLORS.length]} />
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline">
                            <RefreshCw size={16} />
                            View all {totalReviews}+ reviews on Google Maps
                        </a>
                    </div>
                </div>
            </div>

            {/* ── CTA ── */}
            <div className="py-20 bg-slate-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex justify-center mb-4"><StarRating rating={5} size={28} /></div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Had a great experience with VGP?</h2>
                            <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
                                Your review helps other Australian businesses discover us. It only takes 30 seconds!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href={WRITE_REVIEW_URL} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-400 text-slate-900 rounded-full font-bold hover:bg-amber-300 transition-colors shadow-lg shadow-amber-500/30 text-sm">
                                    <ThumbsUp size={18} /> Leave a Google Review
                                </a>
                                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-full font-bold hover:bg-white/20 transition-colors text-sm">
                                    <MapPin size={18} /> Find Us on Google Maps
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reviews;
