import { useState } from "react";
import { UserPlus } from "lucide-react";
import type{ Client } from "../../../shared/types";
import { COLORS } from "../../../shared/constants/colors";
import { ScreenHeader } from "../../../shared/components/layout/ScreenHeader";
import { Input } from "../../../shared/components/ui/Input";
import { TextArea } from "../../../shared/components/ui/TextArea";
import { Select } from "../../../shared/components/ui/Select";

interface ClientFormProps {
  onSave: (c: Client) => void;
  onBack: () => void;
  initialData?: Partial<Client>;
}

export function ClientForm({ onSave, onBack, initialData }: ClientFormProps) {
  const [f, setF] = useState({
    prenom: initialData?.prenom ?? "",
    nom: initialData?.nom ?? "",
    tel: initialData?.tel ?? "",
    email: initialData?.email ?? "",
    adresse: initialData?.adresse ?? "",
    profession: initialData?.profession ?? "",
    observations: initialData?.observations ?? "",
  });
  const [errors, setErrors] = useState<string[]>([]);

  function set(k: keyof typeof f) {
    return (v: string) => setF((p) => ({ ...p, [k]: v }));
  }

  function handleSave() {
    const errs: string[] = [];
    if (!f.prenom.trim()) errs.push("Prénom requis");
    if (!f.nom.trim()) errs.push("Nom requis");
    if (!f.tel.trim()) errs.push("Téléphone requis");
    if (errs.length) {
      setErrors(errs);
      return;
    }
    onSave({
      id: Date.now(),
      ...f,
      contrats: [],
      relances: [],
    });
  }

  const professions = [
    { value: "", label: "Sélectionner une profession" },
    { value: "Commerçant", label: "Commerçant(e)" },
    { value: "Fonctionnaire", label: "Fonctionnaire" },
    { value: "Chef d'entreprise", label: "Chef d'entreprise" },
    { value: "Ingénieur", label: "Ingénieur(e)" },
    { value: "Médecin", label: "Médecin" },
    { value: "Enseignant", label: "Enseignant(e)" },
    { value: "Architecte", label: "Architecte" },
    { value: "Agriculteur", label: "Agriculteur(rice)" },
    { value: "Autre", label: "Autre" },
  ];

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title={initialData?.id ? "Modifier le client" : "Nouveau client"} onBack={onBack} />
      <div className="flex-1 overflow-y-auto pb-24" style={{ background: COLORS.bg }}>
        <div className="px-4 pt-4 flex flex-col gap-4">
          {errors.length > 0 && (
            <div className="bg-red-50 rounded-xl p-3" style={{ border: `1px solid #FEE2E2` }}>
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
                required
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
            value={f.tel}
            onChange={set("tel")}
            placeholder="+225 07 12 34 56"
            type="tel"
            required
          />
          <Input
            label="Email"
            value={f.email}
            onChange={set("email")}
            placeholder="exemple@gmail.com"
            type="email"
          />
          <Input
            label="Adresse"
            value={f.adresse}
            onChange={set("adresse")}
            placeholder="Quartier, Ville"
          />
          <Select
            label="Profession"
            value={f.profession}
            onChange={set("profession")}
            options={professions}
          />
          <TextArea
            label="Observations"
            value={f.observations}
            onChange={set("observations")}
            placeholder="Notes importantes, préférences, historique…"
          />
        </div>
      </div>
      {/* Sticky save button */}
      <div className="px-4 py-3 flex-shrink-0" style={{ background: "#fff", borderTop: `1px solid ${COLORS.border}` }}>
        <button
          className="w-full rounded-xl py-4 font-montserrat font-bold text-base active:opacity-90"
          style={{ background: COLORS.success, color: "#fff" }}
          onClick={handleSave}
        >
          <UserPlus size={18} className="inline mr-2 -mt-0.5" />
          Enregistrer le client
        </button>
      </div>
    </div>
  );
}