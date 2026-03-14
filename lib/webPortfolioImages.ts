import type { PortfolioItem } from './portfolioService';
import { getWebPortfolioImageUrl } from './webPortfolioImage';

const GOOGLE_DRIVE_URL_PATTERN = /(?:drive\.google\.com|googleusercontent\.com|googleapis\.com)/i;

const LOCAL_WEB_PORTFOLIO_IMAGES: Record<PortfolioItem['category'], string[]> = {
  Shopify: [
    '/shopify.png',
    '/images/blog/future-web-design.png',
    '/products/coding-development.jpg',
    '/products/team-collaboration.jpg'
  ],
  React: [
    '/images/blog/react-19.png',
    '/images/blog/future-web-design.png',
    '/products/coding-development.jpg',
    '/products/team-collaboration.jpg'
  ],
  WordPress: [
    '/products/wp.jpg',
    '/products/team-collaboration.jpg',
    '/products/coding-development.jpg',
    '/images/blog/future-web-design.png'
  ],
  Other: [
    '/products/coding-development.jpg',
    '/products/team-collaboration.jpg',
    '/images/blog/future-web-design.png',
    '/images/blog/react-19.png'
  ]
};

const isGoogleDriveUrl = (value?: string | null) =>
  Boolean(value && GOOGLE_DRIVE_URL_PATTERN.test(value));

export const getLocalPortfolioImagesByCategory = (
  category: PortfolioItem['category'],
  limit?: number
): string[] => {
  const images = LOCAL_WEB_PORTFOLIO_IMAGES[category] || LOCAL_WEB_PORTFOLIO_IMAGES.Other;
  return typeof limit === 'number' ? images.slice(0, limit) : images;
};

export const getPreferredPortfolioImage = (
  item: Pick<PortfolioItem, 'category' | 'imageUrl'>,
  index = 0
): string => {
  if (!isGoogleDriveUrl(item.imageUrl)) {
    return getWebPortfolioImageUrl(item.imageUrl);
  }

  const localImages = getLocalPortfolioImagesByCategory(item.category);
  if (localImages.length === 0) {
    return '';
  }

  return localImages[index % localImages.length];
};
