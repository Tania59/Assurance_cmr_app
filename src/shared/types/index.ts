export type Role = "producteur" | "commercial" | "promoteur";

export type Screen =
  | "login"
  | "prod_home"
  | "prod_clients"
  | "prod_client_detail"
  | "prod_client_new"
  | "prod_echeances"
  | "prod_relances"
  | "prod_profil"
  | "comm_home"
  | "comm_prospects"
  | "comm_prospect_detail"
  | "comm_prospect_new"
  | "comm_calendrier"
  | "comm_activites"
  | "comm_profil"
  | "prom_home"
  | "prom_stats"
  | "prom_equipe"
  | "prom_rapports"
  | "prom_profil";

export type StatutContrat = "Actif" | "Expiré" | "Résilié" | "En attente";

export interface Contrat {
  id: string;
  type: string;
  numero: string;
  echeance: string;
  statut: StatutContrat;
  prime: number;
  detail?: string;
}

export interface RelanceEntry {
  date: string;
  type: string;
  note: string;
  resultat: string;
}

export interface Client {
  id: number;
  nom: string;
  prenom: string;
  tel: string;
  email: string;
  adresse: string;
  profession: string;
  observations: string;
  contrats: Contrat[];
  relances: RelanceEntry[];
}

export interface Prospect {
  id: number;
  nom: string;
  tel: string;
  source: string;
  interet: string;
  statut: "Froid" | "Tiède" | "Chaud" | "Converti";
  rdv: string | null;
  note?: string;
}

export interface MembreEquipe {
  id: number;
  nom: string;
  role: string;
  clients: number;
  contratsActifs: number;
  relancesRetard: number;
  conversion: number;
}