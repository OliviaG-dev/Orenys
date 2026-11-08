import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export function Ressources() {
  useDocumentTitle("Ressources");

  return (
    <main className="page stack">
      <h1>Des guides, au moment où ils servent.</h1>
      <p className="prose">
        Les ressources publiques arriveront avec les chapitres. Chaque guide sera lié à une étape,
        et les pages administratives citeront une source officielle datée.
      </p>
    </main>
  );
}
