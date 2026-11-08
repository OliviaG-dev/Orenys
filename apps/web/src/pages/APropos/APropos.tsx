import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export function APropos() {
  useDocumentTitle("À propos");

  return (
    <main className="page stack">
      <h1>À propos d'ORÉNYS</h1>
      <p className="prose">
        Il y a un moment, avant le statut et avant le tableur, où une personne sait seulement que
        sa vie pourrait prendre une autre forme. ORÉNYS traite ce moment comme un commencement.
      </p>
      <p className="prose">
        La promesse est l'accompagnement : comprendre ce qui compte, choisir une direction,
        construire une offre, l'exposer au réel, puis oser le premier pas visible. La réussite ne
        se garantit pas.
      </p>
    </main>
  );
}
