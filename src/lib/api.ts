/**
 * Client API typé — enveloppe fetch avec :
 *  - Injection automatique du token Bearer
 *  - Normalisation des erreurs (ApiError)
 *  - Dispatch 'auth:expired' si 401 → déconnexion propre
 *  - AbortSignal pour annulation (React Query l'utilise automatiquement)
 */

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api/v1';

// ── Types de réponse ──────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

export interface ApiResult<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResult<T> {
  success: boolean;
  data: T[];
  meta: {
    current_page: number;
    per_page:     number;
    total:        number;
    last_page:    number;
    from:         number | null;
    to:           number | null;
  };
}

// ── Client ────────────────────────────────────────────────────────────────────

class ApiClient {
  private token: string | null = null;

  /** Persistance du token entre rechargements de page */
  init(): void {
    this.token = localStorage.getItem('api_token');
  }

  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      localStorage.setItem('api_token', token);
    } else {
      localStorage.removeItem('api_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    signal?: AbortSignal,
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    const res = await fetch(url, {
      method,
      signal,
      headers: {
        'Content-Type':  'application/json',
        'Accept':        'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    // 204 No Content — pas de body
    if (res.status === 204) return undefined as T;

    const json = await res.json().catch(() => ({
      message: `Erreur ${res.status} — réponse invalide du serveur`,
    }));

    if (!res.ok) {
      // Token expiré → force logout global
      if (res.status === 401) {
        this.setToken(null);
        window.dispatchEvent(new Event('auth:expired'));
      }

      const error: ApiError = {
        message: (json as { message?: string }).message ?? `Erreur ${res.status}`,
        errors:  (json as { errors?: Record<string, string[]> }).errors,
        status:  res.status,
      };

      throw error;
    }

    return json as T;
  }

  get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    signal?: AbortSignal,
  ): Promise<T> {
    const qs = params
      ? '?' + new URLSearchParams(
          Object.fromEntries(
            Object.entries(params).map(([k, v]) => [k, String(v)])
          )
        )
      : '';
    return this.request<T>('GET', endpoint + qs, undefined, signal);
  }

  post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', endpoint, body);
  }

  put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', endpoint, body);
  }

  patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>('PATCH', endpoint, body);
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint);
  }
}

export const api = new ApiClient();

// Initialise le token depuis localStorage au chargement du module
api.init();
