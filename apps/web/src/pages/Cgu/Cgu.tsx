import { LegalPage } from "../../components/LegalPage/LegalPage";

export function Cgu() {
  return (
    <LegalPage title="Conditions générales d'utilisation">
      <section className="stack">
        <h2>Objet</h2>
        <p>
          ORÉNYS est un accompagnement à l'entrepreneuriat. Le compte permet d'accéder à l'espace
          personnel. Les chapitres, le mentor et les outils arriveront par étapes.
        </p>
      </section>
      <section className="stack">
        <h2>Décisions</h2>
        <p>
          La personne reste l'auteur de ses décisions. ORÉNYS ne promet ni clients, ni statut
          obtenu, ni réussite de l'activité.
        </p>
      </section>
      <section className="stack">
        <h2>Compte</h2>
        <p>Le compte est personnel. Le mot de passe ne se partage pas.</p>
      </section>
      <section className="stack">
        <h2>Droit applicable</h2>
        <p>Droit français. Tribunal compétent : [À compléter].</p>
      </section>
    </LegalPage>
  );
}
