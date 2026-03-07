const ABSOLUTE_OR_SPECIAL_URL = /^(?:https?:)?\/\//i;

export const READY_SITE_IMAGE_FOLDER = '/ready sites/';
export const READY_SITE_IMAGE_PLACEHOLDER = '/template_cars.png';

export const getReadySiteImageUrl = (value?: string | null): string => {
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

  return `${READY_SITE_IMAGE_FOLDER}${trimmed.replace(/^\/+/, '')}`;
};

export const normalizeReadySiteImage = (value?: string | null): string => {
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
  if (withoutLeadingSlash.toLowerCase().startsWith('ready sites/')) {
    return `/${withoutLeadingSlash}`;
  }

  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  return `${READY_SITE_IMAGE_FOLDER}${withoutLeadingSlash}`;
};
