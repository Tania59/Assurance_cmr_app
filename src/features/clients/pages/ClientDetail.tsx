import { useState } from "react";
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  RefreshCw,
  Plus,
  FileText,
  X,
} from "lucide-react";
import type { Client } from "../../../shared/types";
import { COLORS } from "../../../shared/constants/colors";
import { fmtDate, daysUntil } from "../../../shared/utils/date";
import { fmtMontant } from "../../../shared/utils/format";
import { Avatar } from "../../../shared/components/ui/Avatar";
import { StatusBadge } from "../../../shared/components/ui/Badge";
import { EcheancePill } from "../../../shared/components/ui/EcheancePill";
import { ContractIcon } from "../../../shared/components/icons/ContractIcon";

interface ClientDetailProps {
  client: Client;
  onBack: () => void;
  onAddContrat: (clientId: number) => void; // Retiré le ? pour le rendre obligatoire
}

export function ClientDetail({ client, onBack, onAddContrat }: ClientDetailProps) {
  const [tab, setTab] = useState<"contrats" | "relances" | "activites">("contrats");
  const [showContratModal, setShowContratModal] = useState(false);
  const [newContrat, setNewContrat] = useState({
    type: "Auto",
    prime: "",
    echeance: "",
  });

  const typesContrats = ["Auto", "Santé", "Habitation", "Voyage", "RC Pro", "Vie"];

  const handleAddContrat = () => {
    setShowContratModal(true);
  };

  const handleSaveContrat = () => {
    // Appeler la fonction parent avec l'ID du client
    onAddContrat(client.id);
    setShowContratModal(false);
    setNewContrat({ type: "Auto", prime: "", echeance: "" });
  };

  return (
    <div className="flex flex-col h-full">
      <div style={{ background: COLORS.primary }}>
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button onClick={onBack}>
            <ArrowLeft size={22} color="#fff" />
          </button>
          <div className="flex-1">
            <h1 className="font-montserrat font-extrabold text-lg" style={{ color: "#fff" }}>
              {client.prenom} {client.nom}
            </h1>
            <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              {client.profession}
            </p>
          </div>
          <Avatar nom={client.nom} prenom={client.prenom} size={42} bg="rgba(255,255,255,0.2)" />
        </div>
        <div className="px-4 pb-3 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Phone size={13} color="rgba(255,255,255,0.6)" />
            <span className="font-jetbrains text-sm" style={{ color: "rgba(255,255,255,0.9)" }}>
              {client.tel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={13} color="rgba(255,255,255,0.6)" />
            <span className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.9)" }}>
              {client.email || "—"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={13} color="rgba(255,255,255,0.6)" />
            <span className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.9)" }}>
              {client.adresse || "—"}
            </span>
          </div>
        </div>
        <div className="px-4 pb-4 flex gap-2">
          <a
            href={`tel:${client.tel}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-montserrat font-bold text-sm"
            style={{ background: COLORS.success, color: "#fff" }}
          >
            <Phone size={15} /> Appeler
          </a>
          <a
            href={`sms:${client.tel}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-montserrat font-bold text-sm"
            style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
          >
            <MessageSquare size={15} /> SMS
          </a>
          <button
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-montserrat font-bold text-sm"
            style={{ background: COLORS.gold, color: "#fff" }}
          >
            <RefreshCw size={15} /> Relancer
          </button>
        </div>
        <div className="flex px-4 gap-1">
          {(["contrats", "relances", "activites"] as const).map((t) => (
            <button
              key={t}
              className="flex-1 py-2 rounded-t-xl font-inter font-semibold text-sm capitalize"
              style={{
                background: tab === t ? COLORS.bg : "transparent",
                color: tab === t ? COLORS.primary : "rgba(255,255,255,0.7)",
              }}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20" style={{ background: COLORS.bg }}>
        {tab === "contrats" && (
          <div className="px-4 pt-4 flex flex-col gap-3">
            {client.contrats.map((ct) => {
              const d = daysUntil(ct.echeance);
              const isExpired = ct.statut === "Expiré" || d < 0;
              return (
                <div
                  key={ct.id}
                  className="bg-white rounded-xl p-4"
                  style={{ border: `1.5px solid ${isExpired ? "#FEE2E2" : COLORS.border}` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl" style={{ background: "#F0F2F5" }}>
                      <ContractIcon type={ct.type} size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-montserrat font-bold text-sm" style={{ color: COLORS.text }}>
                          {ct.type}
                        </p>
                        <StatusBadge statut={ct.statut} />
                        <EcheancePill echeance={ct.echeance} statut={ct.statut} />
                      </div>
                      <p className="font-jetbrains text-xs mt-1" style={{ color: COLORS.muted }}>
                        {ct.numero}
                      </p>
                      {ct.detail && (
                        <p className="font-inter text-xs mt-0.5" style={{ color: COLORS.muted }}>
                          {ct.detail}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between mt-3 pt-3" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                    <div>
                      <p className="font-inter text-xs" style={{ color: COLORS.muted }}>
                        Prime annuelle
                      </p>
                      <p className="font-jetbrains font-semibold text-base mt-0.5" style={{ color: COLORS.text }}>
                        {fmtMontant(ct.prime)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-inter text-xs" style={{ color: COLORS.muted }}>
                        Échéance
                      </p>
                      <p
                        className="font-jetbrains text-sm font-medium mt-0.5"
                        style={{ color: isExpired ? COLORS.alert : d <= 30 ? COLORS.orange : COLORS.text }}
                      >
                        {fmtDate(ct.echeance)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            {client.contrats.length === 0 && (
              <div className="text-center py-8">
                <FileText size={32} color={COLORS.muted} className="mx-auto mb-2" />
                <p className="font-inter text-sm" style={{ color: COLORS.muted }}>
                  Aucun contrat
                </p>
              </div>
            )}
            <button
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-montserrat font-bold text-sm transition-all hover:opacity-80"
              style={{ border: `1.5px dashed ${COLORS.secondary}`, color: COLORS.secondary }}
              onClick={handleAddContrat}
            >
              <Plus size={16} /> Ajouter un contrat
            </button>
          </div>
        )}

        {tab === "relances" && (
          <div className="px-4 pt-4 flex flex-col gap-3">
            <button
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-montserrat font-bold text-sm mb-1"
              style={{ background: COLORS.primary, color: "#fff" }}
            >
              <Plus size={16} /> Logger un appel / SMS
            </button>
            {client.relances.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center" style={{ border: `1px solid ${COLORS.border}` }}>
                <MessageSquare size={28} color={COLORS.muted} className="mx-auto mb-2" />
                <p className="font-inter text-sm" style={{ color: COLORS.muted }}>
                  Aucune relance enregistrée
                </p>
              </div>
            ) : (
              client.relances.map((r, i) => (
                <div key={i} className="bg-white rounded-xl p-4" style={{ border: `1px solid ${COLORS.border}` }}>
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
                      {fmtDate(r.date)}
                    </span>
                  </div>
                  <p className="font-inter text-sm" style={{ color: COLORS.text }}>
                    {r.note}
                  </p>
                  <span
                    className="mt-2 inline-block font-inter text-xs font-semibold px-2 py-0.5 rounded-full"
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
              ))
            )}
          </div>
        )}

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
                    {client.contrats.length}
                  </p>
                  <p className="font-inter text-xs" style={{ color: COLORS.muted }}>
                    Contrats
                  </p>
                </div>
                <div>
                  <p className="font-jetbrains font-bold text-2xl" style={{ color: COLORS.success }}>
                    {client.contrats.filter((c) => c.statut === "Actif").length}
                  </p>
                  <p className="font-inter text-xs" style={{ color: COLORS.muted }}>
                    Actifs
                  </p>
                </div>
                <div>
                  <p className="font-jetbrains font-bold text-xl" style={{ color: COLORS.text }}>
                    {fmtMontant(client.contrats.filter((c) => c.statut === "Actif").reduce((s, c) => s + c.prime, 0))}
                  </p>
                  <p className="font-inter text-xs" style={{ color: COLORS.muted }}>
                    Prime totale
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Ajout Contrat */}
      {showContratModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-t-2xl p-5 max-w-md w-full mx-4" style={{ maxHeight: "80vh" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-montserrat font-bold text-lg" style={{ color: COLORS.text }}>
                Ajouter un contrat
              </h3>
              <button onClick={() => setShowContratModal(false)}>
                <X size={20} color={COLORS.muted} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="font-inter text-sm font-medium block mb-1.5" style={{ color: COLORS.text }}>
                  Type de contrat *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {typesContrats.map((type) => (
                    <button
                      key={type}
                      className="py-2 rounded-xl font-inter text-sm font-semibold transition-all"
                      style={{
                        background: newContrat.type === type ? COLORS.primary : "#F0F2F5",
                        color: newContrat.type === type ? "#fff" : COLORS.muted,
                      }}
                      onClick={() => setNewContrat((p) => ({ ...p, type }))}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-inter text-sm font-medium block mb-1.5" style={{ color: COLORS.text }}>
                  Prime annuelle (FCFA) *
                </label>
                <input
                  type="number"
                  className="font-inter w-full px-3.5 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: "#F0F2F5",
                    border: `1.5px solid ${newContrat.prime ? COLORS.secondary : COLORS.border}`,
                    color: COLORS.text,
                  }}
                  placeholder="Ex: 250000"
                  value={newContrat.prime}
                  onChange={(e) => setNewContrat((p) => ({ ...p, prime: e.target.value }))}
                />
              </div>
              <div>
                <label className="font-inter text-sm font-medium block mb-1.5" style={{ color: COLORS.text }}>
                  Date d'échéance *
                </label>
                <input
                  type="date"
                  className="font-inter w-full px-3.5 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: "#F0F2F5",
                    border: `1.5px solid ${newContrat.echeance ? COLORS.secondary : COLORS.border}`,
                    color: COLORS.text,
                  }}
                  value={newContrat.echeance}
                  onChange={(e) => setNewContrat((p) => ({ ...p, echeance: e.target.value }))}
                />
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className="flex-1 py-3 rounded-xl font-montserrat font-bold text-sm"
                  style={{ background: "#F3F4F6", color: COLORS.muted }}
                  onClick={() => setShowContratModal(false)}
                >
                  Annuler
                </button>
                <button
                  className="flex-1 py-3 rounded-xl font-montserrat font-bold text-sm"
                  style={{ background: COLORS.success, color: "#fff" }}
                  onClick={handleSaveContrat}
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}