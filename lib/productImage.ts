export const PRODUCT_IMAGE_PLACEHOLDER =
  `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="100%" height="100%" fill="#f1f5f9"/><rect x="220" y="150" width="360" height="240" rx="20" fill="#e2e8f0"/><circle cx="320" cy="240" r="36" fill="#cbd5e1"/><path d="M260 350l90-95 75 72 55-45 60 68H260z" fill="#94a3b8"/><text x="400" y="470" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#64748b">No Image</text></svg>'
  )}`;

export const getProductImageUrl = (path?: string | null): string => {
  if (!path) return '';

  const trimmed = path.trim();
  if (!trimmed) return '';

  if (
    /^https?:/i.test(trimmed) ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  if (trimmed.startsWith('products/')) {
    return `/${trimmed}`;
  }

  return `/products/${trimmed.replace(/^\/+/, '')}`;
};
