import { stages } from "../../content/stages";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export function Chemin() {
  useDocumentTitle("Mon chemin");

  return (
    <div className="stack">
      <h1>Mon chemin</h1>
      <p className="prose">
        Les huit chapitres sont posés. Les missions ne sont pas encore ouvertes : rien ne se valide
        tant que le parcours n'est pas là.
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
    </div>
  );
}
