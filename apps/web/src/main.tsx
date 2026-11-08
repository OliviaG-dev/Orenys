import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./app/App";
import "@orenys/ui/styles.css";
import "./styles/base.css";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Le point d'ancrage de l'application est introuvable.");
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
