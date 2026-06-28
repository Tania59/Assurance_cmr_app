import { daysUntil } from "../../utils/date";
import type { StatutContrat } from "../../types";
import { COLORS } from "../../constants/colors";

interface EcheancePillProps {
  echeance: string;
  statut: StatutContrat;
}

export function EcheancePill({ echeance, statut }: EcheancePillProps) {
  const d = daysUntil(echeance);
  if (statut === "Expiré" || statut === "Résilié" || d < 0) return null;
  if (d <= 7) {
    return (
      <span
        className="font-jetbrains text-xs font-bold px-2 py-0.5 rounded-full"
        style={{ background: "#FEE2E2", color: COLORS.alert }}
      >
        J-{d}
      </span>
    );
  }
  if (d <= 30) {
    return (
      <span
        className="font-jetbrains text-xs font-bold px-2 py-0.5 rounded-full"
        style={{ background: "#FEF3C7", color: "#92400E" }}
      >
        J-{d}
      </span>
    );
  }
  return null;
}