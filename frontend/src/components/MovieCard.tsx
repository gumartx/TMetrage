import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Movie } from "@/lib/tmdb";
import { getPosterUrl } from "@/lib/tmdb";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const posterUrl = getPosterUrl(movie.poster_path);
  const rating = Math.round(movie.vote_average / 2 * 10) / 10; // convert to 5-star scale

  return (
    <Link to={`/movie/${movie.id}`} className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 animate-fade-in block">
      <div className="aspect-[2/3] overflow-hidden">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-muted-foreground text-sm">Sem imagem</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-semibold text-card-foreground">{movie.title}</h3>
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3.5 w-3.5 ${
                  star <= Math.round(rating)
                    ? "fill-star text-star"
                    : "fill-star-empty text-star-empty"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{movie.vote_count}</span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
