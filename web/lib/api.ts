const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8000';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${BACKEND_BASE_URL}${endpoint}`;
  
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

export default apiFetch;