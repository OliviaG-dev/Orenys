import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export function Atelier() {
  useDocumentTitle("Atelier");

  return (
    <div className="stack">
      <h1>Atelier</h1>
      <p className="prose">
        Les scénarios financiers s'ouvriront avec les Fondations. Les démarches, avec l'Ascension.
        Aucun dépôt ne partira depuis ORÉNYS.
      </p>
    </div>
  );
}
