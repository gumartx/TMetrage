import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { canRate, getMovieRating, createRating, updateRating, deleteRating, type RatingResponse } from "@/lib/ratings";

export const PLATFORMS = [
  { value: "NETFLIX", label: "Netflix", color: "#E50914", letter: "N" },
  { value: "PRIME_VIDEO", label: "Prime Video", color: "#00A8E1", letter: "P" },
  { value: "DISNEY_PLUS", label: "Disney+", color: "#113CCF", letter: "D" },
  { value: "HBO_MAX", label: "HBO Max", color: "#B432E8", letter: "H" },
  { value: "APPLE_TV_PLUS", label: "Apple TV+", color: "#555555", letter: "A" },
  { value: "PARAMOUNT_PLUS", label: "Paramount+", color: "#0064FF", letter: "P" },
  { value: "CRUNCHYROLL", label: "Crunchyroll", color: "#F47521", letter: "C" },
  { value: "GLOBOPLAY", label: "Globoplay", color: "#E41E23", letter: "G" },
  { value: "CINEMA", label: "Cinema", color: "#FFB800", letter: "🎬" },
  { value: "OUTRO", label: "Outro", color: "#888888", letter: "?" },
] as const;

export const PlatformBadge = ({ value, size = "sm" }: { value: string; size?: "sm" | "md" }) => {
  const platform = PLATFORMS.find((p) => p.value === value);
  if (!platform) return null;
  const dim = size === "sm" ? "h-4 w-4 text-[9px]" : "h-5 w-5 text-[10px]";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-sm font-bold text-white shrink-0 ${dim}`}
      style={{ backgroundColor: platform.color }}
      title={platform.label}
    >
      {platform.letter.length === 1 ? platform.letter : ""}
    </span>
  );
};

export interface RatingEntry {
  rating: number;
  date: string;
  platform?: string;
}

// Keep getRatings for backward compatibility (used by other pages during migration)
export function getRatings(): Record<string, RatingEntry> {
  const raw = localStorage.getItem("tmetrage_ratings");
  if (!raw) return {};
  const parsed = JSON.parse(raw);
  const result: Record<string, RatingEntry> = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (typeof value === "number") {
      result[key] = { rating: value, date: new Date().toISOString() };
    } else {
      result[key] = value as RatingEntry;
    }
  }
  return result;
}

interface UserRatingProps {
  movieId: number;
}

const UserRating = ({ movieId }: UserRatingProps) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [platform, setPlatform] = useState<string>("");
  const [ratingRecord, setRatingRecord] = useState<RatingResponse | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!canRate()) return;
    getMovieRating(movieId).then((r) => {
      if (r) {
        setRating(r.rating);
        setPlatform(r.platform ?? "");
        setRatingRecord(r);
      }
    });
  }, [movieId]);

  const handleClick = async (value: number) => {
    if (!canRate()) {
      navigate("/login");
      return;
    }
    if (saving) return;
    setSaving(true);

    try {
      if (value === rating) {
        // Remove rating
        if (ratingRecord) {
          await deleteRating(movieId);
        }
        setRating(0);
        setPlatform("");
        setRatingRecord(null);
      } else {
        if (ratingRecord) {
          // Update existing
          const updated = await updateRating(movieId, value, platform || undefined);
          setRating(value);
          setRatingRecord(updated);
        } else {
          // Create new
          const created = await createRating(movieId, value, platform || undefined);
          setRating(value);
          setRatingRecord(created);
        }
      }
    } catch (err) {
      console.error("Erro ao salvar avaliação:", err);
    } finally {
      setSaving(false);
    }
  };

  const handlePlatformChange = async (value: string) => {
    const newPlatform = value === "none" ? "" : value;
    setPlatform(newPlatform);
    if (rating > 0 && ratingRecord) {
      setSaving(true);
      try {
        const updated = await updateRating(movieId, rating, newPlatform || undefined);
        setRatingRecord(updated);
      } catch (err) {
        console.error("Erro ao atualizar plataforma:", err);
      } finally {
        setSaving(false);
      }
    }
  };

  const labels = ["", "Péssimo", "Ruim", "Regular", "Bom", "Excelente"];
  const activeValue = hover || rating;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm font-semibold text-card-foreground mb-2">Sua avaliação</p>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => handleClick(s)}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              disabled={saving}
              className="transition-transform hover:scale-125 focus:outline-none disabled:opacity-50"
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  s <= activeValue
                    ? "fill-star text-star"
                    : "fill-transparent text-star-empty hover:text-star/50"
                }`}
              />
            </button>
          ))}
        </div>
        {activeValue > 0 && (
          <span className="text-sm text-muted-foreground">{labels[activeValue]}</span>
        )}
      </div>

      {rating > 0 && (
        <div className="mt-3">
          <p className="text-xs text-muted-foreground mb-1.5">Onde você assistiu? (opcional)</p>
          <Select value={platform || "none"} onValueChange={handlePlatformChange}>
            <SelectTrigger className="w-full sm:w-[200px] h-8 text-xs">
              <SelectValue placeholder="Selecione a plataforma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Não informar</SelectItem>
              {PLATFORMS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  <span className="flex items-center gap-2">
                    <PlatformBadge value={p.value} />
                    {p.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {rating > 0 && !hover && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          Clique na mesma estrela para remover
        </p>
      )}
    </div>
  );
};

export default UserRating;
