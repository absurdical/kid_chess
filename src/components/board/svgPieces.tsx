// src/components/board/svgPieces.tsx
import * as React from "react";

type SVGPieceProps = React.SVGProps<SVGSVGElement> & { fill?: string; stroke?: string };
const Base = ({ children, ...rest }: React.PropsWithChildren<SVGPieceProps>) => (
  <svg viewBox="0 0 100 100" width="1em" height="1em" {...rest}>{children}</svg>
);

export const PawnSVG = ({ fill = "#FFE9AA", stroke = "#7A5CE6", ...rest }: SVGPieceProps) => (
  <Base {...rest}>
    <circle cx="50" cy="32" r="16" fill={fill} stroke={stroke} strokeWidth="4" />
    <rect x="38" y="46" width="24" height="22" rx="8" fill={fill} stroke={stroke} strokeWidth="4" />
    <rect x="28" y="72" width="44" height="12" rx="6" fill={fill} stroke={stroke} strokeWidth="4" />
  </Base>
);

export const RookSVG = ({ fill = "#C7E9FF", stroke = "#7A5CE6", ...rest }: SVGPieceProps) => (
  <Base {...rest}>
    <rect x="24" y="20" width="52" height="18" rx="4" fill={fill} stroke={stroke} strokeWidth="4" />
    <rect x="30" y="36" width="40" height="40" rx="8" fill={fill} stroke={stroke} strokeWidth="4" />
    <rect x="22" y="76" width="56" height="12" rx="6" fill={fill} stroke={stroke} strokeWidth="4" />
  </Base>
);

export const KnightSVG = ({ fill = "#FFD1DC", stroke = "#7A5CE6", ...rest }: SVGPieceProps) => (
  <Base {...rest}>
    <path d="M62 20c-16 2-22 12-28 22l10 6-10 12v16h40V56c0-8-6-14-12-18l6-8c2-3-1-12-6-10z"
      fill={fill} stroke={stroke} strokeWidth="4" />
    <circle cx="58" cy="32" r="3" fill={stroke} />
  </Base>
);

export const BishopSVG = ({ fill = "#D7F6CF", stroke = "#7A5CE6", ...rest }: SVGPieceProps) => (
  <Base {...rest}>
    <path d="M50 18c8 8 10 14 10 20s-2 10-10 10-10-4-10-10 2-12 10-20z" fill={fill} stroke={stroke} strokeWidth="4"/>
    <rect x="38" y="52" width="24" height="14" rx="6" fill={fill} stroke={stroke} strokeWidth="4"/>
    <rect x="30" y="68" width="40" height="12" rx="6" fill={fill} stroke={stroke} strokeWidth="4"/>
  </Base>
);

export const QueenSVG = ({ fill = "#FFE0A8", stroke = "#7A5CE6", ...rest }: SVGPieceProps) => (
  <Base {...rest}>
    <path d="M30 40c6 6 14 8 20 8s14-2 20-8l-6-12-8 8-6-12-6 12-8-8-6 12z"
      fill={fill} stroke={stroke} strokeWidth="4"/>
    <rect x="34" y="50" width="32" height="18" rx="8" fill={fill} stroke={stroke} strokeWidth="4"/>
    <rect x="26" y="72" width="48" height="12" rx="6" fill={fill} stroke={stroke} strokeWidth="4"/>
  </Base>
);

export const KingSVG = ({ fill = "#FFF2B8", stroke = "#7A5CE6", ...rest }: SVGPieceProps) => (
  <Base {...rest}>
    <rect x="48" y="16" width="4" height="12" fill={stroke} />
    <rect x="44" y="20" width="12" height="4" fill={stroke} />
    <path d="M30 40c6 6 14 8 20 8s14-2 20-8l-8 28H38L30 40z"
      fill={fill} stroke={stroke} strokeWidth="4"/>
    <rect x="28" y="72" width="44" height="12" rx="6" fill={fill} stroke={stroke} strokeWidth="4"/>
  </Base>
);

export function pieceSVG(type: string, color: "w" | "b") {
  const fillLight = color === "w";
  const common = { style: { fontSize: "2.2rem" } } as const;
  switch (type) {
    case "p": return <PawnSVG {...common} fill={fillLight ? "#FFF6CF" : "#DCD3FF"} />;
    case "r": return <RookSVG {...common} fill={fillLight ? "#C7E9FF" : "#B0D4FF"} />;
    case "n": return <KnightSVG {...common} fill={fillLight ? "#FFD1DC" : "#FFB3C7"} />;
    case "b": return <BishopSVG {...common} fill={fillLight ? "#D7F6CF" : "#BBEAAE"} />;
    case "q": return <QueenSVG {...common} fill={fillLight ? "#FFE0A8" : "#FFC66C"} />;
    case "k": return <KingSVG {...common} fill={fillLight ? "#FFF2B8" : "#FFD97A"} />;
    default: return null;
  }
}
