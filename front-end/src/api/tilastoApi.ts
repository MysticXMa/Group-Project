import { Tilasto } from "../types/tilasto";

export const fetchTilasto = async (): Promise<Tilasto[]> => {
// Mock data
  return [
    {
      ryhmä: 1,
      koulu: "Koulu A",
      joukkue: "Tiimi 1",
      rastiAjat: [120, 130, 110],
    },
    {
      ryhmä: 2,
      koulu: "Koulu B",
      joukkue: "Tiimi 2",
      rastiAjat: [140, 125, 115, 95],
    },
    {
      ryhmä: 3,
      koulu: "Koulu C",
      joukkue: "Tiimi 3",
      rastiAjat: [135, 128],
    },
  ];
};

export const saveTilasto = async (data: Tilasto[]): Promise<void> => {
  console.log("Saving tilasto data:", data);
};
