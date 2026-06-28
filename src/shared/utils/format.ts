export function fmtMontant(n: number): string {
  return n.toLocaleString("fr-FR") + " FCFA";
}

export function initiales(nom: string, prenom: string): string {
  return (prenom[0] + nom[0]).toUpperCase();
}