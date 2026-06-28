import { useState, useMemo } from "react";
import { Plus, Check, Square, CheckSquare, Phone, MessageSquare } from "lucide-react";
import type  { Client } from "../../../shared/types";
import { COLORS } from "../../../shared/constants/colors";
import { fmtDate, daysUntil } from "../../../shared/utils/date";
import { ScreenHeader } from "../../../shared/components/layout/ScreenHeader";
import { SectionHeader } from "../../../shared/components/layout/SectionHeader";
import { Avatar } from "../../../shared/components/ui/Avatar";
import { LogModal } from "../components/LogModal";

interface RelancesScreenProps {
  clients: Client[];
}

export function RelancesScreen({ clients }: RelancesScreenProps) {
  const urgentes = useMemo(
    () =>
      clients
        .flatMap((c) =>
          c.contrats
            .filter(
              (ct) => ct.statut === "Actif" && daysUntil(ct.echeance) >= 0 && daysUntil(ct.echeance) <= 7
            )
            .map((ct) => ({ client: c, contrat: ct, days: daysUntil(ct.echeance) }))
        )
        .sort((a, b) => a.days - b.days),
    [clients]
  );

  const historique = useMemo(
    () =>
      clients
        .flatMap((c) => c.relances.map((r) => ({ client: c, ...r })))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [clients]
  );

  const [done, setDone] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader
        title="Relances"
        action={
          <button
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-inter font-semibold text-sm"
            style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
            onClick={() => setShowModal(true)}
          >
            <Plus size={15} /> Logger
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto pb-20" style={{ background: COLORS.bg }}>
        <div className="px-4 pt-4">
          <SectionHeader title={`À faire (${urgentes.length})`} />
          {urgentes.length === 0 ? (
            <div className="bg-white rounded-xl p-4 text-center mb-4" style={{ border: `1px solid ${COLORS.border}` }}>
              <Check size={22} color={COLORS.success} className="mx-auto mb-1" />
              <p className="font-inter text-sm" style={{ color: COLORS.muted }}>
                Toutes les relances sont effectuées ✓
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mb-4">
              {urgentes.map(({ client, contrat, days }) => {
                const k = `${client.id}-${contrat.id}`;
                const isDone = done.has(k);
                return (
                  <div
                    key={k}
                    className="bg-white rounded-xl p-3.5 flex items-center gap-3"
                    style={{
                      border: `1.5px solid ${isDone ? COLORS.border : COLORS.alert}`,
                      opacity: isDone ? 0.65 : 1,
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
                      {isDone ? (
                        <CheckSquare size={22} color={COLORS.success} />
                      ) : (
                        <Square size={22} color={COLORS.alert} />
                      )}
                    </button>
                    <div className="flex-1">
                      <p className="font-montserrat font-bold text-sm" style={{ color: COLORS.text }}>
                        {client.prenom} {client.nom}
                      </p>
                      <p className="font-inter text-xs" style={{ color: COLORS.muted }}>
                        {contrat.type} expire dans{" "}
                        <span className="font-jetbrains font-semibold" style={{ color: COLORS.alert }}>
                          {days}j
                        </span>
                      </p>
                    </div>
                    <a href={`tel:${client.tel}`} className="p-2 rounded-xl" style={{ background: COLORS.primary }}>
                      <Phone size={16} color="#fff" />
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="px-4">
          <SectionHeader title="Historique" />
          <div className="flex flex-col gap-2 pb-4">
            {historique.map((r, i) => (
              <div key={i} className="bg-white rounded-xl p-4" style={{ border: `1px solid ${COLORS.border}` }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Avatar nom={r.client.nom} prenom={r.client.prenom} size={28} bg={COLORS.secondary} />
                    <p className="font-montserrat font-bold text-sm" style={{ color: COLORS.text }}>
                      {r.client.prenom} {r.client.nom}
                    </p>
                  </div>
                  <span className="font-jetbrains text-xs" style={{ color: COLORS.muted }}>
                    {fmtDate(r.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {r.type === "Appel" ? (
                    <Phone size={13} color={COLORS.secondary} />
                  ) : (
                    <MessageSquare size={13} color={COLORS.secondary} />
                  )}
                  <span className="font-inter text-xs font-medium" style={{ color: COLORS.secondary }}>
                    {r.type}
                  </span>
                  <span
                    className="font-inter text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background:
                        r.resultat === "Positif"
                          ? "#DCFCE7"
                          : r.resultat === "À rappeler"
                          ? "#FEF3C7"
                          : "#F0F2F5",
                      color:
                        r.resultat === "Positif"
                          ? "#166534"
                          : r.resultat === "À rappeler"
                          ? "#92400E"
                          : COLORS.muted,
                    }}
                  >
                    {r.resultat}
                  </span>
                </div>
                <p className="font-inter text-xs mt-1.5" style={{ color: COLORS.text }}>
                  {r.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log modal */}
      {showModal && <LogModal onClose={() => setShowModal(false)} />}
    </div>
  );
}