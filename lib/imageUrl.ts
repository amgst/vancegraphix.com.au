const ABSOLUTE_OR_SPECIAL_URL = /^(?:https?:)?\/\//i;

const GITHUB_IMAGE_BASE_URL = (import.meta.env.VITE_GITHUB_IMAGE_BASE_URL || '').trim();
const LOCAL_IMAGE_PREFIX = (import.meta.env.VITE_IMAGE_FILENAME_PREFIX || '/products/').trim();

export const resolveImageUrl = (value?: string | null): string => {
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

  if (!GITHUB_IMAGE_BASE_URL) {
    const cleanPrefix = LOCAL_IMAGE_PREFIX
      ? (LOCAL_IMAGE_PREFIX.startsWith('/') ? LOCAL_IMAGE_PREFIX : `/${LOCAL_IMAGE_PREFIX}`).replace(/\/?$/, '/')
      : '/';
    return `${cleanPrefix}${trimmed.replace(/^\/+/, '')}`;
  }

  const base = GITHUB_IMAGE_BASE_URL.endsWith('/')
    ? GITHUB_IMAGE_BASE_URL
    : `${GITHUB_IMAGE_BASE_URL}/`;

  return `${base}${trimmed.replace(/^\/+/, '')}`;
};
