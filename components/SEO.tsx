import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    image?: string;
    type?: 'website' | 'article';
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
    noindex?: boolean;
    structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    canonical,
    image = 'https://vancegraphix.com.au/wp-content/uploads/2021/02/logo-vgp.png',
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    tags,
    noindex = false,
    structuredData
}) => {
    const fullTitle = title.includes('Vance Graphix & Print') ? title : `${title} | Vance Graphix & Print (VGP)`;
    const siteUrl = 'https://vancegraphix.com.au';
    const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
    const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

    // Default structured data for Organization
    const defaultStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Vance Graphix & Print (VGP)',
        url: siteUrl,
        logo: 'https://vancegraphix.com.au/wp-content/uploads/2021/02/logo-vgp.png',
        description: 'Graphic design, web development, printing, e-commerce, and email marketing in Australia',
        sameAs: [
            // Add social media links here when available
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            email: 'ahmed@vancegraphix.com.au'
        }
    };

    const structuredDataToRender = structuredData || defaultStructuredData;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {canonical && <link rel="canonical" href={fullCanonical} />}
            {noindex && <meta name="robots" content="noindex, nofollow" />}
            {!noindex && <meta name="robots" content="index, follow" />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:site_name" content="Vance Graphix &amp; Print (VGP)" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullCanonical} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImage} />

            {/* Article specific meta tags */}
            {type === 'article' && (
                <>
                    {publishedTime && <meta property="article:published_time" content={publishedTime} />}
                    {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
                    {author && <meta property="article:author" content={author} />}
                    {tags && tags.map((tag, index) => (
                        <meta key={index} property="article:tag" content={tag} />
                    ))}
                </>
            )}

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify(structuredDataToRender)}
            </script>
        </Helmet>
    );
};

export default SEO;


