import { useState } from "react";
import { X, Check } from "lucide-react";
import { COLORS } from "../../../shared/constants/colors";
import { Select } from "../../../shared/components/ui/Select";
import { TextArea } from "../../../shared/components/ui/TextArea";


interface LogModalProps {
  onClose: () => void;
}

export function LogModal({ onClose }: LogModalProps) {
  const [type, setType] = useState("Appel");
  const [note, setNote] = useState("");
  const [resultat, setResultat] = useState("Positif");

  return (
    <div
      className="absolute inset-0 flex items-end z-50"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div className="w-full bg-white rounded-t-2xl p-5 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-montserrat font-bold text-lg" style={{ color: COLORS.text }}>
            Logger une relance
          </h3>
          <button onClick={onClose}>
            <X size={20} color={COLORS.muted} />
          </button>
        </div>
        <div className="flex gap-2">
          {["Appel", "SMS", "WhatsApp"].map((t) => (
            <button
              key={t}
              className="flex-1 py-2.5 rounded-xl font-inter font-semibold text-sm"
              style={{
                background: type === t ? COLORS.primary : "#F0F2F5",
                color: type === t ? "#fff" : COLORS.muted,
              }}
              onClick={() => setType(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <Select
          label="Résultat"
          value={resultat}
          onChange={setResultat}
          options={[
            { value: "Positif", label: "✅ Positif — intéressé" },
            { value: "À rappeler", label: "📅 À rappeler" },
            { value: "Sans réponse", label: "📵 Sans réponse" },
            { value: "Négatif", label: "❌ Négatif" },
            { value: "Envoyé", label: "📤 Envoyé (SMS)" },
          ]}
        />
        <TextArea label="Note" value={note} onChange={setNote} placeholder="Résumé de l'échange…" />
        <button
          className="w-full rounded-xl py-4 font-montserrat font-bold text-base"
          style={{ background: COLORS.success, color: "#fff" }}
          onClick={onClose}
        >
          <Check size={18} className="inline mr-2 -mt-0.5" /> Enregistrer
        </button>
      </div>
    </div>
  );
}