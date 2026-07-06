import { useState } from "react";
import { ArrowLeft, Phone, MessageSquare, Target, UserCheck, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { COLORS } from "../../../shared/constants/colors";
import { usePerson, useUpdatePerson, useConvertToClient } from "../../people/hooks/usePeople";
import type { ApiError } from "../../../lib/api";

type NiveauInteret = 'CHAUD' | 'TIEDE' | 'FROID';

const NIVEAU_CFG: Record<NiveauInteret | 'null', { label: string; color: string; bg: string }> = {
  FROID: { label: "Froid",  color: COLORS.muted,   bg: "#F3F4F6" },
  TIEDE: { label: "Tiède",  color: COLORS.orange,  bg: "#FEF3C7" },
  CHAUD: { label: "Chaud",  color: COLORS.alert,   bg: "#FEE2E2" },
  null:  { label: "?",      color: COLORS.muted,   bg: "#F3F4F6" },
};

export default function ProspectDetail() {
  const { id }           = useParams<{ id: string }>();
  const navigate         = useNavigate();
  const personQ          = usePerson(id!);
  const updatePerson     = useUpdatePerson();
  const convertToClient  = useConvertToClient();
  const [confirmConvert, setConfirmConvert] = useState(false);

  const prospect = personQ.data?.data;

  if (personQ.isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-4 py-3" style={{ background: COLORS.secondary }}>
          <button type="button" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} color="#fff" />
          </button>
          <h1 className="font-montserrat font-bold text-lg" style={{ color: "#fff" }}>Chargement…</h1>
        </div>
        <div className="flex-1 flex items-center justify-center" style={{ background: COLORS.bg }}>
          <Loader2 size={28} color={COLORS.muted} className="animate-spin" />
        </div>
      </div>
    );
  }

  if (!prospect) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-4 py-3" style={{ background: COLORS.secondary }}>
          <button type="button" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} color="#fff" />
          </button>
          <h1 className="font-montserrat font-bold text-lg" style={{ color: "#fff" }}>Prospect introuvable</h1>
        </div>
        <div className="flex-1 flex items-center justify-center" style={{ background: COLORS.bg }}>
          <p className="font-inter text-sm" style={{ color: COLORS.muted }}>Ce prospect n'existe pas ou a été supprimé.</p>
        </div>
      </div>
    );
  }

  const niveauKey = (prospect.niveau_interet ?? 'null') as keyof typeof NIVEAU_CFG;
  const nc        = NIVEAU_CFG[niveauKey] ?? NIVEAU_CFG['null'];

  function handleChangeNiveau(niveau: NiveauInteret) {
    updatePerson.mutate({ id: prospect!.id, data: { niveau_interet: niveau } });
  }

  function handleConvert() {
    convertToClient.mutate(prospect!.id, {
      onSuccess: () => navigate("/clients", { replace: true }),
      onError: (err) => {
        const apiErr = err as ApiError;
        alert(apiErr.message ?? "Erreur lors de la conversion.");
      },
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* En-tête */}
      <div style={{ background: COLORS.secondary }}>
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button type="button" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} color="#fff" />
          </button>
          <div className="flex-1">
            <h1 className="font-montserrat font-extrabold text-lg" style={{ color: "#fff" }}>
              {prospect.full_name}
            </h1>
            <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              Fiche prospect
            </p>
          </div>
          <span
            className="font-inter text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: nc.bg, color: nc.color }}
          >
            {nc.label}
          </span>
        </div>

        {/* Actions rapides */}
        <div className="px-4 pb-4 flex gap-2">
          <a
            href={`tel:${prospect.telephone}`}
            aria-label={`Appeler ${prospect.full_name}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-montserrat font-bold text-sm"
            style={{ background: COLORS.success, color: "#fff" }}
          >
            <Phone size={15} /> Appeler
          </a>
          <a
            href={`sms:${prospect.telephone}`}
            aria-label={`Envoyer un SMS à ${prospect.full_name}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-montserrat font-bold text-sm"
            style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
          >
            <MessageSquare size={15} /> SMS
          </a>
        </div>
      </div>

      {/* Corps */}
      <div className="flex-1 overflow-y-auto pb-28" style={{ background: COLORS.bg }}>
        {/* Informations */}
        <div className="mx-4 mt-4 bg-white rounded-xl p-4" style={{ border: `1px solid ${COLORS.border}` }}>
          <p className="font-montserrat font-bold text-sm mb-3" style={{ color: COLORS.text }}>
            Informations
          </p>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <Phone size={14} color={COLORS.muted} />
              <span className="font-jetbrains text-sm" style={{ color: COLORS.text }}>
                {prospect.telephone}
              </span>
            </div>
            {prospect.email && (
              <div className="flex items-center gap-2">
                <Target size={14} color={COLORS.muted} />
                <span className="font-inter text-sm" style={{ color: COLORS.text }}>
                  {prospect.email}
                </span>
              </div>
            )}
            {prospect.source && (
              <div className="flex items-center gap-2">
                <UserCheck size={14} color={COLORS.muted} />
                <span className="font-inter text-sm" style={{ color: COLORS.text }}>
                  Source :{" "}
                </span>
                <span
                  className="font-inter text-sm font-semibold px-2 py-0.5 rounded"
                  style={{ background: "#F0F2F5", color: COLORS.muted }}
                >
                  {prospect.source}
                </span>
              </div>
            )}
            {prospect.profession && (
              <div className="flex items-center gap-2">
                <span className="font-inter text-sm" style={{ color: COLORS.muted }}>
                  Profession :
                </span>
                <span className="font-inter text-sm font-semibold" style={{ color: COLORS.text }}>
                  {prospect.profession}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Observations */}
        {prospect.observations && (
          <div className="mx-4 mt-3 bg-white rounded-xl p-4" style={{ border: `1px solid ${COLORS.border}` }}>
            <p className="font-montserrat font-bold text-sm mb-2" style={{ color: COLORS.text }}>
              Observations
            </p>
            <p className="font-inter text-sm" style={{ color: COLORS.muted }}>
              {prospect.observations}
            </p>
          </div>
        )}

        {/* Changer température */}
        <div className="mx-4 mt-3 bg-white rounded-xl p-4" style={{ border: `1px solid ${COLORS.border}` }}>
          <p className="font-montserrat font-bold text-sm mb-3" style={{ color: COLORS.text }}>
            Température
          </p>
          <div className="flex gap-2">
            {(["FROID", "TIEDE", "CHAUD"] as NiveauInteret[]).map((n) => {
              const cfg      = NIVEAU_CFG[n];
              const isActive = prospect.niveau_interet === n;
              return (
                <button
                  key={n}
                  type="button"
                  disabled={updatePerson.isPending}
                  className="flex-1 py-2 rounded-xl font-inter font-semibold text-sm disabled:opacity-60"
                  style={{
                    background: isActive ? cfg.color : cfg.bg,
                    color:      isActive ? "#fff" : cfg.color,
                    border:     `1.5px solid ${cfg.color}`,
                  }}
                  onClick={() => handleChangeNiveau(n)}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Convertir en client */}
      {prospect.statut === "PROSPECT" && (
        <div
          className="px-4 py-3 flex-shrink-0"
          style={{ background: "#fff", borderTop: `1px solid ${COLORS.border}` }}
        >
          {!confirmConvert ? (
            <button
              type="button"
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
                type="button"
                className="flex-1 rounded-xl py-3.5 font-montserrat font-bold text-sm"
                style={{ background: "#F3F4F6", color: COLORS.muted }}
                onClick={() => setConfirmConvert(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={convertToClient.isPending}
                className="flex-1 rounded-xl py-3.5 font-montserrat font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: COLORS.gold, color: "#fff" }}
                onClick={handleConvert}
              >
                {convertToClient.isPending
                  ? <Loader2 size={16} className="animate-spin" />
                  : "Confirmer →"
                }
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
