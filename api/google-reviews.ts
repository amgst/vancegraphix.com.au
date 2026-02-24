// api/google-reviews.ts
// Vercel serverless function — proxies Google Places API so the key is never exposed to the browser.

const PLACE_ID = 'ChIJmUOqMVeamWsRX0ZjXdptY18'; // Vance Graphix & Print, Brisbane QLD

export default async function handler(req: any, res: any) {
    // Allow GET only
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        return res.status(500).json({ message: 'Google Places API key not configured' });
    }

    try {
        const url =
            `https://maps.googleapis.com/maps/api/place/details/json` +
            `?place_id=${PLACE_ID}` +
            `&fields=name,rating,user_ratings_total,reviews` +
            `&reviews_sort=newest` +
            `&key=${apiKey}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Google API responded with status ${response.status}`);
        }

        const data = await response.json();

        if (data.status !== 'OK') {
            throw new Error(`Google Places API error: ${data.status} — ${data.error_message || ''}`);
        }

        const { name, rating, user_ratings_total, reviews } = data.result;

        // Cache the response for 6 hours on the CDN edge
        res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate');

        return res.status(200).json({
            name,
            rating,
            totalReviews: user_ratings_total,
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
