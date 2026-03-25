import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STORAGE_KEY = "tmetrage_ratings";

export const PLATFORMS = [
  { value: "netflix", label: "Netflix" },
  { value: "prime", label: "Prime Video" },
  { value: "disney", label: "Disney+" },
  { value: "hbo", label: "HBO Max" },
  { value: "apple", label: "Apple TV+" },
  { value: "paramount", label: "Paramount+" },
  { value: "crunchyroll", label: "Crunchyroll" },
  { value: "globoplay", label: "Globoplay" },
  { value: "cinema", label: "Cinema" },
  { value: "other", label: "Outro" },
] as const;

export interface RatingEntry {
  rating: number;
  date: string; // ISO string
  platform?: string;
}

export function getRatings(): Record<string, RatingEntry> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  const parsed = JSON.parse(raw);
  // Migrate old format (number) to new format ({rating, date})
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

function saveRating(movieId: number, rating: number, platform?: string) {
  const ratings = getRatings();
  ratings[movieId] = { rating, date: new Date().toISOString(), platform };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
}

function clearRating(movieId: number) {
  const ratings = getRatings();
  delete ratings[movieId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
}

interface UserRatingProps {
  movieId: number;
}

const UserRating = ({ movieId }: UserRatingProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [platform, setPlatform] = useState<string>("");

  useEffect(() => {
    const saved = getRatings()[movieId];
    if (saved) {
      setRating(saved.rating);
      setPlatform(saved.platform || "");
    }
  }, [movieId]);

  const handleClick = (value: number) => {
    if (value === rating) {
      setRating(0);
      setPlatform("");
      clearRating(movieId);
    } else {
      setRating(value);
      saveRating(movieId, value, platform || undefined);
    }
  };

  const handlePlatformChange = (value: string) => {
    const newPlatform = value === "none" ? "" : value;
    setPlatform(newPlatform);
    if (rating > 0) {
      saveRating(movieId, rating, newPlatform || undefined);
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
              className="transition-transform hover:scale-125 focus:outline-none"
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
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
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
