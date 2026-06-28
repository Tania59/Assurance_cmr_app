import { useState, useMemo } from "react";
import { Check } from "lucide-react";
import type{ Client } from "../../../shared/types";
import { COLORS } from "../../../shared/constants/colors";
import { fmtDate, daysUntil } from "../../../shared/utils/date";
import { ScreenHeader } from "../../../shared/components/layout/ScreenHeader";
import { ContractIcon } from "../../../shared/components/icons/ContractIcon";

interface EcheancesScreenProps {
  clients: Client[];
}

export function EcheancesScreen({ clients }: EcheancesScreenProps) {
  const [filter, setFilter] = useState<30 | 60 | 90>(30);
  const all = useMemo(
    () =>
      clients
        .flatMap((c) =>
          c.contrats
            .filter(
              (ct) =>
                ct.statut === "Actif" &&
                daysUntil(ct.echeance) >= 0 &&
                daysUntil(ct.echeance) <= filter
            )
            .map((ct) => ({ client: c, contrat: ct, days: daysUntil(ct.echeance) }))
        )
        .sort((a, b) => a.days - b.days),
    [clients, filter]
  );

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title="Échéances" />
      <div className="flex-1 overflow-y-auto pb-20" style={{ background: COLORS.bg }}>
        <div className="px-4 py-3 flex gap-2">
          {([30, 60, 90] as const).map((f) => (
            <button
              key={f}
              className="flex-1 py-2 rounded-xl font-montserrat font-bold text-sm"
              style={{
                background: filter === f ? COLORS.primary : "#fff",
                color: filter === f ? "#fff" : COLORS.muted,
                border: `1.5px solid ${filter === f ? COLORS.primary : COLORS.border}`,
              }}
              onClick={() => setFilter(f)}
            >
              {f}j
            </button>
          ))}
        </div>
        <div className="px-4 flex flex-col gap-2 pb-4">
          <p className="font-inter text-xs mb-1" style={{ color: COLORS.muted }}>
            {all.length} échéance{all.length !== 1 ? "s" : ""} dans les {filter}j
          </p>
          {all.map(({ client, contrat, days }) => (
            <div
              key={contrat.id}
              className="bg-white rounded-xl p-4 flex items-center gap-3"
              style={{ border: `1.5px solid ${days <= 7 ? "#FEE2E2" : COLORS.border}` }}
            >
              <div className="p-2.5 rounded-xl" style={{ background: "#F0F2F5" }}>
                <ContractIcon type={contrat.type} size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-montserrat font-bold text-sm truncate" style={{ color: COLORS.text }}>
                  {client.prenom} {client.nom}
                </p>
                <p className="font-inter text-xs" style={{ color: COLORS.muted }}>
                  {contrat.type} · {contrat.numero}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p
                  className="font-jetbrains font-bold text-sm"
                  style={{ color: days <= 7 ? COLORS.alert : days <= 14 ? COLORS.orange : COLORS.muted }}
                >
                  J-{days}
                </p>
                <p className="font-jetbrains text-xs" style={{ color: COLORS.muted }}>
                  {fmtDate(contrat.echeance)}
                </p>
              </div>
            </div>
          ))}
          {all.length === 0 && (
            <div className="bg-white rounded-xl p-6 text-center" style={{ border: `1px solid ${COLORS.border}` }}>
              <Check size={28} color={COLORS.success} className="mx-auto mb-2" />
              <p className="font-inter text-sm" style={{ color: COLORS.muted }}>
                Aucune échéance dans les {filter} prochains jours
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}