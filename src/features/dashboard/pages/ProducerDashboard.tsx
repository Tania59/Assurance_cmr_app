import { useState, useMemo } from "react";
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  Check,
  Square,
  CheckSquare,
  Phone,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import type { Client, Screen } from "../../../shared/types";
import { COLORS } from "../../../shared/constants/colors";
import { TODAY_STR, fmtDate, daysUntil } from "../../../shared/utils/date";
import { KPICard } from "../../../shared/components/ui/KPICard";
import { SectionHeader } from "../../../shared/components/layout/SectionHeader";
import { ContractIcon } from "../../../shared/components/icons/ContractIcon";

interface ProducerDashboardProps {
  clients: Client[];
  navigate: (s: Screen) => void;
  openClient: (id: number) => void;
}

export function ProducerDashboard({ clients, navigate, openClient }: ProducerDashboardProps) {
  const contratsActifs = clients.flatMap((c) => c.contrats).filter((c) => c.statut === "Actif").length;
  const contratsExpires = clients.flatMap((c) => c.contrats).filter((c) => c.statut === "Expiré").length;

  const urgentes = useMemo(
    () =>
      clients
        .flatMap((c) =>
          c.contrats
            .filter((ct) => ct.statut === "Actif" && daysUntil(ct.echeance) >= 0 && daysUntil(ct.echeance) <= 7)
            .map((ct) => ({ client: c, contrat: ct, days: daysUntil(ct.echeance) }))
        )
        .sort((a, b) => a.days - b.days),
    [clients]
  );

  const echeances30 = useMemo(
    () =>
      clients
        .flatMap((c) =>
          c.contrats
            .filter((ct) => ct.statut === "Actif" && daysUntil(ct.echeance) > 7 && daysUntil(ct.echeance) <= 30)
            .map((ct) => ({ client: c, contrat: ct, days: daysUntil(ct.echeance) }))
        )
        .sort((a, b) => a.days - b.days),
    [clients]
  );

  const [done, setDone] = useState<Set<string>>(new Set());

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex-shrink-0" style={{ background: COLORS.primary }}>
        <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
          Bonjour, <span className="font-semibold text-white">Mamadou</span> 👋
        </p>
        <h1 className="font-montserrat font-extrabold text-xl mt-0.5" style={{ color: "#fff" }}>
          Tableau de bord
        </h1>
        <p className="font-jetbrains text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
          {fmtDate(TODAY_STR)}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20" style={{ background: COLORS.bg }}>
        {/* KPIs */}
        <div className="px-4 pt-4">
          <div className="flex gap-3">
            <KPICard
              label="Clients actifs"
              value={clients.length}
              icon={<Users size={18} />}
              color={COLORS.primary}
            />
            <KPICard
              label="Contrats actifs"
              value={contratsActifs}
              icon={<ShieldCheck size={18} />}
              color={COLORS.success}
            />
            <KPICard
              label="Expirés"
              value={contratsExpires}
              icon={<AlertTriangle size={18} />}
              alert={contratsExpires > 0}
            />
          </div>
        </div>

        {/* Relances urgentes */}
        <div className="px-4 pt-5">
          <SectionHeader
            title={`Relances urgentes (${urgentes.length})`}
            action="Toutes"
            onAction={() => navigate("prod_relances")}
          />
          {urgentes.length === 0 ? (
            <div className="bg-white rounded-xl p-4 text-center mb-1" style={{ border: `1px solid ${COLORS.border}` }}>
              <Check size={22} color={COLORS.success} className="mx-auto mb-1" />
              <p className="font-inter text-sm" style={{ color: COLORS.muted }}>
                Aucune relance urgente — bonne journée !
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {urgentes.map(({ client, contrat, days }) => {
                const k = `${client.id}-${contrat.id}`;
                const isDone = done.has(k);
                return (
                  <div
                    key={k}
                    className="bg-white rounded-xl p-3 flex items-center gap-3"
                    style={{
                      border: `1.5px solid ${isDone ? COLORS.border : COLORS.alert}`,
                      opacity: isDone ? 0.6 : 1,
                    }}
                  >
                    <button
                      onClick={() =>
                        setDone((p) => {
                          const n = new Set(p);
                          isDone ? n.delete(k) : n.add(k);
                          return n;
                        })
                      }
                    >
                      {isDone ? <CheckSquare size={20} color={COLORS.success} /> : <Square size={20} color={COLORS.alert} />}
                    </button>
                    <div className="flex-1 min-w-0" onClick={() => openClient(client.id)}>
                      <div className="flex items-center gap-2">
                        <p className="font-montserrat font-bold text-sm" style={{ color: COLORS.text }}>
                          {client.prenom} {client.nom}
                        </p>
                        <span
                          className="font-jetbrains text-xs font-bold px-1.5 py-0.5 rounded"
                          style={{ background: "#FEE2E2", color: COLORS.alert }}
                        >
                          J-{days}
                        </span>
                      </div>
                      <p className="font-inter text-xs mt-0.5" style={{ color: COLORS.muted }}>
                        {contrat.type} · {contrat.numero}
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <a href={`tel:${client.tel}`} className="p-2 rounded-lg" style={{ background: "#DCFCE7" }}>
                        <Phone size={15} color={COLORS.success} />
                      </a>
                      <a href={`sms:${client.tel}`} className="p-2 rounded-lg" style={{ background: "#EFF6FF" }}>
                        <MessageSquare size={15} color={COLORS.secondary} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Échéances 30j */}
        <div className="px-4 pt-5">
          <SectionHeader
            title="Prochaines échéances (30j)"
            action="Voir tout"
            onAction={() => navigate("prod_echeances")}
          />
          <div className="flex flex-col gap-2">
            {echeances30.slice(0, 4).map(({ client, contrat, days }) => (
              <button
                key={contrat.id}
                className="bg-white rounded-xl p-3 flex items-center gap-3 text-left w-full"
                style={{ border: `1px solid ${COLORS.border}` }}
                onClick={() => openClient(client.id)}
              >
                <div className="p-2 rounded-lg" style={{ background: "#F0F2F5" }}>
                  <ContractIcon type={contrat.type} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-montserrat font-semibold text-sm truncate" style={{ color: COLORS.text }}>
                    {client.prenom} {client.nom}
                  </p>
                  <p className="font-inter text-xs" style={{ color: COLORS.muted }}>
                    {contrat.type}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className="font-jetbrains text-xs font-semibold"
                    style={{ color: days <= 14 ? COLORS.orange : COLORS.muted }}
                  >
                    J-{days}
                  </p>
                  <p className="font-jetbrains text-xs" style={{ color: COLORS.muted }}>
                    {fmtDate(contrat.echeance)}
                  </p>
                </div>
              </button>
            ))}
            {echeances30.length === 0 && (
              <p className="font-inter text-sm text-center py-3" style={{ color: COLORS.muted }}>
                Aucune échéance dans les 30 prochains jours
              </p>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="px-4 pt-5 pb-2">
          <button
            className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 font-montserrat font-bold text-sm"
            style={{ background: COLORS.success, color: "#fff" }}
            onClick={() => navigate("prod_client_new")}
          >
            <UserPlus size={18} /> Nouveau client
          </button>
        </div>
      </div>
    </div>
  );
}