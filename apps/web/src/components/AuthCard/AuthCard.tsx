import type { FormEvent, ReactNode } from "react";
import { Card } from "@orenys/ui";
import "./AuthCard.css";

type AuthCardProps = {
  title: string;
  intro: string;
  error?: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthCard({ title, intro, error, onSubmit, children, footer }: AuthCardProps) {
  return (
    <main className="auth-page">
      <h1>{title}</h1>
      <p className="muted">{intro}</p>
      <Card>
        <form onSubmit={onSubmit} noValidate>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          {children}
        </form>
      </Card>
      <p>{footer}</p>
    </main>
  );
}
