import { Link } from "react-router";
import { stages } from "../../content/stages";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import "./Home.css";

export function Home() {
  useDocumentTitle("ORÉNYS");

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Accompagnement à l'entrepreneuriat</p>
        <h1>Le début de tout ce que tu peux devenir.</h1>
        <p className="prose">
          Une envie, une idée, ou un projet déjà en route. ORÉNYS t'aide à voir clair, puis à
          avancer une étape à la fois.
        </p>
        <div className="hero-actions">
          <Link className="orenys-button orenys-button-primary" to="/inscription">
            Commencer mon chemin
          </Link>
          <Link className="orenys-button orenys-button-secondary" to="/parcours">
            Voir le parcours
          </Link>
        </div>
      </section>
      <section className="home-section">
        <h2>Vouloir entreprendre ne dit pas par où commencer.</h2>
        <p className="prose muted">
          Les formulaires existent. Le chemin, plus rarement. ORÉNYS part de la personne : ce
          qu'elle sait faire, ce qu'elle peut tenir, et ce qu'elle cherche à construire.
        </p>
      </section>
      <section className="home-section">
        <h2>Huit chapitres, une tâche à la fois.</h2>
        <ol className="chapter-rail">
          {stages.map((stage) => (
            <li key={stage.index}>
              <span>{stage.index}</span>
              <strong>{stage.name}</strong>
              <p className="muted">{stage.task}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="home-section">
        <h2>Le mentor éclaire. Tu décides.</h2>
        <p className="prose muted">
          Il distinguera ce qui est sûr de ce qui est supposé. Dans cette première version, le
          compte et le chemin s'ouvrent. La conversation viendra ensuite.
        </p>
        <div className="hero-actions">
          <Link className="orenys-button orenys-button-primary" to="/inscription">
            Créer mon compte
          </Link>
        </div>
      </section>
    </main>
  );
}
