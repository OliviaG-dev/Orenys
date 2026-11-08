import type { SVGProps } from "react";

export function BrandMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M16 4 L18.2 13.2 L27 15.2 L18.2 17.2 L16 26.4 L13.8 17.2 L5 15.2 L13.8 13.2 Z"
      />
      <path
        d="M20 19.5 C23 21.5 25 24 29 21"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
