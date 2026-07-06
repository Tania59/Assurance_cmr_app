import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../../../shared/constants/colors";
import { ScreenHeader } from "../../../shared/components/layout/ScreenHeader";
import { Input } from "../../../shared/components/ui/Input";
import { TextArea } from "../../../shared/components/ui/TextArea";
import { Select } from "../../../shared/components/ui/Select";
import { useCreatePerson } from "../../people/hooks/usePeople";
import type { ApiError } from "../../../lib/api";

export default function ProspectForm() {
  const navigate      = useNavigate();
  const createPerson  = useCreatePerson();

  const [f, setF] = useState({
    nom:            "",
    prenom:         "",
    telephone:      "",
    source:         "",
    niveau_interet: "" as "" | "CHAUD" | "TIEDE" | "FROID",
    date_relance:   "",
    observations:   "",
  });
  const [errors, setErrors] = useState<string[]>([]);

  function set(k: keyof typeof f) {
    return (v: string) => setF((p) => ({ ...p, [k]: v }));
  }

  function handleSave() {
    const errs: string[] = [];
    if (!f.nom.trim())       errs.push("Nom requis");
    if (!f.telephone.trim()) errs.push("Téléphone requis");
    if (errs.length) { setErrors(errs); return; }

    createPerson.mutate(
      {
        nom:            f.nom.trim(),
        prenom:         f.prenom.trim() || null,
        telephone:      f.telephone.trim(),
        statut:         "PROSPECT",
        source:         f.source || null,
        niveau_interet: (f.niveau_interet || null) as "CHAUD" | "TIEDE" | "FROID" | null,
        date_relance:   f.date_relance || null,
        observations:   f.observations.trim() || null,
      },
      {
        onSuccess: () => navigate("/pipeline", { replace: true }),
        onError: (err) => {
          const apiErr = err as ApiError;
          const fieldErrors = apiErr.errors
            ? Object.values(apiErr.errors).flat()
            : [apiErr.message ?? "Erreur lors de l'enregistrement"];
          setErrors(fieldErrors);
        },
      },
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title="Nouveau prospect" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto pb-24" style={{ background: COLORS.bg }}>
        <div className="px-4 pt-4 flex flex-col gap-4">
          {errors.length > 0 && (
            <div className="rounded-xl p-3" style={{ background: "#FEF2F2", border: `1px solid #FEE2E2` }}>
              {errors.map((e, i) => (
                <p key={i} className="font-inter text-sm" style={{ color: COLORS.alert }}>
                  • {e}
                </p>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                label="Prénom"
                value={f.prenom}
                onChange={set("prenom")}
                placeholder="ex: Kofi"
              />
            </div>
            <div className="flex-1">
              <Input
                label="Nom"
                value={f.nom}
                onChange={set("nom")}
                placeholder="ex: Mensah"
                required
              />
            </div>
          </div>

          <Input
            label="Téléphone"
            value={f.telephone}
            onChange={set("telephone")}
            placeholder="+221 77 __ __ __"
            type="tel"
            required
          />

          <Select
            label="Source"
            value={f.source}
            onChange={set("source")}
            options={[
              { value: "",               label: "Sélectionner une source" },
              { value: "Référence",      label: "Référence client" },
              { value: "Réseaux sociaux",label: "Réseaux sociaux" },
              { value: "Démarchage",     label: "Démarchage terrain" },
              { value: "Site web",       label: "Site web" },
              { value: "Événement",      label: "Événement / Salon" },
              { value: "Appel entrant",  label: "Appel entrant" },
              { value: "Autre",          label: "Autre" },
            ]}
          />

          <Select
            label="Température"
            value={f.niveau_interet}
            onChange={(v) => setF((p) => ({ ...p, niveau_interet: v as typeof f.niveau_interet }))}
            options={[
              { value: "",      label: "Non défini" },
              { value: "FROID", label: "❄️ Froid" },
              { value: "TIEDE", label: "🌤 Tiède" },
              { value: "CHAUD", label: "🔥 Chaud" },
            ]}
          />

          <Input
            label="Date de relance (optionnel)"
            value={f.date_relance}
            onChange={set("date_relance")}
            type="date"
          />

          <TextArea
            label="Observations"
            value={f.observations}
            onChange={set("observations")}
            placeholder="Budget, besoins, contexte…"
          />
        </div>
      </div>

      <div className="px-4 py-3 flex-shrink-0" style={{ background: "#fff", borderTop: `1px solid ${COLORS.border}` }}>
        <button
          type="button"
          disabled={createPerson.isPending}
          className="w-full rounded-xl py-4 font-montserrat font-bold text-base active:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ background: COLORS.secondary, color: "#fff" }}
          onClick={handleSave}
        >
          {createPerson.isPending
            ? <><Loader2 size={18} className="animate-spin" /> Enregistrement…</>
            : <><Plus size={18} /> Enregistrer le prospect</>
          }
        </button>
      </div>
    </div>
  );
}
