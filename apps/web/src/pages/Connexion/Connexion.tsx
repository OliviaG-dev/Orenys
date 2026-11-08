import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { loginSchema, zodFieldErrors } from "@orenys/domain";
import { Button, TextField } from "@orenys/ui";
import { AuthCard } from "../../components/AuthCard/AuthCard";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useSession } from "../../hooks/useSession";
import { ApiRequestError } from "../../services/apiClient";
import { loginAccount } from "../../services/authService";

function safeNext(value: string | null): string {
  if (value && value.startsWith("/app") && !value.startsWith("//")) {
    return value;
  }
  return "/app";
}

export function Connexion() {
  useDocumentTitle("Connexion");
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { refresh } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setFieldErrors(Object.fromEntries(zodFieldErrors(parsed.error).map((issue) => [issue.path, issue.message])));
      return;
    }
    setFieldErrors({});
    setPending(true);
    try {
      await loginAccount(parsed.data);
      await refresh();
      navigate(safeNext(params.get("next")));
    } catch (error) {
      setFormError(error instanceof ApiRequestError ? error.message : "Le service ne répond pas. Réessaie dans un instant.");
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthCard
      title="Reprendre ton chemin"
      intro="Entre avec l'adresse utilisée à la création du compte."
      error={formError}
      onSubmit={(event) => void onSubmit(event)}
      footer={
        <>
          Pas encore de compte ? <Link to="/inscription">Commencer</Link>
        </>
      }
    >
      <TextField
        label="Adresse e-mail"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={fieldErrors.email}
        required
      />
      <TextField
        label="Mot de passe"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={fieldErrors.password}
        required
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Entrée…" : "Entrer"}
      </Button>
    </AuthCard>
  );
}
