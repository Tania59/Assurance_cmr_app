import type { StatutContrat } from "../../types";

interface StatusBadgeProps {
  statut: StatutContrat;
}

export function StatusBadge({ statut }: StatusBadgeProps) {
  const cfg: Record<StatutContrat, { bg: string; text: string }> = {
    Actif: { bg: "#DCFCE7", text: "#166534" },
    Expiré: { bg: "#FEE2E2", text: "#991B1B" },
    Résilié: { bg: "#F3F4F6", text: "#4B5563" },
    "En attente": { bg: "#FEF3C7", text: "#92400E" },
  };
  const s = cfg[statut];
  return (
    <span
      className="font-inter text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.text }}
    >
      {statut}
    </span>
  );
}