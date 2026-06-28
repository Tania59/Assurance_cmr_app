import { useState } from "react";
import { Home, Users, Clock, Bell, User, Target, Calendar, Activity, BarChart2, FileText } from "lucide-react";

// Hooks
import { usePWA } from "../shared/hooks/usePWA";
import { useLocalStorage } from "../shared/hooks/useLocalStorage";

// Types
import type { Role, Screen, Client } from "../shared/types";

// Constants
import { SEED_CLIENTS } from "../shared/constants/seed"; // Supprimer SEED_PROSPECTS
import { COLORS } from "../shared/constants/colors";

// Components
import { BottomTabBar } from "../shared/components/layout/BottomTabBar";

// Features - Auth
import { LoginScreen } from "../features/auth/pages/LoginScreen";

// Features - Dashboard
import { ProducerDashboard } from "../features/dashboard/pages/ProducerDashboard";
import { CommercialDashboard } from "../features/dashboard/pages/CommercialDashboard";
import { PromoterDashboard } from "../features/dashboard/pages/PromoterDashboard";

// Features - Clients
import { ClientsList } from "../features/clients/pages/ClientsList";
import { ClientDetail } from "../features/clients/pages/ClientDetail";
import { ClientForm } from "../features/clients/pages/ClientForm";

// Features - Prospects
import { PipelineScreen } from "../features/prospects/pages/PipelineScreen";
import { ProspectDetail } from "../features/prospects/pages/ProspectDetail";
import { ProspectForm } from "../features/prospects/pages/ProspectForm";
import { useProspects } from "../features/prospects/hooks/useProspects";

// Features - Contracts
import { EcheancesScreen } from "../features/contracts/pages/EcheancesScreen";

// Features - Relances
import { RelancesScreen } from "../features/relances/pages/RelancesScreen";

// Features - Calendrier
import { CalendrierScreen } from "../features/calendrier/pages/CalendrierScreen";

// Features - Equipe
import { EquipeScreen } from "../features/equipe/pages/EquipeScreen";

// Features - Profil
import { ProfilScreen } from "../features/profil/pages/ProfilScreen";

// Types pour les tabs
type TabDef = { key: Screen; icon: React.ReactNode; label: string };

