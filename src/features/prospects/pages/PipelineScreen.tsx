import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../../../shared/constants/colors";
import { ScreenHeader } from "../../../shared/components/layout/ScreenHeader";
import { usePeople } from "../../people/hooks/usePeople";
import { useUpdatePerson } from "../../people/hooks/usePeople";
import type { Person } from "../../../lib/api-types";

type NiveauInteret = 'CHAUD' | 'TIEDE' | 'FROID';

const COLONNES: NiveauInteret[] = ['FROID', 'TIEDE', 'CHAUD'];

const CFG: Record<NiveauInteret, { label: string; color: string; bg: string; headerBg: string }> = {
  FROID: { label: 'Froid',  color: COLORS.muted,   bg: '#F9FAFB', headerBg: '#F3F4F6' },
  TIEDE: { label: 'Tiède',  color: COLORS.orange,  bg: '#FFFBEB', headerBg: '#FEF3C7' },
  CHAUD: { label: 'Chaud',  color: COLORS.alert,   bg: '#FFF5F5', headerBg: '#FEE2E2' },
};

export default function PipelineScreen() {
  const navigate    = useNavigate();
  const [moving, setMoving] = useState<string | null>(null);

  const { data, isLoading, isError } = usePeople({ statut: 'PROSPECT', per_page: 100 });
  const updatePerson = useUpdatePerson();

  const prospects = data?.data ?? [];

  function move(person: Person, to: NiveauInteret) {
    setMoving(null);
    updatePerson.mutate({ id: person.id, data: { niveau_interet: to } });
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <ScreenHeader title="Pipeline Kanban" />
        <div className="flex-1 flex items-center justify-center" style={{ background: COLORS.bg }}>
          <Loader2 size={28} color={COLORS.muted} className="animate-spin" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col h-full">
        <ScreenHeader title="Pipeline Kanban" />
        <div className="flex-1 flex items-center justify-center" style={{ background: COLORS.bg }}>
          <p className="font-inter text-sm" style={{ color: COLORS.alert }}>
            Impossible de charger le pipeline.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader
        title="Pipeline Kanban"
        action={
          <button
            className="p-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.2)" }}
            onClick={() => navigate("/pipeline/nouveau")}
          >
            <Plus size={20} color="#fff" />
          </button>
        }
      />

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-20" style={{ background: COLORS.bg }}>
        <div className="flex gap-3 px-4 pt-4 h-full" style={{ minWidth: 720 }}>
          {COLONNES.map((niveau) => {
            const c = CFG[niveau];
            const cols = prospects.filter((p) => (p.niveau_interet ?? 'FROID') === niveau);
            return (
              <div
                key={niveau}
                className="flex flex-col rounded-xl overflow-hidden flex-shrink-0"
                style={{ width: 226, background: c.bg, border: `1.5px solid ${COLORS.border}` }}
              >
                {/* En-tête colonne */}
                <div className="px-4 py-3 flex items-center justify-between" style={{ background: c.headerBg }}>
                  <span className="font-montserrat font-bold text-sm" style={{ color: c.color }}>
                    {c.label}
                  </span>
                  <span
                    className="font-jetbrains text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: c.color, color: "#fff" }}
                  >
                    {cols.length}
                  </span>
                </div>

                {/* Cartes */}
                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                  {cols.map((p) => (
                    <button
                      key={p.id}
                      className="bg-white rounded-xl p-3 text-left w-full"
                      style={{
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                        border: `1px solid ${COLORS.border}`,
                      }}
                      onClick={() => {
                        if (moving !== p.id) navigate(`/pipeline/${p.id}`);
                      }}
                    >
                      <p className="font-montserrat font-bold text-sm" style={{ color: COLORS.text }}>
                        {p.full_name}
                      </p>
                      <p className="font-jetbrains text-xs mt-0.5" style={{ color: COLORS.muted }}>
                        {p.telephone}
                      </p>

                      <div className="flex gap-1 mt-2 flex-wrap">
                        {p.source && (
                          <span
                            className="font-inter text-xs px-1.5 py-0.5 rounded"
                            style={{ background: "#F0F2F5", color: COLORS.muted }}
                          >
                            {p.source}
                          </span>
                        )}
                        {p.profession && (
                          <span
                            className="font-inter text-xs px-1.5 py-0.5 rounded"
                            style={{ background: "#EFF6FF", color: COLORS.secondary }}
                          >
                            {p.profession}
                          </span>
                        )}
                      </div>

                      {/* Contrôles de déplacement */}
                      {moving === p.id ? (
                        <div className="flex gap-1 mt-2">
                          {COLONNES.filter((n) => n !== niveau).map((n) => (
                            <button
                              key={n}
                              className="flex-1 font-inter text-xs py-1.5 rounded-lg"
                              style={{ background: CFG[n].color, color: "#fff" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                move(p, n);
                              }}
                            >
                              → {CFG[n].label}
                            </button>
                          ))}
                          <button
                            className="font-inter text-xs px-2 py-1.5 rounded-lg"
                            style={{ background: "#F3F4F6", color: COLORS.muted }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setMoving(null);
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          className="mt-2 font-inter text-xs"
                          style={{ color: COLORS.secondary }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setMoving(p.id);
                          }}
                        >
                          Déplacer →
                        </button>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
