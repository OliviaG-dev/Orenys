import { Link } from "react-router";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export function NotFound() {
  useDocumentTitle("Page introuvable");

  return (
    <main className="page stack">
      <h1>Cette page n'est pas sur le chemin.</h1>
      <Link to="/">Revenir à l'accueil</Link>
    </main>
  );
}
