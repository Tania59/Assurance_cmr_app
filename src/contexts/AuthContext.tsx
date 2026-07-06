import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react';
import { api, type ApiResult } from '../lib/api';
import { queryClient } from '../lib/queryClient';

// ── Types ─────────────────────────────────────────────────────────────────────

export type UserRole = 'PRODUCTEUR' | 'COMMERCIAL' | 'PROMOTEUR' | 'MANAGER' | 'ADMIN';

export interface AuthUser {
  id:    string;
  nom:   string;
  email: string;
  role:  UserRole;
}

interface AuthState {
  user:    AuthUser | null;
  token:   string | null;
  loading: boolean;
}

type AuthAction =
  | { type: 'RESTORE'; payload: { user: AuthUser; token: string } | null }
  | { type: 'LOGIN';   payload: { user: AuthUser; token: string } }
  | { type: 'LOGOUT' };

// ── Reducer ───────────────────────────────────────────────────────────────────

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'RESTORE':
      return {
        loading: false,
        user:    action.payload?.user  ?? null,
        token:   action.payload?.token ?? null,
      };
    case 'LOGIN':
      return { loading: false, ...action.payload };
    case 'LOGOUT':
      return { loading: false, user: null, token: null };
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface AuthContextValue extends AuthState {
  login:  (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user:    null,
    token:   null,
    loading: true,
  });

  // Restaure la session depuis localStorage au démarrage
  useEffect(() => {
    const token = api.getToken();

    if (!token) {
      dispatch({ type: 'RESTORE', payload: null });
      return;
    }

    api.get<ApiResult<AuthUser>>('/auth/me')
      .then(res => {
        dispatch({ type: 'RESTORE', payload: { user: res.data, token } });
      })
      .catch(() => {
        api.setToken(null);
        dispatch({ type: 'RESTORE', payload: null });
      });
  }, []);

  // Écoute l'expiration de token (401 émis par le client API)
  useEffect(() => {
    const handle = () => dispatch({ type: 'LOGOUT' });
    window.addEventListener('auth:expired', handle);
    return () => window.removeEventListener('auth:expired', handle);
  }, []);

  async function login(email: string, password: string): Promise<void> {
    // Le backend retourne { token: "..." } directement, sans wrapper ApiResult
    const { token } = await api.post<{ token: string }>('/auth/login', { email, password });

    api.setToken(token);

    const userRes = await api.get<ApiResult<AuthUser>>('/auth/me');
    dispatch({ type: 'LOGIN', payload: { user: userRes.data, token } });
  }

  async function logout(): Promise<void> {
    // Tente de révoquer le token côté serveur (ne bloque pas si ça échoue)
    try { await api.post('/auth/logout'); } catch { /* intentionnel */ }

    api.setToken(null);
    queryClient.clear(); // Vide tout le cache React Query
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>');
  return ctx;
}

/** Helper : vérifie si l'utilisateur a un rôle parmi une liste */
export function useHasRole(...roles: UserRole[]): boolean {
  const { user } = useAuth();
  return user !== null && roles.includes(user.role);
}
