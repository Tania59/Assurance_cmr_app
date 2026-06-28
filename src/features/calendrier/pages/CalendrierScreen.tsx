import { useState } from "react";
import { Calendar, Phone } from "lucide-react";
import type { Prospect } from "../../../shared/types";
import { COLORS } from "../../../shared/constants/colors";
import { TODAY_STR, fmtDate } from "../../../shared/utils/date";
import { ScreenHeader } from "../../../shared/components/layout/ScreenHeader";

interface CalendrierScreenProps {
  prospects: Prospect[];
}

export function CalendrierScreen({ prospects }: CalendrierScreenProps) {
  const rdvAll = prospects.filter((p) => p.rdv);
  const rdvDates = new Set(rdvAll.map((p) => p.rdv!));
  const [selected, setSelected] = useState<string | null>(TODAY_STR);

  const year = 2026,
    month = 5;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const selectedRdvs = rdvAll.filter((p) => p.rdv === selected);

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title="Calendrier RDV" />
      <div className="flex-1 overflow-y-auto pb-20" style={{ background: COLORS.bg }}>
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <h2 className="font-montserrat font-bold text-base" style={{ color: COLORS.text }}>
            Juin 2026
          </h2>
          <span className="font-jetbrains text-xs" style={{ color: COLORS.muted }}>
            {rdvDates.size} RDV ce mois
          </span>
        </div>
        <div className="mx-4 bg-white rounded-xl" style={{ border: `1px solid ${COLORS.border}` }}>
          <div className="grid grid-cols-7 pt-3 px-2">
            {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => (
              <div
                key={i}
                className="text-center font-inter text-xs font-semibold py-1"
                style={{ color: COLORS.muted }}
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 pb-3 px-2">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const ds = `2026-06-${String(day).padStart(2, "0")}`;
              const hasRdv = rdvDates.has(ds);
              const isToday = ds === TODAY_STR;
              const isSel = ds === selected;
              return (
                <button
                  key={i}
                  className="flex flex-col items-center py-1.5 rounded-xl mx-0.5"
                  style={{
                    background: isSel ? COLORS.primary : isToday ? "#EFF6FF" : "transparent",
                  }}
                  onClick={() => setSelected(ds)}
                >
                  <span
                    className="font-jetbrains text-sm"
                    style={{ color: isSel ? "#fff" : isToday ? COLORS.secondary : COLORS.text }}
                  >
                    {day}
                  </span>
                  {hasRdv && (
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-0.5"
                      style={{ background: isSel ? "rgba(255,255,255,0.7)" : COLORS.alert }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 pt-4">
          <p className="font-montserrat font-bold text-sm mb-3" style={{ color: COLORS.text }}>
            {selected ? `RDV — ${fmtDate(selected)}` : "Sélectionnez un jour"}
          </p>
          {selectedRdvs.length === 0 ? (
            <div className="bg-white rounded-xl p-4 text-center" style={{ border: `1px solid ${COLORS.border}` }}>
              <p className="font-inter text-sm" style={{ color: COLORS.muted }}>
                Aucun RDV ce jour
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pb-4">
              {selectedRdvs.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl p-4 flex items-center gap-3"
                  style={{ border: `1.5px solid ${COLORS.gold}` }}
                >
                  <div className="p-2.5 rounded-xl" style={{ background: "#FEF3C7" }}>
                    <Calendar size={18} color={COLORS.gold} />
                  </div>
                  <div className="flex-1">
                    <p className="font-montserrat font-bold text-sm" style={{ color: COLORS.text }}>
                      {p.nom}
                    </p>
                    <p className="font-inter text-xs" style={{ color: COLORS.muted }}>
                      {p.interet} · {p.source}
                    </p>
                    {p.note && (
                      <p className="font-inter text-xs mt-0.5" style={{ color: COLORS.muted }}>
                        {p.note}
                      </p>
                    )}
                  </div>
                  <a href={`tel:${p.tel}`} className="p-2 rounded-xl" style={{ background: COLORS.primary }}>
                    <Phone size={16} color="#fff" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}