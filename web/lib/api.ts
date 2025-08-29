// Backend API base URL
const API = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8000';

// Main API fetch function
export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`API ${response.status} ${response.statusText}: ${text}`);
  }

  return response.json() as Promise<T>;
}

// Legacy compatibility exports
export const API_BASE = API;
export default apiFetch;