import type { Joukkue } from "./joukkue";

export type Tilasto = Joukkue & {
  rastiAjat: number[]; // Each number represents a time in seconds for a Rasti column
};
