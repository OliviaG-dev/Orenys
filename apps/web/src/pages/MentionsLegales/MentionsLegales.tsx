import { LegalPage } from "../../components/LegalPage/LegalPage";

export function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales">
      <section className="stack">
        <h2>Éditeur</h2>
        <p>Raison sociale : [À compléter]</p>
        <p>Forme juridique : [À compléter]</p>
        <p>SIRET : [À compléter]</p>
        <p>Siège social : [À compléter]</p>
        <p>Contact : [Adresse e-mail à compléter]</p>
        <p>Directeur de la publication : [À compléter]</p>
      </section>
      <section className="stack">
        <h2>Hébergeur</h2>
        <p>Nom : [À compléter]</p>
        <p>Adresse : [À compléter]</p>
        <p>Contact : [À compléter]</p>
      </section>
    </LegalPage>
  );
}
