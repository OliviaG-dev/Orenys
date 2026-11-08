import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export function MentorEspace() {
  useDocumentTitle("Mentor");

  return (
    <div className="stack">
      <h1>Mentor</h1>
      <p className="prose">
        Le mentor éclaire. Tu décides. La conversation n'est pas encore ouverte dans cette version.
        Quand elle le sera, tu verras ce qu'elle retient, et tu pourras le retirer.
      </p>
    </div>
  );
}
