// api/google-reviews.ts - v3
// Vercel serverless function - proxies Google Places API so the key is never exposed to the browser.

const DEFAULT_PLACE_ID = 'ChIJmUOqMVeamWsRX0ZjXdptY18'; // old cached ID
const DEFAULT_PLACE_QUERY = 'Vance Graphix & Print Brisbane QLD';

function detailsUrl(placeId: string, apiKey: string) {
    return (
        `https://maps.googleapis.com/maps/api/place/details/json` +
        `?place_id=${encodeURIComponent(placeId)}` +
        `&fields=name,rating,user_ratings_total,reviews` +
        `&reviews_sort=newest` +
        `&key=${apiKey}`
    );
}

async function fetchPlaceDetails(placeId: string, apiKey: string) {
    const response = await fetch(detailsUrl(placeId, apiKey));
    if (!response.ok) {
        throw new Error(`Google API responded with status ${response.status}`);
    }
    return response.json();
}

async function resolvePlaceIdByText(query: string, apiKey: string) {
    const url =
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json` +
        `?input=${encodeURIComponent(query)}` +
        `&inputtype=textquery` +
        `&fields=place_id,name` +
        `&key=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Google Find Place API responded with status ${response.status}`);
    }

    const data = await response.json();
    if (data.status !== 'OK' || !Array.isArray(data.candidates) || data.candidates.length === 0) {
        throw new Error(`Find Place API error: ${data.status} - ${data.error_message || 'No candidates found'}`);
    }

    return data.candidates[0].place_id as string;
}

export default async function handler(req: any, res: any) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.VITE_GOOGLE_PLACES_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        return res.status(500).json({ message: 'Google Places API key not configured' });
    }

    try {
        const configuredPlaceId = process.env.GOOGLE_PLACE_ID || process.env.VITE_GOOGLE_PLACE_ID || DEFAULT_PLACE_ID;
        const placeQuery = process.env.GOOGLE_PLACE_QUERY || process.env.VITE_GOOGLE_PLACE_QUERY || DEFAULT_PLACE_QUERY;

        let resolvedPlaceId = configuredPlaceId;
        let data = await fetchPlaceDetails(resolvedPlaceId, apiKey);

        if (data.status === 'NOT_FOUND') {
            resolvedPlaceId = await resolvePlaceIdByText(placeQuery, apiKey);
            data = await fetchPlaceDetails(resolvedPlaceId, apiKey);
        }

        if (data.status !== 'OK') {
            throw new Error(`Google Places API error: ${data.status} - ${data.error_message || ''}`);
        }

        const { name, rating, user_ratings_total, reviews } = data.result;

        res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate');

        return res.status(200).json({
            name,
            rating,
            totalReviews: user_ratings_total,
            placeId: resolvedPlaceId,
            reviews: (reviews || []).map((r: any) => ({
                author_name: r.author_name,
                author_url: r.author_url,
                profile_photo_url: r.profile_photo_url,
                rating: r.rating,
                relative_time_description: r.relative_time_description,
                text: r.text,
                time: r.time,
            })),
        });
    } catch (error: any) {
        console.error('Google Reviews API error:', error.message);
        return res.status(500).json({ message: error.message });
    }
}
