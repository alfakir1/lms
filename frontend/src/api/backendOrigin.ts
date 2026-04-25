function stripTrailingSlash(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export function getBackendOrigin() {
  const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';
  const base = stripTrailingSlash(apiBase);

  // If VITE_API_URL includes /api/vX, drop it to get the backend origin.
  const withoutApi = base.replace(/\/api\/v\d+$/i, '');
  return withoutApi;
}

