export interface HttpClientConfig {
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
  ok: boolean;
}

/**
 * HTTP client wrapper using fetch (React Native compatible)
 */
export class HttpClient {
  private baseUrl: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(config: HttpClientConfig = {}) {
    this.baseUrl = config.baseUrl || '';
    this.timeout = config.timeout || 30000;
    this.defaultHeaders = config.headers || {};
  }

  private buildUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${this.baseUrl}${path}`;
  }

  private async request<T>(
    method: string,
    path: string,
    options?: {
      body?: unknown;
      query?: Record<string, unknown>;
      headers?: Record<string, string>;
    },
  ): Promise<HttpResponse<T>> {
    let url = this.buildUrl(path);
    if (options?.query) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(options.query)) {
        if (value === undefined || value === null) continue;
        params.append(key, String(value));
      }
      const qs = params.toString();
      if (qs) url += `?${qs}`;
    }

    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...(options?.headers ?? {}),
    };

    const fetchOptions: RequestInit = {method};

    if (options?.body !== undefined) {
      headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
      fetchOptions.body = JSON.stringify(options.body);
    }

    if (Object.keys(headers).length > 0) {
      fetchOptions.headers = headers;
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json().catch(() => null);

    return {
      data: data as T,
      status: response.status,
      headers: {},
      ok: response.ok,
    };
  }

  async get<T = unknown>(
    path: string,
    query?: Record<string, unknown>,
    headers?: Record<string, string>,
  ): Promise<HttpResponse<T>> {
    return this.request<T>('GET', path, {query, headers});
  }

  async post<T = unknown>(
    path: string,
    body?: unknown,
    headers?: Record<string, string>,
  ): Promise<HttpResponse<T>> {
    return this.request<T>('POST', path, {body, headers});
  }

  async put<T = unknown>(
    path: string,
    body?: unknown,
    headers?: Record<string, string>,
  ): Promise<HttpResponse<T>> {
    return this.request<T>('PUT', path, {body, headers});
  }

  async patch<T = unknown>(
    path: string,
    body?: unknown,
    headers?: Record<string, string>,
  ): Promise<HttpResponse<T>> {
    return this.request<T>('PATCH', path, {body, headers});
  }

  async delete<T = unknown>(
    path: string,
    headers?: Record<string, string>,
  ): Promise<HttpResponse<T>> {
    return this.request<T>('DELETE', path, {headers});
  }
}

/**
 * Create a pre-configured HTTP client instance
 */
export function createHttpClient(config?: HttpClientConfig): HttpClient {
  return new HttpClient(config);
}
