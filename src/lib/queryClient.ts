import { QueryClient } from '@tanstack/react-query';
import type { ApiError } from './api';

/**
 * Instance unique de QueryClient — partagée via <QueryClientProvider>.
 *
 * Stratégie de staleTime par type de données :
 *  - Dashboard/analytics : 5 min (données lentes, cachées côté serveur)
 *  - Listes courantes    : 2 min (clients, relances)
 *  - Données de référence: 30 min (périodes, types d'objectifs)
 *
 * La config ci-dessous est le défaut global. Chaque hook peut surcharger.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:  2 * 60 * 1000,   // 2 min — données fraîches sans refetch
      gcTime:     10 * 60 * 1000,  // 10 min — garbage collection du cache mémoire

      // Retry : jamais sur les erreurs client (4xx), 2 fois sur les erreurs serveur (5xx)
      retry: (failureCount, error) => {
        const apiError = error as ApiError;
        if (apiError.status && apiError.status < 500) return false;
        return failureCount < 2;
      },

      // Le CRM est une app métier — pas besoin de refetch en repassant sur l'onglet
      refetchOnWindowFocus: false,
      refetchOnReconnect:   true,  // Mais on refetch si l'agent revient en ligne
    },
    mutations: {
      retry: false, // Jamais de retry sur les mutations — évite les doubles insertions
    },
  },
});

// ── Clés de query centralisées ────────────────────────────────────────────────
// Source of truth pour tous les useQuery — évite les typos et facilite l'invalidation.

export const queryKeys = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  dashboard: {
    index:      (months = 12)  => ['dashboard', 'index', months] as const,
    kpi:        (year: number) => ['dashboard', 'kpi', year] as const,
    classement: (year: number) => ['dashboard', 'classement', year] as const,
    objectives: (year: number) => ['dashboard', 'objectives', year] as const,
  },
  people: {
    list:   (filters?: object) => ['people', 'list', filters] as const,
    detail: (id: string)       => ['people', 'detail', id] as const,
  },
  contracts: {
    list:   (filters?: object) => ['contracts', 'list', filters] as const,
    detail: (id: string)       => ['contracts', 'detail', id] as const,
  },
  relances: {
    list:  (filters?: object) => ['relances', 'list', filters] as const,
    today: ()                 => ['relances', 'today'] as const,
  },
  activities: {
    list: (personId: string) => ['activities', 'list', personId] as const,
  },
  objectives: {
    list: (year: number) => ['objectives', 'list', year] as const,
  },
  alerts: {
    unread: () => ['alerts', 'unread'] as const,
  },
} as const;
