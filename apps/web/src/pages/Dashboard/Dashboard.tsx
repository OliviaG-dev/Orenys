import { Link } from "react-router";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useSession } from "../../hooks/useSession";

export function Dashboard() {
  useDocumentTitle("Accueil");
  const { user } = useSession();

  return (
    <div className="stack">
      <p className="eyebrow">Accueil</p>
      <h1>Ton chemin commence ici.</h1>
      <p className="prose">
        La première mission prendra moins de vingt minutes, dès que le parcours sera ouvert.
      </p>
      {user ? <p className="muted">{user.email}</p> : null}
      <Link className="orenys-button orenys-button-primary" to="/app/chemin">
        Voir les chapitres
      </Link>
    </div>
  );
}
