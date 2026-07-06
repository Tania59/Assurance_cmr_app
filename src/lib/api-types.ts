// Types correspondant exactement aux réponses de l'API Laravel

export interface Person {
  id:               string;
  full_name:        string;
  nom:              string;
  prenom:           string | null;
  telephone:        string;
  email:            string | null;
  adresse:          string | null;
  profession:       string | null;
  statut:           'CLIENT' | 'PROSPECT';
  date_conversion:  string | null;
  source:           string | null;
  niveau_interet:   'CHAUD' | 'TIEDE' | 'FROID' | null;
  date_relance:     string | null;
  score_risque:     number;
  observations:     string | null;
  created_at:       string;
}

export interface Contract {
  id:                   string;
  numero:               string;
  type_assurance:       string;
  type_label:           string;
  formule:              string | null;
  date_effet:           string | null;
  date_echeance:        string | null;
  statut:               'ACTIF' | 'RESILIE' | 'SUSPENDU' | 'EN_ATTENTE' | 'RENOUVELE';
  prime:                string;
  notes:                string | null;
  is_expiring_soon:     boolean;
  contrat_precedent_id: string | null;
  personne_id:          string;
  created_at:           string;
}

export interface Relance {
  id:              string;
  type:            string;
  statut:          'PLANIFIEE' | 'EFFECTUEE' | 'ANNULEE';
  date_planifiee:  string | null;
  date_effectuee:  string | null;
  resultat:        string | null;
  note:            string | null;
  personne_id:     string;
  contrat_id:      string | null;
  person?:         Person;
  created_at:      string;
}
