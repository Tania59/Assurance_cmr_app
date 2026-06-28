import { AlertTriangle } from "lucide-react";
import { COLORS } from "../../../shared/constants/colors";
import { EQUIPE } from "../../../shared/constants/seed";
import { ScreenHeader } from "../../../shared/components/layout/ScreenHeader";
import { Avatar } from "../../../shared/components/ui/Avatar";

export function EquipeScreen() {
  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title="Mon Équipe" />
      <div className="flex-1 overflow-y-auto pb-20" style={{ background: COLORS.bg }}>
        <div className="px-4 pt-4 flex flex-col gap-3">
          {EQUIPE.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-xl p-4"
              style={{ border: `1.5px solid ${m.relancesRetard > 2 ? "#FEE2E2" : COLORS.border}` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar
                  nom={m.nom.split(" ")[1] ?? "X"}
                  prenom={m.nom.split(" ")[0]}
                  size={40}
                  bg={COLORS.secondary}
                />
                <div className="flex-1">
                  <p className="font-montserrat font-bold text-sm" style={{ color: COLORS.text }}>
                    {m.nom}
                  </p>
                  <span
                    className="font-inter text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: m.role === "Producteur" ? "#EFF6FF" : "#F0FDF4",
                      color: m.role === "Producteur" ? COLORS.secondary : COLORS.success,
                    }}
                  >
                    {m.role}
                  </span>
                </div>
                {m.relancesRetard > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "#FEE2E2" }}>
                    <AlertTriangle size={12} color={COLORS.alert} />
                    <span className="font-jetbrains text-xs font-semibold" style={{ color: COLORS.alert }}>
                      {m.relancesRetard}
                    </span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                <div className="text-center">
                  <p className="font-jetbrains font-bold text-lg" style={{ color: COLORS.primary }}>
                    {m.clients}
                  </p>
                  <p className="font-inter text-xs" style={{ color: COLORS.muted }}>
                    Clients
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-jetbrains font-bold text-lg" style={{ color: COLORS.success }}>
                    {m.contratsActifs}
                  </p>
                  <p className="font-inter text-xs" style={{ color: COLORS.muted }}>
                    Actifs
                  </p>
                </div>
                <div className="text-center">
                  <p
                    className="font-jetbrains font-bold text-lg"
                    style={{
                      color:
                        m.conversion >= 80
                          ? COLORS.success
                          : m.conversion >= 70
                          ? COLORS.orange
                          : COLORS.alert,
                    }}
                  >
                    {m.conversion}%
                  </p>
                  <p className="font-inter text-xs" style={{ color: COLORS.muted }}>
                    Conversion
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}