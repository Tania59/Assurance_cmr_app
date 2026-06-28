import type{ Prospect } from "../../../shared/types";
import { SEED_PROSPECTS } from "../../../shared/constants/seed";
import { useLocalStorage } from "../../../shared/hooks/useLocalStorage";

export function useProspects() {
  const [prospects, setProspects] = useLocalStorage<Prospect[]>("assur_prospects", SEED_PROSPECTS);

  const addProspect = (prospect: Prospect) => {
    setProspects((prev) => [...prev, prospect]);
  };

  const updateProspect = (id: number, updates: Partial<Prospect>) => {
    setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProspect = (id: number) => {
    setProspects((prev) => prev.filter((p) => p.id !== id));
  };

  const updateStatut = (id: number, statut: Prospect["statut"]) => {
    setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, statut } : p)));
  };

  return {
    prospects,
    setProspects,
    addProspect,
    updateProspect,
    deleteProspect,
    updateStatut,
  };
}