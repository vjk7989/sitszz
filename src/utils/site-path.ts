const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Build a GitHub Pages base-path-aware link for the English-only site. */
export function sitePath(path = '/'): string {
  if (path.startsWith('#') || /^[a-z]+:/i.test(path)) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
}
