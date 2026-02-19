/**
 * Service to interact with Google PageSpeed Insights API
 */

export interface PageSpeedMetrics {
    performance: number;
    seo: number;
    accessibility: number;
    bestPractices: number;
}

/**
 * Fetches PageSpeed Insights metrics for a given URL.
 * Note: In a production environment, you should use an API key.
 * For this demo/utility, we'll use the public endpoint if possible or a mock.
 */
export const fetchPageSpeedMetrics = async (url: string): Promise<PageSpeedMetrics> => {
    try {
        // Construct the PSI API URL (using the public endpoint)
        // Note: For heavy use, an API key should be added to the query params
        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY&category=BEST_PRACTICES&strategy=mobile`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`PSI API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        const categories = data.lighthouseResult.categories;
        
        return {
            performance: Math.round(categories.performance.score * 100),
            seo: Math.round(categories.seo.score * 100),
            accessibility: Math.round(categories.accessibility.score * 100),
            bestPractices: Math.round(categories['best-practices'].score * 100)
        };
    } catch (error) {
        console.error("Error fetching PageSpeed metrics:", error);
        throw error;
    }
};
