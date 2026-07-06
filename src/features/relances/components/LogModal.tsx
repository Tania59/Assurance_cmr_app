import { useState } from "react";
import { X, Check, Search, Loader2 } from "lucide-react";
import { COLORS } from "../../../shared/constants/colors";
import { Select } from "../../../shared/components/ui/Select";
import { TextArea } from "../../../shared/components/ui/TextArea";
import { usePeople } from "../../people/hooks/usePeople";
import { useCreateRelance } from "../hooks/useRelances";
import type { Person } from "../../../lib/api-types";
import type { ApiError } from "../../../lib/api";

interface LogModalProps {
  onClose: () => void;
  /** Pré-sélectionne une personne (ex: depuis ClientDetail) */
  personneId?: string;
  personneName?: string;
}

const TODAY = new Date().toISOString().split("T")[0];

export function LogModal({ onClose, personneId, personneName }: LogModalProps) {
  const [type,          setType]          = useState("Appel");
  const [note,          setNote]          = useState("");
  const [datePlanifiee, setDatePlanifiee] = useState(TODAY);
  const [search,        setSearch]        = useState("");
  const [selected,      setSelected]      = useState<Person | null>(null);
  const [error,         setError]         = useState<string | null>(null);

  // Si une personne est pré-fournie, pas besoin de chercher
  const hasPreset = !!personneId;
  const effectiveId   = hasPreset ? personneId  : selected?.id;
  const effectiveName = hasPreset ? personneName : selected?.full_name;

  // Recherche uniquement si pas de préselection et query non vide
  const searchQ = usePeople({
    search:   !hasPreset && search.length >= 2 ? search : undefined,
    per_page: 5,
  });
  const suggestions = (!hasPreset && search.length >= 2) ? (searchQ.data?.data ?? []) : [];

  const createRelance = useCreateRelance();

  function handleSave() {
    if (!effectiveId) { setError("Veuillez sélectionner une personne."); return; }
    if (!datePlanifiee) { setError("La date est requise."); return; }
    setError(null);

    createRelance.mutate(
      {
        personne_id:    effectiveId,
        type,
        date_planifiee: datePlanifiee,
        note:           note.trim() || undefined,
      },
      {
        onSuccess: () => onClose(),
        onError: (err) => {
          const apiErr = err as ApiError;
          setError(apiErr.message ?? "Erreur lors de l'enregistrement.");
        },
      },
    );
  }

  return (
    <div
      className="absolute inset-0 flex items-end z-50"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full bg-white rounded-t-2xl p-5 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Titre */}
        <div className="flex items-center justify-between">
          <h3 className="font-montserrat font-bold text-lg" style={{ color: COLORS.text }}>
            Planifier une relance
          </h3>
          <button type="button" onClick={onClose}>
            <X size={20} color={COLORS.muted} />
          </button>
        </div>

        {/* Sélecteur de personne (masqué si préselection) */}
        {!hasPreset && (
          <div>
            <p className="font-inter text-sm font-medium mb-1.5" style={{ color: COLORS.text }}>
              Personne *
            </p>

            {selected ? (
              <div
                className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                style={{ background: "#EFF6FF", border: `1.5px solid ${COLORS.secondary}` }}
              >
                <span className="font-inter text-sm font-semibold" style={{ color: COLORS.secondary }}>
                  {selected.full_name}
                </span>
                <button
                  type="button"
                  aria-label="Désélectionner la personne"
                  onClick={() => { setSelected(null); setSearch(""); }}
                >
                  <X size={15} color={COLORS.secondary} />
                </button>
              </div>
            ) : (
              <div className="relative">
                <div
                  className="flex items-center gap-2 px-3 rounded-xl"
                  style={{
                    background: "#F0F2F5",
                    border: `1.5px solid ${search ? COLORS.secondary : COLORS.border}`,
                  }}
                >
                  <Search size={15} color={COLORS.muted} />
                  <input
                    className="font-inter flex-1 py-2.5 text-sm bg-transparent outline-none"
                    style={{ color: COLORS.text }}
                    placeholder="Rechercher un client ou prospect…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoComplete="off"
                  />
                  {searchQ.isLoading && search.length >= 2
                    ? <Loader2 size={14} color={COLORS.muted} className="animate-spin" />
                    : search && (
                        <button
                          type="button"
                          aria-label="Effacer la recherche"
                          onClick={() => setSearch("")}
                        >
                          <X size={14} color={COLORS.muted} />
                        </button>
                      )
                  }
                </div>

                {suggestions.length > 0 && (
                  <div
                    className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl overflow-hidden z-10"
                    style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.12)", border: `1px solid ${COLORS.border}` }}
                  >
                    {suggestions.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center justify-between"
                        onClick={() => { setSelected(p); setSearch(""); }}
                      >
                        <span className="font-inter text-sm" style={{ color: COLORS.text }}>
                          {p.full_name}
                        </span>
                        <span
                          className="font-inter text-xs px-1.5 py-0.5 rounded"
                          style={{
                            background: p.statut === "CLIENT" ? "#DCFCE7" : "#EFF6FF",
                            color:      p.statut === "CLIENT" ? "#166534" : COLORS.secondary,
                          }}
                        >
                          {p.statut === "CLIENT" ? "Client" : "Prospect"}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {search.length >= 2 && !searchQ.isLoading && suggestions.length === 0 && (
                  <p className="font-inter text-xs mt-1" style={{ color: COLORS.muted }}>
                    Aucun résultat pour « {search} »
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Personne pré-sélectionnée */}
        {hasPreset && effectiveName && (
          <div
            className="px-3 py-2.5 rounded-xl"
            style={{ background: "#EFF6FF", border: `1.5px solid ${COLORS.secondary}` }}
          >
            <span className="font-inter text-sm font-semibold" style={{ color: COLORS.secondary }}>
              {effectiveName}
            </span>
          </div>
        )}

        {/* Type */}
        <div className="flex gap-2">
          {["Appel", "SMS", "WhatsApp"].map((t) => (
            <button
              key={t}
              type="button"
              className="flex-1 py-2.5 rounded-xl font-inter font-semibold text-sm"
              style={{
                background: type === t ? COLORS.primary : "#F0F2F5",
                color:      type === t ? "#fff" : COLORS.muted,
              }}
              onClick={() => setType(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Date planifiée */}
        <div>
          <label
            className="font-inter text-sm font-medium block mb-1.5"
            style={{ color: COLORS.text }}
          >
            Date planifiée *
          </label>
          <input
            type="date"
            className="font-inter w-full px-3.5 py-3 rounded-xl text-sm outline-none"
            style={{
              background: "#F0F2F5",
              border:     `1.5px solid ${datePlanifiee ? COLORS.secondary : COLORS.border}`,
              color:      COLORS.text,
            }}
            aria-label="Date planifiée"
            placeholder="jj/mm/aaaa"
            value={datePlanifiee}
            onChange={(e) => setDatePlanifiee(e.target.value)}
          />
        </div>

        <TextArea
          label="Note (optionnel)"
          value={note}
          onChange={setNote}
          placeholder="Résumé, contexte, objectif…"
        />

        {/* Erreur */}
        {error && (
          <p className="font-inter text-sm text-center" style={{ color: COLORS.alert }}>
            {error}
          </p>
        )}

        {/* Bouton */}
        <button
          type="button"
          disabled={createRelance.isPending || (!effectiveId)}
          className="w-full rounded-xl py-4 font-montserrat font-bold text-base flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ background: COLORS.success, color: "#fff" }}
          onClick={handleSave}
        >
          {createRelance.isPending
            ? <><Loader2 size={18} className="animate-spin" /> Enregistrement…</>
            : <><Check size={18} /> Planifier la relance</>
          }
        </button>
      </div>
    </div>
  );
}
