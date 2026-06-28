import { Target, Activity, TrendingUp, Calendar, Plus } from "lucide-react";
import type{ Prospect, Screen } from "../../../shared/types";
import { COLORS } from "../../../shared/constants/colors";
import { TODAY_STR, fmtDate, daysUntil } from "../../../shared/utils/date";
import { KPICard } from "../../../shared/components/ui/KPICard";
import { SectionHeader } from "../../../shared/components/layout/SectionHeader";

interface CommercialDashboardProps {
  prospects: Prospect[];
  navigate: (s: Screen) => void;
}

export function CommercialDashboard({ prospects, navigate }: CommercialDashboardProps) {
  const chauds = prospects.filter((p) => p.statut === "Chaud").length;
  const tièdes = prospects.filter((p) => p.statut === "Tiède").length;
  const froids = prospects.filter((p) => p.statut === "Froid").length;
  const rdvSemaine = prospects.filter(
    (p) => p.rdv && daysUntil(p.rdv) >= 0 && daysUntil(p.rdv) <= 7
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex-shrink-0" style={{ background: COLORS.secondary }}>
        <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
          Bonjour, <span className="font-semibold text-white">Fatima</span> 👋
        </p>
        <h1 className="font-montserrat font-extrabold text-xl mt-0.5" style={{ color: "#fff" }}>
          Pipeline Commercial
        </h1>
        <p className="font-jetbrains text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
          {fmtDate(TODAY_STR)}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20" style={{ background: COLORS.bg }}>
        <div className="px-4 pt-4">
          <div className="flex gap-3">
            <KPICard
              label="Chauds"
              value={chauds}
              icon={<Target size={18} />}
              color={COLORS.alert}
              alert={chauds > 0}
            />
            <KPICard label="Tièdes" value={tièdes} icon={<Activity size={18} />} color={COLORS.orange} />
            <KPICard label="Froids" value={froids} icon={<TrendingUp size={18} />} color={COLORS.muted} />
          </div>
        </div>

        <div className="px-4 pt-5">
          <SectionHeader
            title={`RDV cette semaine (${rdvSemaine.length})`}
            action="Calendrier"
            onAction={() => navigate("comm_calendrier")}
          />
          <div className="flex flex-col gap-2">
            {rdvSemaine.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl p-4 flex items-center gap-3"
                style={{ border: `1.5px solid ${p.rdv === TODAY_STR ? COLORS.gold : COLORS.border}` }}
              >
                <div
                  className="p-2 rounded-xl"
                  style={{ background: p.rdv === TODAY_STR ? "#FEF3C7" : "#F0F2F5" }}
                >
                  <Calendar size={18} color={p.rdv === TODAY_STR ? COLORS.gold : COLORS.muted} />
                </div>
                <div className="flex-1">
                  <p className="font-montserrat font-bold text-sm" style={{ color: COLORS.text }}>
                    {p.nom}
                  </p>
                  <p className="font-inter text-xs" style={{ color: COLORS.muted }}>
                    {p.interet} · {p.source}
                  </p>
                </div>
                <p
                  className="font-jetbrains text-xs font-semibold flex-shrink-0"
                  style={{ color: p.rdv === TODAY_STR ? COLORS.gold : COLORS.muted }}
                >
                  {p.rdv === TODAY_STR ? "Auj." : fmtDate(p.rdv!)}
                </p>
              </div>
            ))}
            {rdvSemaine.length === 0 && (
              <p className="font-inter text-sm text-center py-3" style={{ color: COLORS.muted }}>
                Aucun RDV cette semaine
              </p>
            )}
          </div>
        </div>

        <div className="px-4 pt-5 pb-2">
          <button
            className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 font-montserrat font-bold text-sm"
            style={{ background: COLORS.secondary, color: "#fff" }}
            onClick={() => navigate("comm_prospect_new")}
          >
            <Plus size={18} /> Nouveau prospect
          </button>
        </div>
      </div>
    </div>
  );
}