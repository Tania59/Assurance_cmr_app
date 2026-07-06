import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type ApiResult, type PaginatedResult } from '../../../lib/api';
import { queryKeys } from '../../../lib/queryClient';

// ── Types ─────────────────────────────────────────────────────────────────────

interface PersonneStats {
  total:         number;
  prospects:     number;
  clients:       number;
  hot_prospects: number;
}

interface ContratStats {
  total:        number;
  actifs:       number;
  expirant_30j: number;
  prime_totale: number;
}

interface DashboardData {
  portfolio: {
    personnes:              PersonneStats;
    contrats:               ContratStats;
    relances_aujourd_hui:   number;
  };
  revenue: Array<{
    type:  string;
    total: number;
    count: number;
  }>;
  cached_at: string;
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/**
 * Données principales du dashboard.
 * staleTime élevé (5 min) car le serveur cache déjà 30 min côté Redis.
 */
export function useDashboard(months = 12) {
  return useQuery({
    queryKey: queryKeys.dashboard.index(months),
    queryFn:  ({ signal }) =>
      api.get<ApiResult<DashboardData>>('/analytics/dashboard', { months }, signal)
         .then(r => r.data),
    staleTime: 5 * 60 * 1000, // 5 min côté client
  });
}

/** KPI annuels de l'agence (MANAGER/ADMIN) */
export function useKpi(year = new Date().getFullYear()) {
  return useQuery({
    queryKey: queryKeys.dashboard.kpi(year),
    queryFn:  ({ signal }) =>
      api.get<ApiResult<unknown>>('/analytics/kpi', { annee: year }, signal)
         .then(r => r.data),
    staleTime: 30 * 60 * 1000, // 30 min — données lentes
  });
}

/** Classement des agents */
export function useClassement(year = new Date().getFullYear()) {
  return useQuery({
    queryKey: queryKeys.dashboard.classement(year),
    queryFn:  ({ signal }) =>
      api.get<ApiResult<unknown[]>>('/analytics/classement', { annee: year }, signal)
         .then(r => r.data),
    staleTime: 30 * 60 * 1000,
  });
}

/**
 * Force le refresh du cache dashboard côté serveur.
 * Invalide aussi le cache React Query local pour afficher les nouvelles données.
 */
export function useRefreshDashboard() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => api.post<ApiResult<{ queued: boolean }>>('/analytics/refresh'),
    onSuccess: () => {
      // Invalide toutes les queries dashboard — prochain rendu refetch depuis le serveur
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
