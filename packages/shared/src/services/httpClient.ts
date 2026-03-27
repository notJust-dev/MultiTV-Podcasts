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
    options?: {body?: unknown; query?: Record<string, unknown>},
  ): Promise<HttpResponse<T>> {
    let url = this.buildUrl(path);
    if (options?.query) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(options.query)) {
        params.append(key, String(value));
      }
      url += `?${params.toString()}`;
    }

    const fetchOptions: RequestInit = {method};

    if (options?.body) {
      fetchOptions.headers = {
        'Content-Type': 'application/json',
        ...this.defaultHeaders,
      };
      fetchOptions.body = JSON.stringify(options.body);
    } else if (Object.keys(this.defaultHeaders).length > 0) {
      fetchOptions.headers = this.defaultHeaders;
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
  ): Promise<HttpResponse<T>> {
    return this.request<T>('GET', path, {query});
  }

  async post<T = unknown>(
    path: string,
    body?: unknown,
  ): Promise<HttpResponse<T>> {
    return this.request<T>('POST', path, {body});
  }

  async put<T = unknown>(
    path: string,
    body?: unknown,
  ): Promise<HttpResponse<T>> {
    return this.request<T>('PUT', path, {body});
  }

  async patch<T = unknown>(
    path: string,
    body?: unknown,
  ): Promise<HttpResponse<T>> {
    return this.request<T>('PATCH', path, {body});
  }

  async delete<T = unknown>(path: string): Promise<HttpResponse<T>> {
    return this.request<T>('DELETE', path);
  }
}

/**
 * Create a pre-configured HTTP client instance
 */
export function createHttpClient(config?: HttpClientConfig): HttpClient {
  return new HttpClient(config);
}
