import { LogOut, ShieldCheck } from "lucide-react";
import type { Role } from "../../../shared/types";
import { COLORS } from "../../../shared/constants/colors";
import { ScreenHeader } from "../../../shared/components/layout/ScreenHeader";

interface ProfilScreenProps {
  role: Role;
  onLogout: () => void;
}

export function ProfilScreen({ role, onLogout }: ProfilScreenProps) {
  const cfg: Record<
    Role,
    { nom: string; email: string; agence: string; badge: string; color: string }
  > = {
    producteur: {
      nom: "Mamadou Coulibaly",
      email: "mamadou.c@assur-ci.com",
      agence: "Agence Abidjan Plateau",
      badge: "Producteur Senior",
      color: COLORS.primary,
    },
    commercial: {
      nom: "Fatima Sow",
      email: "fatima.sow@assur-ci.com",
      agence: "Agence Dakar Centre",
      badge: "Commercial",
      color: COLORS.secondary,
    },
    promoteur: {
      nom: "Issa Traoré",
      email: "issa.traore@assur-ci.com",
      agence: "Direction Régionale Ouest",
      badge: "Promoteur",
      color: COLORS.gold,
    },
  };
  const p = cfg[role];

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title="Mon Profil" />
      <div className="flex-1 overflow-y-auto pb-20" style={{ background: COLORS.bg }}>
        <div
          className="mx-4 mt-4 bg-white rounded-xl p-5 flex flex-col items-center"
          style={{ border: `1px solid ${COLORS.border}` }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center font-montserrat font-extrabold text-2xl mb-3"
            style={{ background: p.color, color: "#fff" }}
          >
            {p.nom
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <p className="font-montserrat font-extrabold text-lg" style={{ color: COLORS.text }}>
            {p.nom}
          </p>
          <span
            className="mt-1 font-inter text-sm px-3 py-1 rounded-full font-semibold"
            style={{ background: p.color + "20", color: p.color }}
          >
            {p.badge}
          </span>
          <p className="font-inter text-sm mt-2" style={{ color: COLORS.muted }}>
            {p.email}
          </p>
          <p className="font-inter text-sm" style={{ color: COLORS.muted }}>
            {p.agence}
          </p>
        </div>

        {/* PWA install tip */}
        <div
          className="mx-4 mt-3 rounded-xl p-4 flex items-start gap-3"
          style={{ background: "#EFF6FF", border: `1px solid #BFDBFE` }}
        >
          <div className="p-2 rounded-lg" style={{ background: COLORS.secondary, flexShrink: 0 }}>
            <ShieldCheck size={16} color="#fff" />
          </div>
          <div>
            <p className="font-montserrat font-bold text-sm" style={{ color: COLORS.secondary }}>
              Installer l'application
            </p>
            <p className="font-inter text-xs mt-0.5" style={{ color: COLORS.muted }}>
              Appuyez sur "Partager" puis "Ajouter à l'écran d'accueil" pour un accès hors
              connexion.
            </p>
          </div>
        </div>

        <div
          className="mx-4 mt-3 bg-white rounded-xl p-4"
          style={{ border: `1px solid ${COLORS.border}` }}
        >
          <p className="font-montserrat font-bold text-sm mb-3" style={{ color: COLORS.text }}>
            Ce mois
          </p>
          <div className="flex gap-4">
            <div className="text-center flex-1">
              <p className="font-jetbrains font-bold text-xl" style={{ color: COLORS.primary }}>
                {role === "producteur" ? "8" : role === "commercial" ? "6" : "4"}
              </p>
              <p className="font-inter text-xs" style={{ color: COLORS.muted }}>
                {role === "producteur" ? "Clients" : role === "commercial" ? "Prospects" : "Membres"}
              </p>
            </div>
            <div className="text-center flex-1">
              <p className="font-jetbrains font-bold text-xl" style={{ color: COLORS.success }}>
                {role === "producteur" ? "76%" : role === "commercial" ? "62%" : "79%"}
              </p>
              <p className="font-inter text-xs" style={{ color: COLORS.muted }}>
                Objectif
              </p>
            </div>
            <div className="text-center flex-1">
              <p className="font-jetbrains font-bold text-xl" style={{ color: COLORS.gold }}>
                {role === "producteur" ? "4.8" : role === "commercial" ? "4.5" : "4.9"}
              </p>
              <p className="font-inter text-xs" style={{ color: COLORS.muted }}>
                Score
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 mt-4">
          <button
            className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-montserrat font-bold text-sm"
            style={{ background: "#FEE2E2", color: COLORS.alert }}
            onClick={onLogout}
          >
            <LogOut size={18} /> Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}