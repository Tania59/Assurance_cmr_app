import { useState } from "react";
import { Plus, Calendar } from "lucide-react";
import type { Prospect, Screen } from "../../../shared/types";
import { COLORS } from "../../../shared/constants/colors";
import { fmtDate } from "../../../shared/utils/date";
import { ScreenHeader } from "../../../shared/components/layout/ScreenHeader";

interface PipelineScreenProps {
  prospects: Prospect[];
  setProspects: (fn: (p: Prospect[]) => Prospect[]) => void;
  navigate: (s: Screen) => void;
}

export function PipelineScreen({ prospects, setProspects, navigate }: PipelineScreenProps) {
  const [moving, setMoving] = useState<number | null>(null);
  const statuts: Prospect["statut"][] = ["Froid", "Tiède", "Chaud"];
  const cfg: Record<string, { color: string; bg: string; headerBg: string }> = {
    Froid: { color: COLORS.muted, bg: "#F9FAFB", headerBg: "#F3F4F6" },
    Tiède: { color: COLORS.orange, bg: "#FFFBEB", headerBg: "#FEF3C7" },
    Chaud: { color: COLORS.alert, bg: "#FFF5F5", headerBg: "#FEE2E2" },
  };

  function move(id: number, to: Prospect["statut"]) {
    setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, statut: to } : p)));
    setMoving(null);
  }

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader
        title="Pipeline Kanban"
        action={
          <button
            className="p-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.2)" }}
            onClick={() => navigate("comm_prospect_new")}
          >
            <Plus size={20} color="#fff" />
          </button>
        }
      />
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-20" style={{ background: COLORS.bg }}>
        <div className="flex gap-3 px-4 pt-4 h-full" style={{ minWidth: 720 }}>
          {statuts.map((s) => {
            const cols = prospects.filter((p) => p.statut === s);
            const c = cfg[s];
            return (
              <div
                key={s}
                className="flex flex-col rounded-xl overflow-hidden flex-shrink-0"
                style={{ width: 226, background: c.bg, border: `1.5px solid ${COLORS.border}` }}
              >
                <div className="px-4 py-3 flex items-center justify-between" style={{ background: c.headerBg }}>
                  <span className="font-montserrat font-bold text-sm" style={{ color: c.color }}>
                    {s}
                  </span>
                  <span
                    className="font-jetbrains text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: c.color, color: "#fff" }}
                  >
                    {cols.length}
                  </span>
                </div>
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
                        if (moving !== p.id) navigate("comm_prospect_detail");
                      }}
                    >
                      <p className="font-montserrat font-bold text-sm" style={{ color: COLORS.text }}>
                        {p.nom}
                      </p>
                      <p className="font-jetbrains text-xs mt-0.5" style={{ color: COLORS.muted }}>
                        {p.tel}
                      </p>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        <span
                          className="font-inter text-xs px-1.5 py-0.5 rounded"
                          style={{ background: "#EFF6FF", color: COLORS.secondary }}
                        >
                          {p.interet || "—"}
                        </span>
                        <span
                          className="font-inter text-xs px-1.5 py-0.5 rounded"
                          style={{ background: "#F0F2F5", color: COLORS.muted }}
                        >
                          {p.source || "—"}
                        </span>
                      </div>
                      {p.rdv && (
                        <p className="font-jetbrains text-xs mt-2 flex items-center gap-1" style={{ color: COLORS.gold }}>
                          <Calendar size={11} /> {fmtDate(p.rdv)}
                        </p>
                      )}
                      {moving === p.id ? (
                        <div className="flex gap-1 mt-2">
                          {statuts
                            .filter((st) => st !== s)
                            .map((st) => (
                              <button
                                key={st}
                                className="flex-1 font-inter text-xs py-1.5 rounded-lg"
                                style={{ background: cfg[st].color, color: "#fff" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  move(p.id, st);
                                }}
                              >
                                → {st}
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