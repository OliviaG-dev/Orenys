import type { ReactNode } from "react";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

type LegalPageProps = {
  title: string;
  children: ReactNode;
};

export function LegalPage({ title, children }: LegalPageProps) {
  useDocumentTitle(title);

  return (
    <main className="page stack">
      <h1>{title}</h1>
      <p className="muted">
        Texte de structure, à faire relire par un conseil avant toute mise en production. Les
        crochets signalent les informations de l'éditeur encore à compléter.
      </p>
      {children}
    </main>
  );
}
