import { useState, useMemo } from "react";
import { Search, X, Users, ChevronRight, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../../../shared/constants/colors";
import { ScreenHeader } from "../../../shared/components/layout/ScreenHeader";
import { Avatar } from "../../../shared/components/ui/Avatar";
import { usePeople } from "../../people/hooks/usePeople";

export default function ClientsList() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const { data, isLoading, isError } = usePeople({ statut: "CLIENT", per_page: 100 });

  const clients = useMemo(() => {
    const all = data?.data ?? [];
    if (!query) return all;
    const q = query.toLowerCase();
    return all.filter(
      (c) =>
        c.full_name.toLowerCase().includes(q) ||
        c.telephone.includes(q)
    );
  }, [data, query]);

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title="Mes Clients" />
      <div className="flex-1 overflow-y-auto pb-20" style={{ background: COLORS.bg }}>
        {/* Barre de recherche */}
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
          {isLoading && (
            <div className="flex justify-center py-10">
              <Loader2 size={28} color={COLORS.muted} className="animate-spin" />
            </div>
          )}

          {isError && (
            <p className="font-inter text-sm text-center py-10" style={{ color: COLORS.alert }}>
              Impossible de charger les clients.
            </p>
          )}

          {!isLoading && !isError && (
            <>
              <p className="font-inter text-xs mb-1" style={{ color: COLORS.muted }}>
                {clients.length} client{clients.length !== 1 ? "s" : ""}
              </p>

              {clients.map((c) => (
                <button
                  key={c.id}
                  className="w-full bg-white rounded-xl p-4 flex items-center gap-3 text-left active:opacity-80"
                  style={{
                    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                    border: `1px solid ${COLORS.border}`,
                  }}
                  onClick={() => navigate(`/clients/${c.id}`)}
                >
                  <Avatar nom={c.nom} prenom={c.prenom ?? ""} />
                  <div className="flex-1 min-w-0">
                    <p className="font-montserrat font-bold text-sm truncate" style={{ color: COLORS.text }}>
                      {c.full_name}
                    </p>
                    <p className="font-jetbrains text-xs mt-0.5" style={{ color: COLORS.muted }}>
                      {c.telephone}
                    </p>
                    {c.profession && (
                      <p className="font-inter text-xs mt-0.5" style={{ color: COLORS.muted }}>
                        {c.profession}
                      </p>
                    )}
                  </div>
                  <ChevronRight size={16} color={COLORS.muted} />
                </button>
              ))}

              {clients.length === 0 && (
                <div className="text-center py-10">
                  <Users size={36} color={COLORS.muted} className="mx-auto mb-2" />
                  <p className="font-inter text-sm" style={{ color: COLORS.muted }}>
                    Aucun client trouvé
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* FAB */}
      <button
        className="absolute bottom-20 right-4 w-14 h-14 rounded-full flex items-center justify-center z-20"
        style={{ background: COLORS.primary, boxShadow: "0 4px 16px rgba(10,61,107,0.4)" }}
        onClick={() => navigate("/clients/nouveau")}
      >
        <Plus size={24} color="#fff" />
      </button>
    </div>
  );
}
