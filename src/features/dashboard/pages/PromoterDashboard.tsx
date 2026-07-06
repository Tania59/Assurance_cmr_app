import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Users, ShieldCheck, TrendingUp, Clock, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../../../shared/constants/colors";
import { fmtDate, TODAY_STR } from "../../../shared/utils/date";
import { fmtMontant } from "../../../shared/utils/format";
import { KPICard } from "../../../shared/components/ui/KPICard";
import { SectionHeader } from "../../../shared/components/layout/SectionHeader";
import { useAuth } from "../../../contexts/AuthContext";
import { useDashboard } from "../hooks/useDashboard";

export default function PromoterDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const prenom   = user?.nom.split(" ")[0] ?? "Promoteur";

  const dashQ = useDashboard();
  const data  = dashQ.data;

  // Graphique barres : répartition des primes par type de contrat
  const barData = (data?.revenue ?? []).map((r) => ({
    name: r.type,
    v:    r.count,
  }));

  return (
    <div className="flex flex-col h-full">
      {/* En-tête */}
      <div className="px-4 pt-5 pb-4 flex-shrink-0" style={{ background: COLORS.primary }}>
        <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
          Bonjour, <span className="font-semibold text-white">{prenom}</span> 👋
        </p>
        <h1 className="font-montserrat font-extrabold text-xl mt-0.5" style={{ color: "#fff" }}>
          Vue Promoteur
        </h1>
        <p className="font-jetbrains text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
          {fmtDate(TODAY_STR)}
        </p>
      </div>

      {/* Contenu */}
      <div className="flex-1 overflow-y-auto pb-20" style={{ background: COLORS.bg }}>
        {/* KPIs */}
        <div className="px-4 pt-4">
          {dashQ.isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 size={22} color={COLORS.muted} className="animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <KPICard
                label="Clients"
                value={data?.portfolio.personnes.clients ?? 0}
                icon={<Users size={18} />}
                color={COLORS.primary}
              />
              <KPICard
                label="Contrats actifs"
                value={data?.portfolio.contrats.actifs ?? 0}
                icon={<ShieldCheck size={18} />}
                color={COLORS.success}
              />
              <KPICard
                label="Prime totale"
                value={
                  data?.portfolio.contrats.prime_totale
                    ? fmtMontant(data.portfolio.contrats.prime_totale)
                    : "—"
                }
                icon={<TrendingUp size={18} />}
                color={COLORS.secondary}
              />
              <KPICard
                label="Relances du jour"
                value={data?.portfolio.relances_aujourd_hui ?? 0}
                icon={<Clock size={18} />}
                alert={(data?.portfolio.relances_aujourd_hui ?? 0) > 0}
              />
            </div>
          )}
        </div>

        {/* Graphique : contrats par type */}
        {!dashQ.isLoading && barData.length > 0 && (
          <div className="px-4 pt-5 pb-4">
            <SectionHeader
              title="Contrats par type"
              action="Échéances"
              onAction={() => navigate("/echeances")}
            />
            <div className="bg-white rounded-xl p-4" style={{ border: `1px solid ${COLORS.border}` }}>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={barData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fontFamily: "JetBrains Mono", fill: COLORS.muted }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fontFamily: "JetBrains Mono", fill: COLORS.muted }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      fontFamily: "Inter",
                      fontSize: 12,
                      borderRadius: 8,
                      border: `1px solid ${COLORS.border}`,
                    }}
                    formatter={(v: number) => [v, "Contrats"]}
                  />
                  <Bar dataKey="v" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Résumé portefeuille */}
        {!dashQ.isLoading && data && (
          <div className="px-4 pt-2 pb-4">
            <SectionHeader
              title="Portefeuille"
              action="Clients"
              onAction={() => navigate("/clients")}
            />
            <div className="bg-white rounded-xl p-4 flex flex-col gap-3" style={{ border: `1px solid ${COLORS.border}` }}>
              <div className="flex justify-between items-center">
                <span className="font-inter text-sm" style={{ color: COLORS.muted }}>
                  Total personnes
                </span>
                <span className="font-jetbrains font-semibold text-sm" style={{ color: COLORS.text }}>
                  {data.portfolio.personnes.total}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-inter text-sm" style={{ color: COLORS.muted }}>
                  Prospects chauds
                </span>
                <span className="font-jetbrains font-semibold text-sm" style={{ color: COLORS.alert }}>
                  {data.portfolio.personnes.hot_prospects}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-inter text-sm" style={{ color: COLORS.muted }}>
                  Contrats expirant 30j
                </span>
                <span
                  className="font-jetbrains font-semibold text-sm"
                  style={{ color: data.portfolio.contrats.expirant_30j > 0 ? COLORS.orange : COLORS.text }}
                >
                  {data.portfolio.contrats.expirant_30j}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
