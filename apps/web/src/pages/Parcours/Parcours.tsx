import { Link } from "react-router";
import { stages } from "../../content/stages";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export function Parcours() {
  useDocumentTitle("Le parcours");

  return (
    <main className="page stack">
      <h1>Un seul chemin, huit chapitres.</h1>
      <p className="prose">
        Tu entreras là où tu en es vraiment. Rien ne se saute en silence : une étape déjà vécue se
        confirme, elle ne disparaît pas toute seule.
      </p>
      <ol className="chapter-rail">
        {stages.map((stage) => (
          <li key={stage.index}>
            <span>{stage.index}</span>
            <strong>{stage.name}</strong>
            <p className="muted">{stage.task}</p>
          </li>
        ))}
      </ol>
      <Link className="orenys-button orenys-button-primary" to="/inscription">
        Commencer mon chemin
      </Link>
    </main>
  );
}
