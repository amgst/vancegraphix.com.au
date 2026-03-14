const ABSOLUTE_OR_SPECIAL_URL = /^(?:https?:)?\/\//i;

export const WEB_PORTFOLIO_IMAGE_FOLDER = '/web-portfolio/';
export const WEB_PORTFOLIO_IMAGE_PLACEHOLDER = '/products/coding-development.jpg';

export const getWebPortfolioImageUrl = (value?: string | null): string => {
  if (!value) return '';

  const trimmed = value.trim();
  if (!trimmed) return '';

  if (
    ABSOLUTE_OR_SPECIAL_URL.test(trimmed) ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  return `${WEB_PORTFOLIO_IMAGE_FOLDER}${trimmed.replace(/^\/+/, '')}`;
};

export const normalizeWebPortfolioImage = (value?: string | null): string => {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  if (!trimmed) return '';

  if (
    ABSOLUTE_OR_SPECIAL_URL.test(trimmed) ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  const withoutLeadingSlash = trimmed.replace(/^\/+/, '');
  const normalizedPath = withoutLeadingSlash.toLowerCase();
  if (
    normalizedPath.startsWith('web portfolio/') ||
    normalizedPath.startsWith('web-portfolio/')
  ) {
    return `/${withoutLeadingSlash}`;
  }

  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  return `${WEB_PORTFOLIO_IMAGE_FOLDER}${withoutLeadingSlash}`;
};
