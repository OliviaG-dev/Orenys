import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export function Projet() {
  useDocumentTitle("Mon projet");

  return (
    <div className="stack">
      <h1>Mon projet</h1>
      <p className="prose">
        L'offre, les personnes destinataires, les hypothèses et la synthèse chiffrée vivront ici.
        La Forge produira la première pièce.
      </p>
    </div>
  );
}
