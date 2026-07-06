import { useState } from "react";
import {
  Users, ShieldCheck, AlertTriangle, Check,
  Square, CheckSquare, Phone, MessageSquare, UserPlus, Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../../../shared/constants/colors";
import { TODAY_STR, fmtDate } from "../../../shared/utils/date";
import { KPICard } from "../../../shared/components/ui/KPICard";
import { SectionHeader } from "../../../shared/components/layout/SectionHeader";
import { useAuth } from "../../../contexts/AuthContext";
import { useDashboard } from "../hooks/useDashboard";
import { useRelancesToday, useCompleteRelance } from "../../relances/hooks/useRelances";

export default function ProducerDashboard() {
  const navigate   = useNavigate();
  const { user }   = useAuth();
  const prenom     = user?.nom.split(" ")[0] ?? "Agent";

  const dashQ   = useDashboard();
  const todayQ  = useRelancesToday();
  const complete = useCompleteRelance();

  const [completing, setCompleting] = useState<Set<string>>(new Set());

  const data     = dashQ.data;
  const relances = todayQ.data?.data ?? [];

  function handleComplete(id: string) {
    setCompleting((p) => new Set([...p, id]));
    complete.mutate(
      { id, resultat: "Effectuée" },
      {
        onSettled: () =>
          setCompleting((p) => {
            const n = new Set(p);
            n.delete(id);
            return n;
          }),
      },
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* En-tête */}
      <div className="px-4 pt-5 pb-4 flex-shrink-0" style={{ background: COLORS.primary }}>
        <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
          Bonjour, <span className="font-semibold text-white">{prenom}</span> 👋
        </p>
        <h1 className="font-montserrat font-extrabold text-xl mt-0.5" style={{ color: "#fff" }}>
          Tableau de bord
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
            <div className="flex gap-3">
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
                label="Expirent 30j"
                value={data?.portfolio.contrats.expirant_30j ?? 0}
                icon={<AlertTriangle size={18} />}
                alert={(data?.portfolio.contrats.expirant_30j ?? 0) > 0}
              />
            </div>
          )}
        </div>

        {/* Relances du jour */}
        <div className="px-4 pt-5">
          <SectionHeader
            title={`Relances du jour (${relances.length})`}
            action="Toutes"
            onAction={() => navigate("/relances")}
          />

          {todayQ.isLoading && (
            <div className="flex justify-center py-4">
              <Loader2 size={20} color={COLORS.muted} className="animate-spin" />
            </div>
          )}

          {!todayQ.isLoading && relances.length === 0 && (
            <div
              className="bg-white rounded-xl p-4 text-center mb-1"
              style={{ border: `1px solid ${COLORS.border}` }}
            >
              <Check size={22} color={COLORS.success} className="mx-auto mb-1" />
              <p className="font-inter text-sm" style={{ color: COLORS.muted }}>
                Aucune relance aujourd'hui — bonne journée !
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {relances.map((r) => {
              const isDone = completing.has(r.id);
              return (
                <div
                  key={r.id}
                  className="bg-white rounded-xl p-3 flex items-center gap-3"
                  style={{
                    border:   `1.5px solid ${isDone ? COLORS.border : COLORS.alert}`,
                    opacity:  isDone ? 0.6 : 1,
                  }}
                >
                  <button type="button" onClick={() => handleComplete(r.id)} disabled={isDone}>
                    {isDone
                      ? <CheckSquare size={20} color={COLORS.success} />
                      : <Square      size={20} color={COLORS.alert} />
                    }
                  </button>

                  <button
                    type="button"
                    className="flex-1 min-w-0 text-left"
                    onClick={() => r.personne_id && navigate(`/clients/${r.personne_id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <p className="font-montserrat font-bold text-sm truncate" style={{ color: COLORS.text }}>
                        {r.person?.full_name ?? "—"}
                      </p>
                      <span
                        className="font-inter text-xs px-1.5 py-0.5 rounded flex-shrink-0"
                        style={{ background: "#EFF6FF", color: COLORS.secondary }}
                      >
                        {r.type}
                      </span>
                    </div>
                    {r.note && (
                      <p className="font-inter text-xs mt-0.5 truncate" style={{ color: COLORS.muted }}>
                        {r.note}
                      </p>
                    )}
                  </button>

                  <div className="flex gap-1.5 flex-shrink-0">
                    <a
                      href={`tel:${r.person?.telephone}`}
                      aria-label={`Appeler ${r.person?.full_name}`}
                      className="p-2 rounded-lg"
                      style={{ background: "#DCFCE7" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone size={15} color={COLORS.success} />
                    </a>
                    <a
                      href={`sms:${r.person?.telephone}`}
                      aria-label={`SMS à ${r.person?.full_name}`}
                      className="p-2 rounded-lg"
                      style={{ background: "#EFF6FF" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MessageSquare size={15} color={COLORS.secondary} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Échéances */}
        <div className="px-4 pt-5">
          <SectionHeader
            title="Prochaines échéances"
            action="Voir tout"
            onAction={() => navigate("/echeances")}
          />
          <div
            className="bg-white rounded-xl p-4 flex items-center justify-between"
            style={{ border: `1px solid ${COLORS.border}` }}
          >
            <div>
              <p className="font-jetbrains font-bold text-2xl" style={{ color: COLORS.orange }}>
                {data?.portfolio.contrats.expirant_30j ?? "—"}
              </p>
              <p className="font-inter text-xs mt-0.5" style={{ color: COLORS.muted }}>
                contrat{(data?.portfolio.contrats.expirant_30j ?? 0) !== 1 ? "s" : ""} expirent dans 30j
              </p>
            </div>
            <button
              type="button"
              className="font-inter text-sm font-semibold px-3 py-2 rounded-xl"
              style={{ background: "#EFF6FF", color: COLORS.secondary }}
              onClick={() => navigate("/echeances")}
            >
              Gérer →
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="px-4 pt-5 pb-2">
          <button
            type="button"
            className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 font-montserrat font-bold text-sm"
            style={{ background: COLORS.success, color: "#fff" }}
            onClick={() => navigate("/clients/nouveau")}
          >
            <UserPlus size={18} /> Nouveau client
          </button>
        </div>
      </div>
    </div>
  );
}
