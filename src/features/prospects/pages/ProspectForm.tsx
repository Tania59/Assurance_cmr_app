import { useState } from "react";
import { Plus } from "lucide-react";
import type { Prospect } from "../../../shared/types";
import { COLORS } from "../../../shared/constants/colors";
import { ScreenHeader } from "../../../shared/components/layout/ScreenHeader";
import { Input } from "../../../shared/components/ui/Input";
import { TextArea } from "../../../shared/components/ui/TextArea";
import { Select } from "../../../shared/components/ui/Select";

interface ProspectFormProps {
  onSave: (p: Prospect) => void;
  onBack: () => void;
  initialData?: Partial<Prospect>;
}

export function ProspectForm({ onSave, onBack, initialData }: ProspectFormProps) {
  const [f, setF] = useState({
    nom: initialData?.nom ?? "",
    tel: initialData?.tel ?? "",
    source: initialData?.source ?? "",
    interet: initialData?.interet ?? "",
    statut: (initialData?.statut ?? "Froid") as Prospect["statut"],
    rdv: initialData?.rdv ?? "",
    note: initialData?.note ?? "",
  });
  const [errors, setErrors] = useState<string[]>([]);

  function set(k: keyof typeof f) {
    return (v: string) => setF((p) => ({ ...p, [k]: v }));
  }

  function handleSave() {
    const errs: string[] = [];
    if (!f.nom.trim()) errs.push("Nom requis");
    if (!f.tel.trim()) errs.push("Téléphone requis");
    if (errs.length) {
      setErrors(errs);
      return;
    }
    onSave({
      id: Date.now(),
      nom: f.nom,
      tel: f.tel,
      source: f.source,
      interet: f.interet,
      statut: f.statut,
      rdv: f.rdv || null,
      note: f.note,
    });
  }

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title="Nouveau prospect" onBack={onBack} />
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
          <Input
            label="Nom complet"
            value={f.nom}
            onChange={set("nom")}
            placeholder="ex: Sow Ibrahim"
            required
          />
          <Input
            label="Téléphone"
            value={f.tel}
            onChange={set("tel")}
            placeholder="+221 77 __ __ __"
            type="tel"
            required
          />
          <Select
            label="Source"
            value={f.source}
            onChange={set("source")}
            options={[
              { value: "", label: "Sélectionner une source" },
              { value: "Référence", label: "Référence client" },
              { value: "Réseaux sociaux", label: "Réseaux sociaux" },
              { value: "Démarchage", label: "Démarchage terrain" },
              { value: "Site web", label: "Site web" },
              { value: "Événement", label: "Événement / Salon" },
              { value: "Appel entrant", label: "Appel entrant" },
              { value: "Autre", label: "Autre" },
            ]}
          />
          <Select
            label="Intérêt produit"
            value={f.interet}
            onChange={set("interet")}
            options={[
              { value: "", label: "Sélectionner un produit" },
              { value: "Auto", label: "Assurance Auto" },
              { value: "Santé", label: "Assurance Santé" },
              { value: "Habitation", label: "Assurance Habitation" },
              { value: "Voyage", label: "Assurance Voyage" },
              { value: "RC Pro", label: "Responsabilité Civile Pro" },
              { value: "Vie", label: "Assurance Vie" },
            ]}
          />
          <Select
            label="Température"
            value={f.statut}
            onChange={(v) => setF((p) => ({ ...p, statut: v as Prospect["statut"] }))}
            options={[
              { value: "Froid", label: "❄️ Froid" },
              { value: "Tiède", label: "🌤 Tiède" },
              { value: "Chaud", label: "🔥 Chaud" },
            ]}
          />
          <Input label="Date RDV (optionnel)" value={f.rdv} onChange={set("rdv")} type="date" />
          <TextArea
            label="Notes"
            value={f.note}
            onChange={set("note")}
            placeholder="Budget, besoins, contexte…"
          />
        </div>
      </div>
      <div className="px-4 py-3 flex-shrink-0" style={{ background: "#fff", borderTop: `1px solid ${COLORS.border}` }}>
        <button
          className="w-full rounded-xl py-4 font-montserrat font-bold text-base active:opacity-90"
          style={{ background: COLORS.secondary, color: "#fff" }}
          onClick={handleSave}
        >
          <Plus size={18} className="inline mr-2 -mt-0.5" />
          Enregistrer le prospect
        </button>
      </div>
    </div>
  );
}