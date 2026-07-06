import { useMutation, useQuery } from '@tanstack/react-query';
import { api, type PaginatedResult } from '../../../lib/api';
import { queryClient, queryKeys } from '../../../lib/queryClient';
import type { Person } from '../../../lib/api-types';

interface PeopleFilters {
  statut?:           'CLIENT' | 'PROSPECT';
  niveau_interet?:   'CHAUD' | 'TIEDE' | 'FROID';
  search?:           string;
  per_page?:         number;
}

export function usePeople(filters?: PeopleFilters) {
  return useQuery({
    queryKey: queryKeys.people.list(filters),
    queryFn: ({ signal }) =>
      api.get<PaginatedResult<Person>>(
        '/people',
        filters as Record<string, string | number | boolean> | undefined,
        signal,
      ),
  });
}

export function usePerson(id: string) {
  return useQuery({
    queryKey: queryKeys.people.detail(id),
    queryFn:  ({ signal }) =>
      api.get<{ data: Person }>(`/people/${id}`, undefined, signal),
    enabled: !!id,
  });
}

export function useUpdatePerson() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Pick<Person, 'niveau_interet' | 'statut' | 'nom' | 'prenom' | 'telephone' | 'email' | 'observations'>> }) =>
      api.put<{ data: Person }>(`/people/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
    },
  });
}

export function useConvertToClient() {
  return useMutation({
    mutationFn: (id: string) =>
      api.post<{ data: Person }>(`/people/${id}/convert`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
    },
  });
}

export function useCreatePerson() {
  return useMutation({
    mutationFn: (data: {
      nom:              string;
      prenom?:          string | null;
      telephone:        string;
      email?:           string | null;
      adresse?:         string | null;
      profession?:      string | null;
      statut:           'CLIENT' | 'PROSPECT';
      source?:          string | null;
      niveau_interet?:  'CHAUD' | 'TIEDE' | 'FROID' | null;
      observations?:    string | null;
      date_relance?:    string | null;
    }) => api.post<{ data: Person }>('/people', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
    },
  });
}

export function useDeletePerson() {
  return useMutation({
    mutationFn: (id: string) => api.delete(`/people/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
    },
  });
}
