export const PLATFORMS = [
  { value: "netflix", label: "Netflix", color: "#E50914", letter: "N" },
  { value: "prime", label: "Prime Video", color: "#00A8E1", letter: "P" },
  { value: "disney", label: "Disney+", color: "#113CCF", letter: "D" },
  { value: "hbo", label: "HBO Max", color: "#B432E8", letter: "H" },
  { value: "apple", label: "Apple TV+", color: "#555555", letter: "A" },
  { value: "paramount", label: "Paramount+", color: "#0064FF", letter: "P" },
  { value: "crunchyroll", label: "Crunchyroll", color: "#F47521", letter: "C" },
  { value: "globoplay", label: "Globoplay", color: "#E41E23", letter: "G" },
  { value: "cinema", label: "Cinema", color: "#FFB800", letter: "🎬" },
  { value: "other", label: "Outro", color: "#888888", letter: "?" },
] as const;

export const PlatformBadge = ({
  value,
  size = "sm",
}: {
  value: string;
  size?: "sm" | "md";
}) => {
  const platform = PLATFORMS.find((p) => p.value === value);
  if (!platform) return null;

  const dim = size === "sm" ? "h-4 w-4 text-[9px]" : "h-5 w-5 text-[10px]";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-sm font-bold text-white shrink-0 ${dim}`}
      style={{ backgroundColor: platform.color }}
      title={platform.label}
    >
      {platform.letter}
    </span>
  );
};