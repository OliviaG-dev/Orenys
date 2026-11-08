export type Stage = {
  index: string;
  name: string;
  task: string;
};

export const stages: Stage[] = [
  { index: "01", name: "Le Réveil", task: "Nommer ce qui t'appelle" },
  { index: "02", name: "La Boussole", task: "Faire le point sur tes appuis" },
  { index: "03", name: "La Forge", task: "Donner une forme à ton offre" },
  { index: "04", name: "L'Épreuve du réel", task: "Aller vérifier dehors" },
  { index: "05", name: "Les Fondations", task: "Voir si le projet tient" },
  { index: "06", name: "L'Ascension", task: "Préparer le cadre et les premiers gestes" },
  { index: "07", name: "Le Premier Pas", task: "Rendre le projet visible" },
  { index: "08", name: "L'Envol", task: "Choisir la suite" },
];
