// Maps TMDB genre names (pt-BR) to HSL color pairs [bg, text]
const genreColorMap: Record<string, { bg: string; text: string }> = {
  "Ação": { bg: "hsl(0, 72%, 51%)", text: "hsl(0, 0%, 100%)" },
  "Aventura": { bg: "hsl(25, 95%, 53%)", text: "hsl(0, 0%, 100%)" },
  "Animação": { bg: "hsl(280, 65%, 55%)", text: "hsl(0, 0%, 100%)" },
  "Comédia": { bg: "hsl(48, 96%, 53%)", text: "hsl(0, 0%, 10%)" },
  "Crime": { bg: "hsl(215, 25%, 27%)", text: "hsl(0, 0%, 90%)" },
  "Documentário": { bg: "hsl(142, 55%, 40%)", text: "hsl(0, 0%, 100%)" },
  "Drama": { bg: "hsl(220, 70%, 50%)", text: "hsl(0, 0%, 100%)" },
  "Família": { bg: "hsl(330, 65%, 55%)", text: "hsl(0, 0%, 100%)" },
  "Fantasia": { bg: "hsl(265, 80%, 60%)", text: "hsl(0, 0%, 100%)" },
  "História": { bg: "hsl(35, 50%, 45%)", text: "hsl(0, 0%, 100%)" },
  "Terror": { bg: "hsl(0, 0%, 15%)", text: "hsl(0, 72%, 51%)" },
  "Música": { bg: "hsl(340, 75%, 55%)", text: "hsl(0, 0%, 100%)" },
  "Mistério": { bg: "hsl(250, 40%, 40%)", text: "hsl(0, 0%, 100%)" },
  "Romance": { bg: "hsl(350, 80%, 60%)", text: "hsl(0, 0%, 100%)" },
  "Ficção científica": { bg: "hsl(185, 75%, 40%)", text: "hsl(0, 0%, 100%)" },
  "Cinema TV": { bg: "hsl(200, 30%, 45%)", text: "hsl(0, 0%, 100%)" },
  "Thriller": { bg: "hsl(15, 70%, 45%)", text: "hsl(0, 0%, 100%)" },
  "Guerra": { bg: "hsl(100, 30%, 35%)", text: "hsl(0, 0%, 100%)" },
  "Faroeste": { bg: "hsl(30, 60%, 40%)", text: "hsl(0, 0%, 100%)" },
};

const fallbackColors = [
  { bg: "hsl(199, 89%, 48%)", text: "hsl(0, 0%, 100%)" },
  { bg: "hsl(160, 60%, 45%)", text: "hsl(0, 0%, 100%)" },
  { bg: "hsl(270, 60%, 55%)", text: "hsl(0, 0%, 100%)" },
];

export function getGenreColor(genreName: string): { bg: string; text: string } {
  if (genreColorMap[genreName]) return genreColorMap[genreName];
  // Deterministic fallback based on string hash
  let hash = 0;
  for (let i = 0; i < genreName.length; i++) {
    hash = genreName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return fallbackColors[Math.abs(hash) % fallbackColors.length];
}
