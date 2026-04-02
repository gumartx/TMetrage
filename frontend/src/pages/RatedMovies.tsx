import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Star, Filter, ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PLATFORMS, PlatformBadge } from "@/components/UserRating";
import { getUserRatings } from "@/lib/ratings";
import { getMovieDetails, getPosterUrl, type MovieDetails } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { Tv } from "lucide-react";

const GENRE_NAMES: Record<number, string> = {
  28: "Ação", 12: "Aventura", 16: "Animação", 35: "Comédia", 80: "Crime",
  99: "Documentário", 18: "Drama", 10751: "Família", 14: "Fantasia",
  36: "História", 27: "Terror", 10402: "Música", 9648: "Mistério",
  10749: "Romance", 878: "Ficção científica", 10770: "Cinema TV",
  53: "Thriller", 10752: "Guerra", 37: "Faroeste",
};

interface RatedMovie {
  movie: MovieDetails;
  rating: number;
  date: string;
  platform?: string;
}

const DATE_PRESETS = [
  { label: "Todos", value: "all" },
  { label: "Última semana", value: "7d" },
  { label: "Último mês", value: "30d" },
  { label: "Últimos 3 meses", value: "90d" },
  { label: "Último ano", value: "1y" },
  { label: "Personalizado", value: "custom" },
];

const RatedMovies = () => {
  const [ratedMovies, setRatedMovies] = useState<RatedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [datePreset, setDatePreset] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [ratingFilter, setRatingFilter] = useState("all");

  useEffect(() => {
    const loadRatedMovies = async () => {
      try {
        const ratings = await getUserRatings();
        if (ratings.length === 0) {
          setLoading(false);
          return;
        }

        const results: RatedMovie[] = [];
        for (const entry of ratings) {
          try {
            const movie = await getMovieDetails(entry.movieId);
            results.push({ movie, rating: entry.rating, date: entry.createdAt, platform: entry.platform });
          } catch {
            // skip failed fetches
          }
        }
        results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRatedMovies(results);
      } catch (err) {
        console.error("Erro ao carregar avaliações:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRatedMovies();
  }, []);

  // Collect all genres from rated movies
  const allGenres = new Map<number, string>();
  ratedMovies.forEach((rm) =>
    rm.movie.genres.forEach((g) => allGenres.set(g.id, g.name))
  );

  const getDateRange = (): { from?: Date; to?: Date } => {
    if (datePreset === "custom") {
      return { from: dateFrom, to: dateTo };
    }
    if (datePreset === "all") return {};
    const now = new Date();
    const from = new Date();
    switch (datePreset) {
      case "7d": from.setDate(now.getDate() - 7); break;
      case "30d": from.setDate(now.getDate() - 30); break;
      case "90d": from.setDate(now.getDate() - 90); break;
      case "1y": from.setFullYear(now.getFullYear() - 1); break;
    }
    return { from, to: now };
  };

  const filtered = ratedMovies.filter((rm) => {
    const matchesSearch = !searchQuery.trim() ||
      rm.movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = genreFilter === "all" ||
      rm.movie.genres.some((g) => g.id === Number(genreFilter));
    const matchesPlatform = platformFilter === "all" ||
      (platformFilter === "none" ? !rm.platform : rm.platform === platformFilter);
    const matchesRating = ratingFilter === "all" ||
      rm.rating === Number(ratingFilter);
    const range = getDateRange();
    const ratingDate = new Date(rm.date);
    const matchesDate =
      (!range.from || ratingDate >= range.from) &&
      (!range.to || ratingDate <= new Date(range.to.getTime() + 86400000));
    return matchesSearch && matchesGenre && matchesPlatform && matchesRating && matchesDate;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/perfil" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display text-2xl font-bold text-foreground">Filmes Avaliados</h1>
          <span className="text-sm text-muted-foreground">({ratedMovies.length})</span>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome do filme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os gêneros</SelectItem>
                {Array.from(allGenres.entries())
                  .sort(([, a], [, b]) => a.localeCompare(b))
                  .map(([id, name]) => (
                    <SelectItem key={id} value={String(id)}>{name}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Tv className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as plataformas</SelectItem>
                <SelectItem value="none">Não informado</SelectItem>
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
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Nota" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as notas</SelectItem>
                {[5, 4, 3, 2, 1].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    <span className="flex items-center gap-1">
                      {Array.from({ length: n }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-star text-star" />
                      ))}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={datePreset} onValueChange={(v) => {
              setDatePreset(v);
              if (v !== "custom") {
                setDateFrom(undefined);
                setDateTo(undefined);
              }
            }}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                {DATE_PRESETS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {datePreset === "custom" && (
            <div className="flex flex-wrap items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[180px] justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Data inicial"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    disabled={(date) => date > new Date() || (dateTo ? date > dateTo : false)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <span className="text-sm text-muted-foreground">até</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[180px] justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "dd/MM/yyyy") : "Data final"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    disabled={(date) => date > new Date() || (dateFrom ? date < dateFrom : false)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              {(dateFrom || dateTo) && (
                <Button variant="ghost" size="sm" onClick={() => { setDateFrom(undefined); setDateTo(undefined); }}>
                  Limpar
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg bg-muted aspect-[2/3]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {ratedMovies.length === 0
                ? "Você ainda não avaliou nenhum filme."
                : "Nenhum filme encontrado com os filtros selecionados."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((rm) => {
              const posterUrl = getPosterUrl(rm.movie.poster_path);
              const formattedDate = new Date(rm.date).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });

              return (
                <Link
                  key={rm.movie.id}
                  to={`/movie/${rm.movie.id}`}
                  className="group rounded-lg border border-border bg-card overflow-hidden transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="aspect-[2/3] overflow-hidden">
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt={rm.movie.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <span className="text-muted-foreground text-sm">Sem imagem</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 space-y-1.5">
                    <h3 className="truncate text-sm font-semibold text-card-foreground">
                      {rm.movie.title}
                    </h3>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${
                            s <= rm.rating
                              ? "fill-star text-star"
                              : "fill-transparent text-star-empty"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarIcon className="h-3 w-3" />
                      <span>{formattedDate}</span>
                    </div>
                    {rm.platform && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <PlatformBadge value={rm.platform} />
                        <span>{PLATFORMS.find((p) => p.value === rm.platform)?.label || rm.platform}</span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RatedMovies;
