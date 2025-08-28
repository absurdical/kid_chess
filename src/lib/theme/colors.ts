// src/lib/theme/colors.ts
export const boardColorPairs = {
  tealCream: {
    light: "#EAF6F2", // cream-mint
    dark: "#A7E1D0",  // soft teal
  },
  lavenderButter: {
    light: "#FFF6CF", // butter yellow
    dark: "#DCD3FF",  // lavender
  },
  peachMint: {
    light: "#FFE7DA", // peach cream
    dark: "#CFF4E5",  // mint
  },
} as const;

// pick your default pair here
export const defaultBoardPair = boardColorPairs.lavenderButter;
