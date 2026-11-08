import { LegalPage } from "../../components/LegalPage/LegalPage";

export function Confidentialite() {
  return (
    <LegalPage title="Confidentialité">
      <section className="stack">
        <h2>Responsable de traitement</h2>
        <p>[Raison sociale à compléter], joignable à [adresse e-mail à compléter].</p>
      </section>
      <section className="stack">
        <h2>Données du socle</h2>
        <p>Adresse e-mail, empreinte du mot de passe, sessions de connexion.</p>
        <p>Finalité : créer le compte et maintenir la session.</p>
        <p>Base : exécution du contrat d'utilisation demandé par la personne.</p>
        <p>Durée : vie du compte pour l'adresse, trente jours pour une session active.</p>
      </section>
      <section className="stack">
        <h2>Cookies</h2>
        <p>orenys_access et orenys_refresh sont des cookies HttpOnly de session. Aucun cookie publicitaire n'est déposé.</p>
      </section>
      <section className="stack">
        <h2>Droits</h2>
        <p>
          Accès, rectification, effacement, portabilité, opposition et réclamation auprès de la CNIL.
          L'export et la suppression automatiques ne sont pas encore dans le produit : écrire à
          [adresse e-mail à compléter].
        </p>
      </section>
    </LegalPage>
  );
}
