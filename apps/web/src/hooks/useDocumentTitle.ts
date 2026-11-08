import { useEffect } from "react";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title === "ORÉNYS" ? title : `${title} · ORÉNYS`;
  }, [title]);
}
