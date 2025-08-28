// src/components/board/Square.tsx
import * as React from "react";

type SquareProps = {
  index: number; // 0..63
  lightColor: string;
  darkColor: string;
  isSelected?: boolean;
  isHint?: boolean;
  onClick?: (index: number) => void;
  children?: React.ReactNode;
};

export default function Square({
  index,
  lightColor,
  darkColor,
  isSelected,
  isHint,
  onClick,
  children,
}: SquareProps) {
  const file = index % 8;
  const rank = Math.floor(index / 8);
  const isLight = (file + rank) % 2 === 0;
  const bg = isLight ? lightColor : darkColor;

  return (
    <button
      type="button"
      className="relative aspect-square rounded-[14px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-300"
      style={{ backgroundColor: bg }}
      aria-label={`square ${file},${rank}`}
      onClick={() => onClick?.(index)}
    >
      {children && <div className="grid h-full w-full place-items-center">{children}</div>}

      {/* hint dot */}
      {isHint && (
        <span className="absolute inset-0 grid place-items-center">
          <span className="h-3 w-3 rounded-full bg-black/35 shadow" />
        </span>
      )}

      {/* selection ring */}
      {isSelected && (
        <span className="pointer-events-none absolute inset-0 rounded-[14px] ring-2 ring-purple-400/80" />
      )}
    </button>
  );
}