export default function App() {
  usePWA();

  const [role, setRole] = useState<Role | null>(null);
  const [screen, setScreen] = useState<Screen>("login");
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedProspectId, setSelectedProspectId] = useState<number | null>(null); // AJOUT
  const [convertPre, setConvertPre] = useState<Partial<Client> | null>(null);

  const [clients, setClients] = useLocalStorage<Client[]>("assur_clients", SEED_CLIENTS);
  const { prospects, setProspects, updateStatut } = useProspects();

  const navigate = (s: Screen) => setScreen(s);

  const openClient = (id: number) => {
    setSelectedClientId(id);
    setScreen("prod_client_detail");
  };

  const openProspect = (id: number) => {
    setSelectedProspectId(id);
    setScreen("comm_prospect_detail");
  };

  const handleLogin = (r: Role) => {
    setRole(r);
    setScreen(r === "producteur" ? "prod_home" : r === "commercial" ? "comm_home" : "prom_home");
  };

  const handleLogout = () => {
    setRole(null);
    setScreen("login");
  };

  const handleSaveClient = (c: Client) => {
    setClients((prev) => [...prev, c]);
    setSelectedClientId(c.id);
    setScreen("prod_client_detail");
  };

  const handleSaveProspect = (p: any) => {
    setProspects((prev) => [...prev, p]);
    setScreen("comm_prospects");
  };

  const handleConvertProspect = (pre: Partial<Client>) => {
    setConvertPre(pre);
    setScreen("prod_client_new");
  };

  const handleUpdateProspectStatut = (id: number, s: any) => {
    updateStatut(id, s);
  };

  const handleAddContrat = (clientId: number) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      alert(
        `Ajout d'un contrat pour ${client.prenom} ${client.nom}\n\n` +
        `Dans la version finale, un formulaire s'ouvrira ici.\n` +
        `Tu pourras choisir le type de contrat, le montant, etc.`
      );
    }
  };

  // Tabs par rôle
  const prodTabs: TabDef[] = [
    { key: "prod_home", icon: <Home size={22} />, label: "Accueil" },
    { key: "prod_clients", icon: <Users size={22} />, label: "Clients" },
    { key: "prod_echeances", icon: <Clock size={22} />, label: "Échéances" },
    { key: "prod_relances", icon: <Bell size={22} />, label: "Relances" },
    { key: "prod_profil", icon: <User size={22} />, label: "Profil" },
  ];

  const commTabs: TabDef[] = [
    { key: "comm_home", icon: <Home size={22} />, label: "Accueil" },
    { key: "comm_prospects", icon: <Target size={22} />, label: "Prospects" },
    { key: "comm_calendrier", icon: <Calendar size={22} />, label: "Calendrier" },
    { key: "comm_activites", icon: <Activity size={22} />, label: "Activités" },
    { key: "comm_profil", icon: <User size={22} />, label: "Profil" },
  ];

  const promTabs: TabDef[] = [
    { key: "prom_home", icon: <Home size={22} />, label: "Accueil" },
    { key: "prom_stats", icon: <BarChart2 size={22} />, label: "Stats" },
    { key: "prom_equipe", icon: <Users size={22} />, label: "Équipe" },
    { key: "prom_rapports", icon: <FileText size={22} />, label: "Rapports" },
    { key: "prom_profil", icon: <User size={22} />, label: "Profil" },
  ];

  const tabsByRole = role === "producteur" ? prodTabs : role === "commercial" ? commTabs : promTabs;

  const selectedClient = clients.find((c) => c.id === selectedClientId) ?? null;
  const selectedProspect = prospects.find((p) => p.id === selectedProspectId) ?? null;

  const isSubScreen = ["prod_client_detail", "prod_client_new", "comm_prospect_detail", "comm_prospect_new"].includes(
    screen
  );

  const renderScreen = () => {
    switch (screen) {
      // Producteur
      case "prod_home":
        return <ProducerDashboard clients={clients} navigate={navigate} openClient={openClient} />;
      case "prod_clients":
        return <ClientsList clients={clients} navigate={navigate} openClient={openClient} />;
      case "prod_client_detail":
        return selectedClient ? (
          <ClientDetail
            client={selectedClient}
            onBack={() => setScreen("prod_clients")}
            onAddContrat={handleAddContrat}
          />
        ) : (
          <ClientsList clients={clients} navigate={navigate} openClient={openClient} />
        );
      case "prod_client_new":
        return (
          <ClientForm
            onSave={handleSaveClient}
            onBack={() => setScreen(convertPre ? "comm_prospect_detail" : "prod_clients")}
            initialData={convertPre ?? undefined}
          />
        );
      case "prod_echeances":
        return <EcheancesScreen clients={clients} />;
      case "prod_relances":
        return <RelancesScreen clients={clients} />;
      case "prod_profil":
        return <ProfilScreen role="producteur" onLogout={handleLogout} />;

      // Commercial
      case "comm_home":
        return <CommercialDashboard prospects={prospects} navigate={navigate} />;
      case "comm_prospects":
        return <PipelineScreen prospects={prospects} setProspects={setProspects} navigate={navigate} />;
      case "comm_prospect_new":
        return <ProspectForm onSave={handleSaveProspect} onBack={() => setScreen("comm_prospects")} />;
      case "comm_prospect_detail":
        return selectedProspect ? (
          <ProspectDetail
            prospect={selectedProspect}
            onBack={() => setScreen("comm_prospects")}
            onConvert={handleConvertProspect}
            onUpdateStatut={handleUpdateProspectStatut}
          />
        ) : (
          <PipelineScreen prospects={prospects} setProspects={setProspects} navigate={navigate} />
        );
      case "comm_calendrier":
        return <CalendrierScreen prospects={prospects} />;
      case "comm_activites":
        return (
          <div className="flex flex-col h-full">
            <div className="px-4 pt-5 pb-4 flex-shrink-0" style={{ background: COLORS.secondary }}>
              <h1 className="font-montserrat font-extrabold text-xl" style={{ color: "#fff" }}>
                Activités
              </h1>
            </div>
            <div className="flex-1 flex items-center justify-center pb-20" style={{ background: COLORS.bg }}>
              <div className="text-center px-8">
                <Activity size={40} color={COLORS.muted} className="mx-auto mb-3" />
                <p className="font-montserrat font-bold text-base" style={{ color: COLORS.text }}>
                  Journal des activités
                </p>
                <p className="font-inter text-sm mt-1" style={{ color: COLORS.muted }}>
                  Suivi complet des actions commerciales
                </p>
              </div>
            </div>
          </div>
        );
      case "comm_profil":
        return <ProfilScreen role="commercial" onLogout={handleLogout} />;

      // Promoteur
      case "prom_home":
        return <PromoterDashboard navigate={navigate} />;
      case "prom_stats":
        return (
          <div className="flex flex-col h-full">
            <div className="px-4 pt-5 pb-4 flex-shrink-0" style={{ background: COLORS.primary }}>
              <h1 className="font-montserrat font-extrabold text-xl" style={{ color: "#fff" }}>
                Statistiques
              </h1>
            </div>
            <div className="flex-1 flex items-center justify-center pb-20" style={{ background: COLORS.bg }}>
              <div className="text-center px-8">
                <BarChart2 size={40} color={COLORS.muted} className="mx-auto mb-3" />
                <p className="font-montserrat font-bold text-base" style={{ color: COLORS.text }}>
                  Statistiques avancées
                </p>
                <p className="font-inter text-sm mt-1" style={{ color: COLORS.muted }}>
                  Graphiques et indicateurs de performance
                </p>
              </div>
            </div>
          </div>
        );
      case "prom_equipe":
        return <EquipeScreen />;
      case "prom_rapports":
        return (
          <div className="flex flex-col h-full">
            <div className="px-4 pt-5 pb-4 flex-shrink-0" style={{ background: COLORS.primary }}>
              <h1 className="font-montserrat font-extrabold text-xl" style={{ color: "#fff" }}>
                Rapports
              </h1>
            </div>
            <div className="flex-1 flex items-center justify-center pb-20" style={{ background: COLORS.bg }}>
              <div className="text-center px-8">
                <FileText size={40} color={COLORS.muted} className="mx-auto mb-3" />
                <p className="font-montserrat font-bold text-base" style={{ color: COLORS.text }}>
                  Rapports mensuels
                </p>
                <p className="font-inter text-sm mt-1" style={{ color: COLORS.muted }}>
                  Export PDF disponible prochainement
                </p>
              </div>
            </div>
          </div>
        );
      case "prom_profil":
        return <ProfilScreen role="promoteur" onLogout={handleLogout} />;

      default:
        return null;
    }
  };

  if (screen === "login") {
    return (
      <div className="flex justify-center min-h-screen" style={{ background: COLORS.primary }}>
        <div className="w-full max-w-[414px]">
          <LoginScreen onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center" style={{ minHeight: "100svh", background: "#CBD5E1" }}>
      <div
        className="w-full max-w-[414px] relative flex flex-col overflow-hidden"
        style={{ minHeight: "100svh", background: COLORS.bg }}
      >
        <div className="flex-1 flex flex-col overflow-hidden relative">{renderScreen()}</div>
        {!isSubScreen && role && <BottomTabBar tabs={tabsByRole} active={screen} navigate={navigate} />}
      </div>
    </div>
  );
}