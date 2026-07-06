import { useMutation, useQuery } from '@tanstack/react-query';
import { api, type PaginatedResult } from '../../../lib/api';
import { queryClient, queryKeys } from '../../../lib/queryClient';
import type { Relance } from '../../../lib/api-types';

interface RelanceFilters {
  statut?:      'PLANIFIEE' | 'EFFECTUEE' | 'ANNULEE';
  personne_id?: string;
  per_page?:    number;
}

export function useRelances(filters?: RelanceFilters) {
  return useQuery({
    queryKey: queryKeys.relances.list(filters),
    queryFn: ({ signal }) =>
      api.get<PaginatedResult<Relance>>(
        '/relances',
        filters as Record<string, string | number | boolean> | undefined,
        signal,
      ),
    staleTime: 2 * 60 * 1000,
  });
}

export function useRelancesToday() {
  return useQuery({
    queryKey: queryKeys.relances.today(),
    queryFn:  ({ signal }) =>
      api.get<PaginatedResult<Relance>>('/relances/today', undefined, signal),
    staleTime: 60 * 1000,
  });
}

export function useCompleteRelance() {
  return useMutation({
    mutationFn: ({ id, resultat, note }: { id: string; resultat: string; note?: string }) =>
      api.post<{ data: Relance }>(`/relances/${id}/complete`, { resultat, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relances'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useCreateRelance() {
  return useMutation({
    mutationFn: (data: {
      personne_id:   string;
      contrat_id?:   string;
      type:          string;
      date_planifiee: string;
      note?:         string;
    }) => api.post<{ data: Relance }>('/relances', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relances'] });
    },
  });
}

export function useDeleteRelance() {
  return useMutation({
    mutationFn: (id: string) => api.delete(`/relances/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relances'] });
    },
  });
}
