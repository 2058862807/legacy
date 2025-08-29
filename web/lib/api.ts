// Backend API base URL
export const API_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8000';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

// Main API fetch function with error handling
export async function apiFetch<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      return {
        error: data?.message || data || `HTTP ${response.status}`,
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
}

// Legacy compatibility - matches the old API structure
type Opts = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  cache?: RequestCache;
};

export async function apiFetchLegacy<T = any>(path: string, opts: Opts = {}): Promise<T> {
  const init: RequestInit = {
    method: opts.method || "GET",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    cache: opts.cache || "no-store"
  };
  
  if (opts.body !== undefined) {
    init.body = typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body);
  }
  
  const res = await fetch(`${API_BASE}${path}`, init);
  
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
  }
  
  return res.json() as Promise<T>;
}

export default apiFetch;