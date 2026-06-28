import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from "recharts";
import { Users, ShieldCheck, TrendingUp, AlertTriangle } from "lucide-react";
import type{ Screen } from "../../../shared/types";
import { COLORS } from "../../../shared/constants/colors";
import { fmtDate, TODAY_STR } from "../../../shared/utils/date";
import { KPICard } from "../../../shared/components/ui/KPICard";
import { SectionHeader } from "../../../shared/components/layout/SectionHeader";
import { EQUIPE } from "../../../shared/constants/seed";

interface PromoterDashboardProps {
  navigate: (s: Screen) => void;
}

export function PromoterDashboard({ navigate }: PromoterDashboardProps) {
  const totalClients = EQUIPE.reduce((s, m) => s + m.clients, 0);
  const totalActifs = EQUIPE.reduce((s, m) => s + m.contratsActifs, 0);
  const avgConv = Math.round(EQUIPE.reduce((s, m) => s + m.conversion, 0) / EQUIPE.length);
  const retard = EQUIPE.reduce((s, m) => s + m.relancesRetard, 0);

  const monthData = [
    { m: "Jan", v: 88 },
    { m: "Fév", v: 95 },
    { m: "Mar", v: 102 },
    { m: "Avr", v: 110 },
    { m: "Mai", v: 118 },
    { m: "Jun", v: 124 },
  ];

  const perfData = EQUIPE.map((m) => ({
    name: m.nom.split(" ")[0],
    v: m.clients,
  }));

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex-shrink-0" style={{ background: COLORS.primary }}>
        <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
          Tableau de bord
        </p>
        <h1 className="font-montserrat font-extrabold text-xl mt-0.5" style={{ color: "#fff" }}>
          Vue Promoteur
        </h1>
        <p className="font-jetbrains text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
          {fmtDate(TODAY_STR)}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20" style={{ background: COLORS.bg }}>
        <div className="px-4 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <KPICard
              label="Clients total"
              value={totalClients}
              icon={<Users size={18} />}
              color={COLORS.primary}
            />
            <KPICard
              label="Contrats actifs"
              value={totalActifs}
              icon={<ShieldCheck size={18} />}
              color={COLORS.success}
            />
            <KPICard
              label="Taux conversion"
              value={`${avgConv}%`}
              icon={<TrendingUp size={18} />}
              color={COLORS.secondary}
            />
            <KPICard
              label="Relances retard"
              value={retard}
              icon={<AlertTriangle size={18} />}
              alert={retard > 0}
            />
          </div>
        </div>

        <div className="px-4 pt-5">
          <SectionHeader
            title="Évolution clients"
            action="Statistiques"
            onAction={() => navigate("prom_stats")}
          />
          <div className="bg-white rounded-xl p-4" style={{ border: `1px solid ${COLORS.border}` }}>
            <ResponsiveContainer width="100%" height={130}>
              <LineChart data={monthData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <XAxis
                  dataKey="m"
                  tick={{ fontSize: 10, fontFamily: "JetBrains Mono", fill: COLORS.muted }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fontFamily: "JetBrains Mono", fill: COLORS.muted }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    fontFamily: "Inter",
                    fontSize: 12,
                    borderRadius: 8,
                    border: `1px solid ${COLORS.border}`,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={COLORS.primary}
                  strokeWidth={2.5}
                  dot={{ fill: COLORS.primary, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="px-4 pt-5 pb-4">
          <SectionHeader
            title="Performance équipe"
            action="Voir équipe"
            onAction={() => navigate("prom_equipe")}
          />
          <div className="bg-white rounded-xl p-4" style={{ border: `1px solid ${COLORS.border}` }}>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={perfData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
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
                />
                <Tooltip
                  contentStyle={{
                    fontFamily: "Inter",
                    fontSize: 12,
                    borderRadius: 8,
                    border: `1px solid ${COLORS.border}`,
                  }}
                />
                <Bar dataKey="v" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}