import { useState, useMemo } from "react";
import { Check, Loader2 } from "lucide-react";
import { COLORS } from "../../../shared/constants/colors";
import { fmtDate, daysUntil } from "../../../shared/utils/date";
import { ScreenHeader } from "../../../shared/components/layout/ScreenHeader";
import { ContractIcon } from "../../../shared/components/icons/ContractIcon";
import { useContracts } from "../hooks/useContracts";
import { usePeople } from "../../people/hooks/usePeople";
import type { Person } from "../../../lib/api-types";

export default function EcheancesScreen() {
  const [filter, setFilter] = useState<30 | 60 | 90>(30);

  const contractsQ = useContracts({ per_page: 100 });
  const peopleQ    = usePeople({ statut: "CLIENT", per_page: 100 });

  const personMap = useMemo<Map<string, Person>>(() => {
    const m = new Map<string, Person>();
    for (const p of peopleQ.data?.data ?? []) {
      m.set(p.id, p);
    }
    return m;
  }, [peopleQ.data]);

  const echeances = useMemo(() => {
    return (contractsQ.data?.data ?? [])
      .filter((c) => {
        if (c.statut !== "ACTIF" || !c.date_echeance) return false;
        const d = daysUntil(c.date_echeance);
        return d >= 0 && d <= filter;
      })
      .map((c) => ({ contract: c, days: daysUntil(c.date_echeance!) }))
      .sort((a, b) => a.days - b.days);
  }, [contractsQ.data, filter]);

  const isLoading = contractsQ.isLoading || peopleQ.isLoading;

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title="Échéances" />
      <div className="flex-1 overflow-y-auto pb-20" style={{ background: COLORS.bg }}>
        {/* Filtres */}
        <div className="px-4 py-3 flex gap-2">
          {([30, 60, 90] as const).map((f) => (
            <button
              key={f}
              type="button"
              className="flex-1 py-2 rounded-xl font-montserrat font-bold text-sm"
              style={{
                background: filter === f ? COLORS.primary : "#fff",
                color:      filter === f ? "#fff" : COLORS.muted,
                border:     `1.5px solid ${filter === f ? COLORS.primary : COLORS.border}`,
              }}
              onClick={() => setFilter(f)}
            >
              {f}j
            </button>
          ))}
        </div>

        <div className="px-4 flex flex-col gap-2 pb-4">
          {isLoading && (
            <div className="flex justify-center py-10">
              <Loader2 size={28} color={COLORS.muted} className="animate-spin" />
            </div>
          )}

          {!isLoading && (
            <>
              <p className="font-inter text-xs mb-1" style={{ color: COLORS.muted }}>
                {echeances.length} échéance{echeances.length !== 1 ? "s" : ""} dans les {filter}j
              </p>

              {echeances.map(({ contract: ct, days }) => {
                const person = personMap.get(ct.personne_id);
                return (
                  <div
                    key={ct.id}
                    className="bg-white rounded-xl p-4 flex items-center gap-3"
                    style={{ border: `1.5px solid ${days <= 7 ? "#FEE2E2" : COLORS.border}` }}
                  >
                    <div className="p-2.5 rounded-xl" style={{ background: "#F0F2F5" }}>
                      <ContractIcon type={ct.type_label} size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-montserrat font-bold text-sm truncate" style={{ color: COLORS.text }}>
                        {person?.full_name ?? "—"}
                      </p>
                      <p className="font-inter text-xs" style={{ color: COLORS.muted }}>
                        {ct.type_label} · {ct.numero}
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
                        {fmtDate(ct.date_echeance!)}
                      </p>
                    </div>
                  </div>
                );
              })}

              {echeances.length === 0 && (
                <div className="bg-white rounded-xl p-6 text-center" style={{ border: `1px solid ${COLORS.border}` }}>
                  <Check size={28} color={COLORS.success} className="mx-auto mb-2" />
                  <p className="font-inter text-sm" style={{ color: COLORS.muted }}>
                    Aucune échéance dans les {filter} prochains jours
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
