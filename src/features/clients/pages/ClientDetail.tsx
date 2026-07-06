import { useState } from "react";
import {
  ArrowLeft, Phone, MessageSquare, Mail, MapPin, RefreshCw,
  Plus, FileText, X, Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { COLORS } from "../../../shared/constants/colors";
import { fmtDate, daysUntil } from "../../../shared/utils/date";
import { fmtMontant } from "../../../shared/utils/format";
import { Avatar } from "../../../shared/components/ui/Avatar";
import { ContractIcon } from "../../../shared/components/icons/ContractIcon";
import { usePerson } from "../../people/hooks/usePeople";
import { useContracts, useCreateContract } from "../../contracts/hooks/useContracts";
import { useRelances } from "../../relances/hooks/useRelances";
import type { Contract } from "../../../lib/api-types";
import type { ApiError } from "../../../lib/api";

// ── Types assurance (code backend → label UI) ─────────────────────────────────
const CONTRACT_TYPES = [
  { code: "AUTO",       label: "Auto" },
  { code: "SANTE",      label: "Santé" },
  { code: "HABITATION", label: "Habitation" },
  { code: "VOYAGE",     label: "Voyage" },
  { code: "RC_PRO",     label: "RC Pro" },
  { code: "VIE",        label: "Vie" },
];

// ── Badge statut contrat ──────────────────────────────────────────────────────
function ContractStatusBadge({ statut }: { statut: Contract["statut"] }) {
  const cfg: Record<Contract["statut"], { bg: string; text: string; label: string }> = {
    ACTIF:      { bg: "#DCFCE7", text: "#166534", label: "Actif" },
    RESILIE:    { bg: "#F3F4F6", text: "#4B5563", label: "Résilié" },
    SUSPENDU:   { bg: "#FEF3C7", text: "#92400E", label: "Suspendu" },
    EN_ATTENTE: { bg: "#FEF3C7", text: "#92400E", label: "En attente" },
    RENOUVELE:  { bg: "#DBEAFE", text: "#1E40AF", label: "Renouvelé" },
  };
  const s = cfg[statut] ?? { bg: "#F3F4F6", text: "#4B5563", label: statut };
  return (
    <span
      className="font-inter text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function ClientDetail() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();

  const personQ    = usePerson(id!);
  const contractsQ = useContracts({ personne_id: id });
  const relancesQ  = useRelances({ personne_id: id });
  const createContract = useCreateContract();

  const [tab, setTab] = useState<"contrats" | "relances" | "activites">("contrats");

  // Modal ajout contrat
  const [showModal, setShowModal] = useState(false);
  const [newCt, setNewCt] = useState({ type: "AUTO", prime: "", date_echeance: "" });
  const [ctErrors, setCtErrors] = useState<string[]>([]);

  const client   = personQ.data?.data;
  const contracts = contractsQ.data?.data ?? [];
  const relances  = relancesQ.data?.data  ?? [];

  function handleSaveContract() {
    const errs: string[] = [];
    if (!newCt.prime.trim())         errs.push("Prime requise");
    if (!newCt.date_echeance.trim()) errs.push("Date d'échéance requise");
    if (errs.length) { setCtErrors(errs); return; }

    createContract.mutate(
      {
        personne_id:    id!,
        type_assurance: newCt.type,
        prime:          newCt.prime,
        date_echeance:  newCt.date_echeance,
        statut:         "ACTIF",
      },
      {
        onSuccess: () => {
          setShowModal(false);
          setNewCt({ type: "AUTO", prime: "", date_echeance: "" });
          setCtErrors([]);
        },
        onError: (err) => {
          const apiErr = err as ApiError;
          const fieldErrors = apiErr.errors
            ? Object.values(apiErr.errors).flat()
            : [apiErr.message ?? "Erreur lors de l'ajout"];
          setCtErrors(fieldErrors);
        },
      },
    );
  }

  // ── États de chargement / erreur ───────────────────────────────────────────
  if (personQ.isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ background: COLORS.primary }}>
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

  if (!client) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ background: COLORS.primary }}>
          <button type="button" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} color="#fff" />
          </button>
          <h1 className="font-montserrat font-bold text-lg" style={{ color: "#fff" }}>Client introuvable</h1>
        </div>
        <div className="flex-1 flex items-center justify-center" style={{ background: COLORS.bg }}>
          <p className="font-inter text-sm" style={{ color: COLORS.muted }}>Ce client n'existe pas.</p>
        </div>
      </div>
    );
  }

  const activeContracts = contracts.filter((c) => c.statut === "ACTIF");
  const totalPrime = activeContracts.reduce((s, c) => s + parseFloat(c.prime), 0);

  // ── Rendu ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* En-tête */}
      <div style={{ background: COLORS.primary }}>
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button type="button" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} color="#fff" />
          </button>
          <div className="flex-1">
            <h1 className="font-montserrat font-extrabold text-lg" style={{ color: "#fff" }}>
              {client.full_name}
            </h1>
            <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              {client.profession ?? "Client"}
            </p>
          </div>
          <Avatar nom={client.nom} prenom={client.prenom ?? ""} size={42} bg="rgba(255,255,255,0.2)" />
        </div>

        {/* Contacts */}
        <div className="px-4 pb-3 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Phone size={13} color="rgba(255,255,255,0.6)" />
            <span className="font-jetbrains text-sm" style={{ color: "rgba(255,255,255,0.9)" }}>
              {client.telephone}
            </span>
          </div>
          {client.email && (
            <div className="flex items-center gap-2">
              <Mail size={13} color="rgba(255,255,255,0.6)" />
              <span className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.9)" }}>
                {client.email}
              </span>
            </div>
          )}
          {client.adresse && (
            <div className="flex items-center gap-2">
              <MapPin size={13} color="rgba(255,255,255,0.6)" />
              <span className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.9)" }}>
                {client.adresse}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-4 pb-4 flex gap-2">
          <a
            href={`tel:${client.telephone}`}
            aria-label={`Appeler ${client.full_name}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-montserrat font-bold text-sm"
            style={{ background: COLORS.success, color: "#fff" }}
          >
            <Phone size={15} /> Appeler
          </a>
          <a
            href={`sms:${client.telephone}`}
            aria-label={`Envoyer un SMS à ${client.full_name}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-montserrat font-bold text-sm"
            style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
          >
            <MessageSquare size={15} /> SMS
          </a>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-montserrat font-bold text-sm"
            style={{ background: COLORS.gold, color: "#fff" }}
            onClick={() => navigate("/relances")}
          >
            <RefreshCw size={15} /> Relancer
          </button>
        </div>

        {/* Onglets */}
        <div className="flex px-4 gap-1">
          {(["contrats", "relances", "activites"] as const).map((t) => (
            <button
              key={t}
              type="button"
              className="flex-1 py-2 rounded-t-xl font-inter font-semibold text-sm capitalize"
              style={{
                background: tab === t ? COLORS.bg : "transparent",
                color:      tab === t ? COLORS.primary : "rgba(255,255,255,0.7)",
              }}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 overflow-y-auto pb-20" style={{ background: COLORS.bg }}>

        {/* ── Onglet Contrats ─────────────────────────────────────────────── */}
        {tab === "contrats" && (
          <div className="px-4 pt-4 flex flex-col gap-3">
            {contractsQ.isLoading && (
              <div className="flex justify-center py-6">
                <Loader2 size={22} color={COLORS.muted} className="animate-spin" />
              </div>
            )}

            {contracts.map((ct) => {
              const days      = ct.date_echeance ? daysUntil(ct.date_echeance) : null;
              const isExpired = ct.statut === "RESILIE" || (days !== null && days < 0);
              return (
                <div
                  key={ct.id}
                  className="bg-white rounded-xl p-4"
                  style={{ border: `1.5px solid ${isExpired ? "#FEE2E2" : COLORS.border}` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl" style={{ background: "#F0F2F5" }}>
                      <ContractIcon type={ct.type_label} size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-montserrat font-bold text-sm" style={{ color: COLORS.text }}>
                          {ct.type_label}
                        </p>
                        <ContractStatusBadge statut={ct.statut} />
                        {ct.is_expiring_soon && (
                          <span
                            className="font-inter text-xs px-2 py-0.5 rounded-full"
                            style={{ background: "#FEE2E2", color: "#991B1B" }}
                          >
                            Expire bientôt
                          </span>
                        )}
                      </div>
                      <p className="font-jetbrains text-xs mt-1" style={{ color: COLORS.muted }}>
                        {ct.numero}
                      </p>
                      {ct.formule && (
                        <p className="font-inter text-xs mt-0.5" style={{ color: COLORS.muted }}>
                          {ct.formule}
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    className="flex justify-between mt-3 pt-3"
                    style={{ borderTop: `1px solid ${COLORS.border}` }}
                  >
                    <div>
                      <p className="font-inter text-xs" style={{ color: COLORS.muted }}>
                        Prime annuelle
                      </p>
                      <p className="font-jetbrains font-semibold text-base mt-0.5" style={{ color: COLORS.text }}>
                        {fmtMontant(parseFloat(ct.prime))}
                      </p>
                    </div>
                    {ct.date_echeance && (
                      <div className="text-right">
                        <p className="font-inter text-xs" style={{ color: COLORS.muted }}>
                          Échéance
                        </p>
                        <p
                          className="font-jetbrains text-sm font-medium mt-0.5"
                          style={{ color: isExpired ? COLORS.alert : days !== null && days <= 30 ? COLORS.orange : COLORS.text }}
                        >
                          {fmtDate(ct.date_echeance)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {!contractsQ.isLoading && contracts.length === 0 && (
              <div className="text-center py-8">
                <FileText size={32} color={COLORS.muted} className="mx-auto mb-2" />
                <p className="font-inter text-sm" style={{ color: COLORS.muted }}>
                  Aucun contrat
                </p>
              </div>
            )}

            <button
              type="button"
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-montserrat font-bold text-sm"
              style={{ border: `1.5px dashed ${COLORS.secondary}`, color: COLORS.secondary }}
              onClick={() => setShowModal(true)}
            >
              <Plus size={16} /> Ajouter un contrat
            </button>
          </div>
        )}

        {/* ── Onglet Relances ─────────────────────────────────────────────── */}
        {tab === "relances" && (
          <div className="px-4 pt-4 flex flex-col gap-3">
            {relancesQ.isLoading && (
              <div className="flex justify-center py-6">
                <Loader2 size={22} color={COLORS.muted} className="animate-spin" />
              </div>
            )}

            {!relancesQ.isLoading && relances.length === 0 && (
              <div className="bg-white rounded-xl p-6 text-center" style={{ border: `1px solid ${COLORS.border}` }}>
                <MessageSquare size={28} color={COLORS.muted} className="mx-auto mb-2" />
                <p className="font-inter text-sm" style={{ color: COLORS.muted }}>
                  Aucune relance enregistrée
                </p>
              </div>
            )}

            {relances.map((r) => (
              <div key={r.id} className="bg-white rounded-xl p-4" style={{ border: `1px solid ${COLORS.border}` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {r.type === "Appel" ? (
                      <Phone size={14} color={COLORS.secondary} />
                    ) : (
                      <MessageSquare size={14} color={COLORS.secondary} />
                    )}
                    <span className="font-montserrat font-bold text-sm" style={{ color: COLORS.text }}>
                      {r.type}
                    </span>
                  </div>
                  <span className="font-jetbrains text-xs" style={{ color: COLORS.muted }}>
                    {fmtDate(r.date_effectuee ?? r.date_planifiee ?? r.created_at)}
                  </span>
                </div>
                {r.note && (
                  <p className="font-inter text-sm" style={{ color: COLORS.text }}>
                    {r.note}
                  </p>
                )}
                {r.resultat && (
                  <span
                    className="mt-2 inline-block font-inter text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: r.resultat === "Positif" ? "#DCFCE7" : r.resultat === "À rappeler" ? "#FEF3C7" : "#F0F2F5",
                      color:      r.resultat === "Positif" ? "#166534" : r.resultat === "À rappeler" ? "#92400E" : COLORS.muted,
                    }}
                  >
                    {r.resultat}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Onglet Activités / Résumé ────────────────────────────────────── */}
        {tab === "activites" && (
          <div className="px-4 pt-4 flex flex-col gap-3">
            {client.observations && (
              <div className="bg-white rounded-xl p-4" style={{ border: `1px solid ${COLORS.border}` }}>
                <p className="font-montserrat font-bold text-sm mb-1" style={{ color: COLORS.text }}>
                  Observations
                </p>
                <p className="font-inter text-sm" style={{ color: COLORS.muted }}>
                  {client.observations}
                </p>
              </div>
            )}
            <div className="bg-white rounded-xl p-4" style={{ border: `1px solid ${COLORS.border}` }}>
              <p className="font-montserrat font-bold text-sm mb-3" style={{ color: COLORS.text }}>
                Résumé portefeuille
              </p>
              <div className="flex gap-4">
                <div>
                  <p className="font-jetbrains font-bold text-2xl" style={{ color: COLORS.primary }}>
                    {contracts.length}
                  </p>
                  <p className="font-inter text-xs" style={{ color: COLORS.muted }}>Contrats</p>
                </div>
                <div>
                  <p className="font-jetbrains font-bold text-2xl" style={{ color: COLORS.success }}>
                    {activeContracts.length}
                  </p>
                  <p className="font-inter text-xs" style={{ color: COLORS.muted }}>Actifs</p>
                </div>
                <div>
                  <p className="font-jetbrains font-bold text-xl" style={{ color: COLORS.text }}>
                    {fmtMontant(totalPrime)}
                  </p>
                  <p className="font-inter text-xs" style={{ color: COLORS.muted }}>Prime totale</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal : Ajouter un contrat ──────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-t-2xl p-5 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-montserrat font-bold text-lg" style={{ color: COLORS.text }}>
                Ajouter un contrat
              </h3>
              <button type="button" onClick={() => setShowModal(false)}>
                <X size={20} color={COLORS.muted} />
              </button>
            </div>

            {ctErrors.length > 0 && (
              <div className="rounded-xl p-3 mb-3" style={{ background: "#FEF2F2", border: `1px solid #FEE2E2` }}>
                {ctErrors.map((e, i) => (
                  <p key={i} className="font-inter text-sm" style={{ color: COLORS.alert }}>• {e}</p>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-4">
              {/* Type */}
              <div>
                <p className="font-inter text-sm font-medium mb-1.5" style={{ color: COLORS.text }}>
                  Type de contrat *
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {CONTRACT_TYPES.map(({ code, label }) => (
                    <button
                      key={code}
                      type="button"
                      className="py-2 rounded-xl font-inter text-sm font-semibold"
                      style={{
                        background: newCt.type === code ? COLORS.primary : "#F0F2F5",
                        color:      newCt.type === code ? "#fff" : COLORS.muted,
                      }}
                      onClick={() => setNewCt((p) => ({ ...p, type: code }))}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prime */}
              <div>
                <label className="font-inter text-sm font-medium block mb-1.5" style={{ color: COLORS.text }}>
                  Prime annuelle (FCFA) *
                </label>
                <input
                  type="number"
                  className="font-inter w-full px-3.5 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: "#F0F2F5",
                    border:     `1.5px solid ${newCt.prime ? COLORS.secondary : COLORS.border}`,
                    color:      COLORS.text,
                  }}
                  placeholder="Ex: 250000"
                  value={newCt.prime}
                  onChange={(e) => setNewCt((p) => ({ ...p, prime: e.target.value }))}
                />
              </div>

              {/* Date échéance */}
              <div>
                <label className="font-inter text-sm font-medium block mb-1.5" style={{ color: COLORS.text }}>
                  Date d'échéance *
                </label>
                <input
                  type="date"
                  className="font-inter w-full px-3.5 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: "#F0F2F5",
                    border:     `1.5px solid ${newCt.date_echeance ? COLORS.secondary : COLORS.border}`,
                    color:      COLORS.text,
                  }}
                  value={newCt.date_echeance}
                  onChange={(e) => setNewCt((p) => ({ ...p, date_echeance: e.target.value }))}
                />
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  className="flex-1 py-3 rounded-xl font-montserrat font-bold text-sm"
                  style={{ background: "#F3F4F6", color: COLORS.muted }}
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  disabled={createContract.isPending}
                  className="flex-1 py-3 rounded-xl font-montserrat font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background: COLORS.success, color: "#fff" }}
                  onClick={handleSaveContract}
                >
                  {createContract.isPending
                    ? <Loader2 size={16} className="animate-spin" />
                    : "Ajouter"
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
