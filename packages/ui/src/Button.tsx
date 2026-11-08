import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  const classes = ["orenys-button", `orenys-button-${variant}`, className].filter(Boolean).join(" ");
  return <button type={type} className={classes} {...props} />;
}
