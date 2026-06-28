import { useState } from "react";
import { ArrowLeft, Phone, MessageSquare, Target, UserCheck, Calendar } from "lucide-react";
import type { Client, Prospect } from "../../../shared/types";
import { COLORS } from "../../../shared/constants/colors";
import { fmtDate } from "../../../shared/utils/date";

interface ProspectDetailProps {
  prospect: Prospect;
  onBack: () => void;
  onConvert: (pre: Partial<Client>) => void;
  onUpdateStatut: (id: number, s: Prospect["statut"]) => void;
}

export function ProspectDetail({
  prospect,
  onBack,
  onConvert,
  onUpdateStatut,
}: ProspectDetailProps) {
  const [confirmConvert, setConfirmConvert] = useState(false);
  const statutCfg: Record<string, { color: string; bg: string }> = {
    Froid: { color: COLORS.muted, bg: "#F3F4F6" },
    Tiède: { color: COLORS.orange, bg: "#FEF3C7" },
    Chaud: { color: COLORS.alert, bg: "#FEE2E2" },
    Converti: { color: COLORS.success, bg: "#DCFCE7" },
  };
  const sc = statutCfg[prospect.statut];

  return (
    <div className="flex flex-col h-full">
      <div style={{ background: COLORS.secondary }}>
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button onClick={onBack}>
            <ArrowLeft size={22} color="#fff" />
          </button>
          <div className="flex-1">
            <h1 className="font-montserrat font-extrabold text-lg" style={{ color: "#fff" }}>
              {prospect.nom}
            </h1>
            <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              Fiche prospect
            </p>
          </div>
          <span
            className="font-inter text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: sc.bg, color: sc.color }}
          >
            {prospect.statut}
          </span>
        </div>
        {/* Actions rapides */}
        <div className="px-4 pb-4 flex gap-2">
          <a
            href={`tel:${prospect.tel}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-montserrat font-bold text-sm"
            style={{ background: COLORS.success, color: "#fff" }}
          >
            <Phone size={15} /> Appeler
          </a>
          <a
            href={`sms:${prospect.tel}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-montserrat font-bold text-sm"
            style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
          >
            <MessageSquare size={15} /> SMS
          </a>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-28" style={{ background: COLORS.bg }}>
        {/* Infos */}
        <div className="mx-4 mt-4 bg-white rounded-xl p-4" style={{ border: `1px solid ${COLORS.border}` }}>
          <p className="font-montserrat font-bold text-sm mb-3" style={{ color: COLORS.text }}>
            Informations
          </p>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <Phone size={14} color={COLORS.muted} />
              <span className="font-jetbrains text-sm" style={{ color: COLORS.text }}>
                {prospect.tel}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target size={14} color={COLORS.muted} />
              <span className="font-inter text-sm" style={{ color: COLORS.text }}>
                Intérêt :{" "}
              </span>
              <span
                className="font-inter text-sm font-semibold px-2 py-0.5 rounded"
                style={{ background: "#EFF6FF", color: COLORS.secondary }}
              >
                {prospect.interet || "Non défini"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck size={14} color={COLORS.muted} />
              <span className="font-inter text-sm" style={{ color: COLORS.text }}>
                Source :{" "}
              </span>
              <span
                className="font-inter text-sm font-semibold px-2 py-0.5 rounded"
                style={{ background: "#F0F2F5", color: COLORS.muted }}
              >
                {prospect.source || "Non précisée"}
              </span>
            </div>
            {prospect.rdv && (
              <div className="flex items-center gap-2">
                <Calendar size={14} color={COLORS.gold} />
                <span className="font-inter text-sm" style={{ color: COLORS.text }}>
                  RDV :{" "}
                </span>
                <span className="font-jetbrains text-sm font-semibold" style={{ color: COLORS.gold }}>
                  {fmtDate(prospect.rdv)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {prospect.note && (
          <div className="mx-4 mt-3 bg-white rounded-xl p-4" style={{ border: `1px solid ${COLORS.border}` }}>
            <p className="font-montserrat font-bold text-sm mb-2" style={{ color: COLORS.text }}>
              Notes
            </p>
            <p className="font-inter text-sm" style={{ color: COLORS.muted }}>
              {prospect.note}
            </p>
          </div>
        )}

        {/* Changer statut */}
        <div className="mx-4 mt-3 bg-white rounded-xl p-4" style={{ border: `1px solid ${COLORS.border}` }}>
          <p className="font-montserrat font-bold text-sm mb-3" style={{ color: COLORS.text }}>
            Température
          </p>
          <div className="flex gap-2">
            {(["Froid", "Tiède", "Chaud"] as const).map((s) => {
              const cfg = statutCfg[s];
              return (
                <button
                  key={s}
                  className="flex-1 py-2 rounded-xl font-inter font-semibold text-sm transition-all"
                  style={{
                    background: prospect.statut === s ? cfg.color : cfg.bg,
                    color: prospect.statut === s ? "#fff" : cfg.color,
                    border: `1.5px solid ${cfg.color}`,
                  }}
                  onClick={() => onUpdateStatut(prospect.id, s)}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Convertir en client */}
      {prospect.statut !== "Converti" && (
        <div className="px-4 py-3 flex-shrink-0" style={{ background: "#fff", borderTop: `1px solid ${COLORS.border}` }}>
          {!confirmConvert ? (
            <button
              className="w-full rounded-xl py-4 font-montserrat font-bold text-base"
              style={{ background: COLORS.gold, color: "#fff" }}
              onClick={() => setConfirmConvert(true)}
            >
              <UserCheck size={18} className="inline mr-2 -mt-0.5" />
              Convertir en client
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                className="flex-1 rounded-xl py-3.5 font-montserrat font-bold text-sm"
                style={{ background: "#F3F4F6", color: COLORS.muted }}
                onClick={() => setConfirmConvert(false)}
              >
                Annuler
              </button>
              <button
                className="flex-1 rounded-xl py-3.5 font-montserrat font-bold text-sm"
                style={{ background: COLORS.gold, color: "#fff" }}
                onClick={() => onConvert({ nom: prospect.nom, tel: prospect.tel })}
              >
                Confirmer →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}