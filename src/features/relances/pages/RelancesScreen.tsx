import { useState } from "react";
import { Plus, Check, Square, CheckSquare, Phone, MessageSquare, Loader2 } from "lucide-react";
import { COLORS } from "../../../shared/constants/colors";
import { fmtDate } from "../../../shared/utils/date";
import { ScreenHeader } from "../../../shared/components/layout/ScreenHeader";
import { SectionHeader } from "../../../shared/components/layout/SectionHeader";
import { Avatar } from "../../../shared/components/ui/Avatar";
import { LogModal } from "../components/LogModal";
import { useRelancesToday, useRelances, useCompleteRelance } from "../hooks/useRelances";

export default function RelancesScreen() {
  const [showModal,   setShowModal]   = useState(false);
  const [completing,  setCompleting]  = useState<Set<string>>(new Set());

  const today      = useRelancesToday();
  const historique = useRelances({ statut: "EFFECTUEE", per_page: 50 });
  const complete   = useCompleteRelance();

  const urgentes   = today.data?.data      ?? [];
  const historiqList = historique.data?.data ?? [];

  function handleComplete(id: string) {
    setCompleting((prev) => new Set([...prev, id]));
    complete.mutate(
      { id, resultat: "Effectuée" },
      {
        onSettled: () =>
          setCompleting((prev) => {
            const n = new Set(prev);
            n.delete(id);
            return n;
          }),
      }
    );
  }

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
        {/* --- Section : À faire aujourd'hui --- */}
        <div className="px-4 pt-4">
          <SectionHeader title={`À faire (${urgentes.length})`} />

          {today.isLoading && (
            <div className="flex justify-center py-6">
              <Loader2 size={22} color={COLORS.muted} className="animate-spin" />
            </div>
          )}

          {!today.isLoading && urgentes.length === 0 && (
            <div
              className="bg-white rounded-xl p-4 text-center mb-4"
              style={{ border: `1px solid ${COLORS.border}` }}
            >
              <Check size={22} color={COLORS.success} className="mx-auto mb-1" />
              <p className="font-inter text-sm" style={{ color: COLORS.muted }}>
                Toutes les relances sont effectuées ✓
              </p>
            </div>
          )}

          {urgentes.length > 0 && (
            <div className="flex flex-col gap-2 mb-4">
              {urgentes.map((r) => {
                const isDone = completing.has(r.id);
                return (
                  <div
                    key={r.id}
                    className="bg-white rounded-xl p-3.5 flex items-center gap-3"
                    style={{
                      border: `1.5px solid ${isDone ? COLORS.border : COLORS.alert}`,
                      opacity: isDone ? 0.65 : 1,
                    }}
                  >
                    <button onClick={() => handleComplete(r.id)} disabled={isDone}>
                      {isDone ? (
                        <CheckSquare size={22} color={COLORS.success} />
                      ) : (
                        <Square size={22} color={COLORS.alert} />
                      )}
                    </button>

                    <div className="flex-1">
                      <p className="font-montserrat font-bold text-sm" style={{ color: COLORS.text }}>
                        {r.person?.full_name ?? "—"}
                      </p>
                      <p className="font-inter text-xs" style={{ color: COLORS.muted }}>
                        {r.type}
                        {r.date_planifiee && (
                          <>
                            {" · "}
                            <span className="font-jetbrains" style={{ color: COLORS.alert }}>
                              {fmtDate(r.date_planifiee)}
                            </span>
                          </>
                        )}
                      </p>
                      {r.note && (
                        <p className="font-inter text-xs mt-0.5" style={{ color: COLORS.muted }}>
                          {r.note}
                        </p>
                      )}
                    </div>

                    {r.person?.telephone && (
                      <a
                        href={`tel:${r.person.telephone}`}
                        aria-label={`Appeler ${r.person.full_name}`}
                        className="p-2 rounded-xl"
                        style={{ background: COLORS.primary }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone size={16} color="#fff" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* --- Section : Historique --- */}
        <div className="px-4">
          <SectionHeader title="Historique" />

          {historique.isLoading && (
            <div className="flex justify-center py-6">
              <Loader2 size={22} color={COLORS.muted} className="animate-spin" />
            </div>
          )}

          <div className="flex flex-col gap-2 pb-4">
            {historiqList.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-xl p-4"
                style={{ border: `1px solid ${COLORS.border}` }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Avatar
                      nom={r.person?.nom ?? "?"}
                      prenom={r.person?.prenom ?? ""}
                      size={28}
                      bg={COLORS.secondary}
                    />
                    <p className="font-montserrat font-bold text-sm" style={{ color: COLORS.text }}>
                      {r.person?.full_name ?? "—"}
                    </p>
                  </div>
                  <span className="font-jetbrains text-xs" style={{ color: COLORS.muted }}>
                    {fmtDate(r.date_effectuee ?? r.date_planifiee ?? r.created_at)}
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
                  {r.resultat && (
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
                  )}
                </div>

                {r.note && (
                  <p className="font-inter text-xs mt-1.5" style={{ color: COLORS.text }}>
                    {r.note}
                  </p>
                )}
              </div>
            ))}

            {!historique.isLoading && historiqList.length === 0 && (
              <p className="font-inter text-sm text-center py-6" style={{ color: COLORS.muted }}>
                Aucun historique pour le moment.
              </p>
            )}
          </div>
        </div>
      </div>

      {showModal && <LogModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
