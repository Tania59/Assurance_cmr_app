import { useState, useEffect } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { COLORS } from "../../../shared/constants/colors";
import { ScreenHeader } from "../../../shared/components/layout/ScreenHeader";
import { Input } from "../../../shared/components/ui/Input";
import { TextArea } from "../../../shared/components/ui/TextArea";
import { Select } from "../../../shared/components/ui/Select";
import { useCreatePerson, usePerson, useUpdatePerson } from "../../people/hooks/usePeople";
import type { ApiError } from "../../../lib/api";

const PROFESSIONS = [
  { value: "",                  label: "Sélectionner une profession" },
  { value: "Commerçant",        label: "Commerçant(e)" },
  { value: "Fonctionnaire",     label: "Fonctionnaire" },
  { value: "Chef d'entreprise", label: "Chef d'entreprise" },
  { value: "Ingénieur",         label: "Ingénieur(e)" },
  { value: "Médecin",           label: "Médecin" },
  { value: "Enseignant",        label: "Enseignant(e)" },
  { value: "Architecte",        label: "Architecte" },
  { value: "Agriculteur",       label: "Agriculteur(rice)" },
  { value: "Autre",             label: "Autre" },
];

export default function ClientForm() {
  const navigate     = useNavigate();
  const { id }       = useParams<{ id: string }>();
  const isEdit       = !!id;

  const personQ      = usePerson(id ?? "");
  const createPerson = useCreatePerson();
  const updatePerson = useUpdatePerson();

  const [f, setF] = useState({
    prenom:       "",
    nom:          "",
    telephone:    "",
    email:        "",
    adresse:      "",
    profession:   "",
    observations: "",
  });
  const [errors, setErrors] = useState<string[]>([]);

  // Pré-remplir en mode édition
  useEffect(() => {
    const p = personQ.data?.data;
    if (p && isEdit) {
      setF({
        prenom:       p.prenom    ?? "",
        nom:          p.nom       ?? "",
        telephone:    p.telephone ?? "",
        email:        p.email     ?? "",
        adresse:      p.adresse   ?? "",
        profession:   p.profession ?? "",
        observations: p.observations ?? "",
      });
    }
  }, [personQ.data, isEdit]);

  function set(k: keyof typeof f) {
    return (v: string) => setF((p) => ({ ...p, [k]: v }));
  }

  function validate() {
    const errs: string[] = [];
    if (!f.nom.trim())       errs.push("Nom requis");
    if (!f.telephone.trim()) errs.push("Téléphone requis");
    return errs;
  }

  function handleSave() {
    const errs = validate();
    if (errs.length) { setErrors(errs); return; }

    const handleError = (err: unknown) => {
      const apiErr = err as ApiError;
      const fieldErrors = apiErr.errors
        ? Object.values(apiErr.errors).flat()
        : [apiErr.message ?? "Erreur lors de l'enregistrement"];
      setErrors(fieldErrors);
    };

    if (isEdit) {
      updatePerson.mutate(
        {
          id: id!,
          data: {
            nom:          f.nom.trim(),
            prenom:       f.prenom.trim() || undefined,
            telephone:    f.telephone.trim(),
            email:        (f.email.trim() || undefined) as string | undefined,
            observations: (f.observations.trim() || undefined) as string | undefined,
          },
        },
        {
          onSuccess: () => navigate(-1),
          onError:   handleError,
        },
      );
    } else {
      createPerson.mutate(
        {
          nom:          f.nom.trim(),
          prenom:       f.prenom.trim() || null,
          telephone:    f.telephone.trim(),
          email:        f.email.trim()        || null,
          adresse:      f.adresse.trim()      || null,
          profession:   f.profession          || null,
          observations: f.observations.trim() || null,
          statut:       "CLIENT",
        },
        {
          onSuccess: () => navigate("/clients", { replace: true }),
          onError:   handleError,
        },
      );
    }
  }

  const isPending = createPerson.isPending || updatePerson.isPending;
  const title     = isEdit ? "Modifier le client" : "Nouveau client";

  if (isEdit && personQ.isLoading) {
    return (
      <div className="flex flex-col h-full">
        <ScreenHeader title={title} onBack={() => navigate(-1)} />
        <div className="flex-1 flex items-center justify-center" style={{ background: COLORS.bg }}>
          <Loader2 size={28} color={COLORS.muted} className="animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title={title} onBack={() => navigate(-1)} />

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
            options={PROFESSIONS}
          />

          <TextArea
            label="Observations"
            value={f.observations}
            onChange={set("observations")}
            placeholder="Notes importantes, préférences, historique…"
          />
        </div>
      </div>

      <div
        className="px-4 py-3 flex-shrink-0"
        style={{ background: "#fff", borderTop: `1px solid ${COLORS.border}` }}
      >
        <button
          type="button"
          disabled={isPending}
          className="w-full rounded-xl py-4 font-montserrat font-bold text-base active:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ background: COLORS.success, color: "#fff" }}
          onClick={handleSave}
        >
          {isPending
            ? <><Loader2 size={18} className="animate-spin" /> Enregistrement…</>
            : <><UserPlus size={18} /> {isEdit ? "Mettre à jour" : "Enregistrer le client"}</>
          }
        </button>
      </div>
    </div>
  );
}
