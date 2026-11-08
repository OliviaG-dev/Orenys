import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export function RessourcesEspace() {
  useDocumentTitle("Ressources");

  return (
    <div className="stack">
      <h1>Ressources</h1>
      <p className="prose">
        Les guides du chapitre en cours et le carnet personnel apparaîtront ici. Pour l'instant,
        l'étagère est vide, et c'est voulu.
      </p>
    </div>
  );
}
