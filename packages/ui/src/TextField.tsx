import type { InputHTMLAttributes } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export function TextField({ label, hint, error, id, name, ...props }: TextFieldProps) {
  const fieldId = id ?? name ?? label.toLowerCase().replace(/\s+/g, "-");
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;

  return (
    <div className="orenys-field">
      <label htmlFor={fieldId}>{label}</label>
      <input
        id={fieldId}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...props}
      />
      {error ? (
        <p id={`${fieldId}-error`} role="alert">
          {error}
        </p>
      ) : null}
      {hint && !error ? <p id={`${fieldId}-hint`}>{hint}</p> : null}
    </div>
  );
}
