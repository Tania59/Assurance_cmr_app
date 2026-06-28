import { useState, useMemo } from "react";
import { Search, X, Users, AlertTriangle, ChevronRight, Plus } from "lucide-react";
import type { Client, Screen } from "../../../shared/types";
import { COLORS } from "../../../shared/constants/colors";
import { daysUntil } from "../../../shared/utils/date";
import { ScreenHeader } from "../../../shared/components/layout/ScreenHeader";
import { Avatar } from "../../../shared/components/ui/Avatar";

interface ClientsListProps {
  clients: Client[];
  navigate: (s: Screen) => void;
  openClient: (id: number) => void;
}

export function ClientsList({ clients, navigate, openClient }: ClientsListProps) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      clients.filter((c) =>
        `${c.prenom} ${c.nom} ${c.tel}`.toLowerCase().includes(query.toLowerCase())
      ),
    [clients, query]
  );

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title="Mes Clients" />
      <div className="flex-1 overflow-y-auto pb-20" style={{ background: COLORS.bg }}>
        {/* Search bar */}
        <div className="px-4 pt-4 pb-3" style={{ background: COLORS.bg }}>
          <div
            className="flex items-center gap-2 px-3 rounded-xl"
            style={{
              background: "#fff",
              border: `1.5px solid ${query ? COLORS.secondary : COLORS.border}`,
            }}
          >
            <Search size={16} color={COLORS.muted} />
            <input
              className="font-inter flex-1 py-3 text-sm bg-transparent outline-none"
              style={{ color: COLORS.text }}
              placeholder="Rechercher un client…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <X size={16} color={COLORS.muted} />
              </button>
            )}
          </div>
        </div>

        <div className="px-4 flex flex-col gap-2 pb-4">
          <p className="font-inter text-xs mb-1" style={{ color: COLORS.muted }}>
            {filtered.length} client{filtered.length !== 1 ? "s" : ""}
          </p>
          {filtered.map((c) => {
            const hasAlert = c.contrats.some((ct) => {
              const d = daysUntil(ct.echeance);
              return (ct.statut === "Actif" && d >= 0 && d <= 7) || ct.statut === "Expiré";
            });
            const actifs = c.contrats.filter((ct) => ct.statut === "Actif").length;
            return (
              <button
                key={c.id}
                className="w-full bg-white rounded-xl p-4 flex items-center gap-3 text-left active:opacity-80"
                style={{
                  boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                  border: `1px solid ${COLORS.border}`,
                }}
                onClick={() => openClient(c.id)}
              >
                <Avatar nom={c.nom} prenom={c.prenom} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-montserrat font-bold text-sm truncate" style={{ color: COLORS.text }}>
                      {c.prenom} {c.nom}
                    </p>
                    {hasAlert && <AlertTriangle size={13} color={COLORS.alert} />}
                  </div>
                  <p className="font-jetbrains text-xs mt-0.5" style={{ color: COLORS.muted }}>
                    {c.tel}
                  </p>
                  <p className="font-inter text-xs mt-0.5" style={{ color: COLORS.muted }}>
                    {actifs} contrat{actifs !== 1 ? "s" : ""} actif{actifs !== 1 ? "s" : ""}
                  </p>
                </div>
                <ChevronRight size={16} color={COLORS.muted} />
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-10">
              <Users size={36} color={COLORS.muted} className="mx-auto mb-2" />
              <p className="font-inter text-sm" style={{ color: COLORS.muted }}>
                Aucun client trouvé
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <button
        className="absolute bottom-20 right-4 w-14 h-14 rounded-full flex items-center justify-center z-20"
        style={{ background: COLORS.primary, boxShadow: "0 4px 16px rgba(10,61,107,0.4)" }}
        onClick={() => navigate("prod_client_new")}
      >
        <Plus size={24} color="#fff" />
      </button>
    </div>
  );
}