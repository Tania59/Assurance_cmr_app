import { useMemo } from "react";
import { Target, Activity, TrendingUp, Calendar, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../../../shared/constants/colors";
import { TODAY_STR, fmtDate, daysUntil } from "../../../shared/utils/date";
import { KPICard } from "../../../shared/components/ui/KPICard";
import { SectionHeader } from "../../../shared/components/layout/SectionHeader";
import { useAuth } from "../../../contexts/AuthContext";
import { usePeople } from "../../people/hooks/usePeople";

export default function CommercialDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const prenom   = user?.nom.split(" ")[0] ?? "Agent";

  const prospectsQ = usePeople({ statut: "PROSPECT", per_page: 100 });
  const prospects  = prospectsQ.data?.data ?? [];

  const chauds = useMemo(() => prospects.filter((p) => p.niveau_interet === "CHAUD").length, [prospects]);
  const tièdes = useMemo(() => prospects.filter((p) => p.niveau_interet === "TIEDE").length, [prospects]);
  const froids = useMemo(() => prospects.filter((p) => p.niveau_interet === "FROID" || !p.niveau_interet).length, [prospects]);

  const rdvSemaine = useMemo(
    () =>
      prospects.filter((p) => {
        if (!p.date_relance) return false;
        const d = daysUntil(p.date_relance);
        return d >= 0 && d <= 7;
      }),
    [prospects],
  );

  return (
    <div className="flex flex-col h-full">
      {/* En-tête */}
      <div className="px-4 pt-5 pb-4 flex-shrink-0" style={{ background: COLORS.secondary }}>
        <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
          Bonjour, <span className="font-semibold text-white">{prenom}</span> 👋
        </p>
        <h1 className="font-montserrat font-extrabold text-xl mt-0.5" style={{ color: "#fff" }}>
          Pipeline Commercial
        </h1>
        <p className="font-jetbrains text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
          {fmtDate(TODAY_STR)}
        </p>
      </div>

      {/* Contenu */}
      <div className="flex-1 overflow-y-auto pb-20" style={{ background: COLORS.bg }}>
        {/* KPIs */}
        <div className="px-4 pt-4">
          {prospectsQ.isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 size={22} color={COLORS.muted} className="animate-spin" />
            </div>
          ) : (
            <div className="flex gap-3">
              <KPICard
                label="Chauds"
                value={chauds}
                icon={<Target size={18} />}
                color={COLORS.alert}
                alert={chauds > 0}
              />
              <KPICard
                label="Tièdes"
                value={tièdes}
                icon={<Activity size={18} />}
                color={COLORS.orange}
              />
              <KPICard
                label="Froids"
                value={froids}
                icon={<TrendingUp size={18} />}
                color={COLORS.muted}
              />
            </div>
          )}
        </div>

        {/* RDV / Relances cette semaine */}
        <div className="px-4 pt-5">
          <SectionHeader
            title={`À relancer cette semaine (${rdvSemaine.length})`}
            action="Calendrier"
            onAction={() => navigate("/calendrier")}
          />

          {prospectsQ.isLoading && (
            <div className="flex justify-center py-4">
              <Loader2 size={20} color={COLORS.muted} className="animate-spin" />
            </div>
          )}

          <div className="flex flex-col gap-2">
            {rdvSemaine.map((p) => {
              const isAujourdHui = p.date_relance === TODAY_STR;
              return (
                <button
                  key={p.id}
                  type="button"
                  className="bg-white rounded-xl p-4 flex items-center gap-3 text-left w-full active:opacity-80"
                  style={{ border: `1.5px solid ${isAujourdHui ? COLORS.gold : COLORS.border}` }}
                  onClick={() => navigate(`/pipeline/${p.id}`)}
                >
                  <div
                    className="p-2 rounded-xl"
                    style={{ background: isAujourdHui ? "#FEF3C7" : "#F0F2F5" }}
                  >
                    <Calendar size={18} color={isAujourdHui ? COLORS.gold : COLORS.muted} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-montserrat font-bold text-sm truncate" style={{ color: COLORS.text }}>
                      {p.full_name}
                    </p>
                    <p className="font-inter text-xs mt-0.5" style={{ color: COLORS.muted }}>
                      {p.profession || "—"} · {p.source || "—"}
                    </p>
                  </div>
                  <p
                    className="font-jetbrains text-xs font-semibold flex-shrink-0"
                    style={{ color: isAujourdHui ? COLORS.gold : COLORS.muted }}
                  >
                    {isAujourdHui ? "Auj." : fmtDate(p.date_relance!)}
                  </p>
                </button>
              );
            })}

            {!prospectsQ.isLoading && rdvSemaine.length === 0 && (
              <p className="font-inter text-sm text-center py-3" style={{ color: COLORS.muted }}>
                Aucune relance prévue cette semaine
              </p>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="px-4 pt-5 pb-2">
          <button
            type="button"
            className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 font-montserrat font-bold text-sm"
            style={{ background: COLORS.secondary, color: "#fff" }}
            onClick={() => navigate("/pipeline/nouveau")}
          >
            <Plus size={18} /> Nouveau prospect
          </button>
        </div>
      </div>
    </div>
  );
}
