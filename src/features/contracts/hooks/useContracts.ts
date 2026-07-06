import { useMutation, useQuery } from '@tanstack/react-query';
import { api, type PaginatedResult } from '../../../lib/api';
import { queryClient, queryKeys } from '../../../lib/queryClient';
import type { Contract } from '../../../lib/api-types';

interface ContractFilters {
  personne_id?: string;
  statut?:      string;
  expiring?:    boolean;
  per_page?:    number;
}

export function useContracts(filters?: ContractFilters) {
  return useQuery({
    queryKey: queryKeys.contracts.list(filters),
    queryFn: ({ signal }) =>
      api.get<PaginatedResult<Contract>>(
        '/contracts',
        filters as Record<string, string | number | boolean> | undefined,
        signal,
      ),
  });
}

export function useExpiringContracts() {
  return useQuery({
    queryKey: queryKeys.contracts.list({ expiring: true }),
    queryFn: ({ signal }) =>
      api.get<PaginatedResult<Contract>>('/contracts/expiring', undefined, signal),
    staleTime: 5 * 60 * 1000,
  });
}

export function useContract(id: string) {
  return useQuery({
    queryKey: queryKeys.contracts.detail(id),
    queryFn:  ({ signal }) =>
      api.get<{ data: Contract }>(`/contracts/${id}`, undefined, signal),
    enabled: !!id,
  });
}

export function useRenewContract() {
  return useMutation({
    mutationFn: ({ id, date_echeance }: { id: string; date_echeance: string }) =>
      api.post<{ data: Contract }>(`/contracts/${id}/renew`, { date_echeance }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

export function useCreateContract() {
  return useMutation({
    mutationFn: (data: {
      personne_id:     string;
      type_assurance:  string;
      prime:           string | number;
      date_effet?:     string | null;
      date_echeance?:  string | null;
      formule?:        string | null;
      notes?:          string | null;
      statut?:         string;
    }) => api.post<{ data: Contract }>('/contracts', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

export function useDeleteContract() {
  return useMutation({
    mutationFn: (id: string) => api.delete(`/contracts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}
