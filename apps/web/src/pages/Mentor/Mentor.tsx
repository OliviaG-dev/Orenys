import { Link } from "react-router";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export function Mentor() {
  useDocumentTitle("Le mentor");

  return (
    <main className="page stack">
      <h1>Le mentor éclaire. Tu décides.</h1>
      <p className="prose">
        Une seule voix t'accompagnera. Elle séparera les faits sourcés, les hypothèses et les
        recommandations. Sans source officielle sur une règle, elle s'abstiendra.
      </p>
      <p className="prose muted">
        La conversation n'est pas encore ouverte. Tu peux déjà créer ton compte et prendre place
        sur le chemin.
      </p>
      <Link className="orenys-button orenys-button-primary" to="/inscription">
        Créer mon compte
      </Link>
    </main>
  );
}
