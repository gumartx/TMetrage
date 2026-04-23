import { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Search, Star, Filter, ArrowLeft, Calendar as CalendarIcon, ChevronLeft, ChevronRight, ArrowUpAZ, ArrowDownZA } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PLATFORMS, PlatformBadge } from "@/components/UserRating";
import { getMovieDetails, getPosterUrl, type MovieDetails } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { Tv } from "lucide-react";
import { getUserRatingsByProfileName } from "@/lib/ratings";

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

const PAGE_SIZE = 10;

const UserRatedMovies = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [ratedMovies, setRatedMovies] = useState<RatedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [datePreset, setDatePreset] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const genreParam = searchParams.get("genre");
  const [sortOrder, setSortOrder] = useState<"none" | "asc" | "desc">("none");

  useEffect(() => {
    if (!username) return;
    const load = async () => {
      try {
        const ratings = await getUserRatingsByProfileName(username);
        if (ratings.length === 0) { setLoading(false); return; }

        const results: RatedMovie[] = [];
        for (const entry of ratings) {
          try {
            const movie = await getMovieDetails(entry.movieId);
            results.push({ movie, rating: entry.rating, date: entry.createdAt, platform: entry.platform });
          } catch { /* skip */ }
        }
        results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRatedMovies(results);
      } catch { /* */ }
      finally { setLoading(false); }
    };
    load();
  }, [username]);

  useEffect(() => {
    if (!genreParam || ratedMovies.length === 0) return;
    const match = Array.from(allGenres.entries()).find(
      ([, name]) => name.toLowerCase() === genreParam.toLowerCase()
    );
    if (match) {
      setGenreFilter(String(match[0]));
      const next = new URLSearchParams(searchParams);
      next.delete("genre");
      setSearchParams(next, { replace: true });
    }
  }, [genreParam, ratedMovies]);

  const allGenres = new Map<number, string>();
  ratedMovies.forEach((rm) => rm.movie.genres.forEach((g) => allGenres.set(g.id, g.name)));

  const getDateRange = (): { from?: Date; to?: Date } => {
    if (datePreset === "custom") return { from: dateFrom, to: dateTo };
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
    const matchesSearch =
      !searchQuery.trim() ||
      rm.movie.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre =
      genreFilter === "all" ||
      rm.movie.genres.some((g) => g.id === Number(genreFilter));

    const matchesPlatform =
      platformFilter === "all" ||
      (platformFilter === "none"
        ? !rm.platform
        : rm.platform === platformFilter);

    const matchesRating =
      ratingFilter === "all" || rm.rating === Number(ratingFilter);

    const range = getDateRange();
    const ratingDate = new Date(rm.date + "T00:00:00");

    const from = range.from ? new Date(range.from) : null;
    const to = range.to ? new Date(range.to) : null;

    if (from) from.setHours(0, 0, 0, 0);
    if (to) to.setHours(0, 0, 0, 0);

    const matchesDate =
      (!from || ratingDate >= from) &&
      (!to || ratingDate <= to);

    return (
      matchesSearch &&
      matchesGenre &&
      matchesPlatform &&
      matchesRating &&
      matchesDate
    );
  });

  if (sortOrder === "asc") {
    filtered.sort((a, b) =>
      a.movie.title.localeCompare(b.movie.title, "pt-BR")
    );
  }

  if (sortOrder === "desc") {
    filtered.sort((a, b) =>
      b.movie.title.localeCompare(a.movie.title, "pt-BR")
    );
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleFilterChange = (fn: () => void) => {
    fn();
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(`/usuario/${username}`)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Filmes avaliados por <span className="text-primary">{username}</span>
          </h1>
          <span className="text-sm text-muted-foreground">({filtered.length})</span>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome do filme..."
                value={searchQuery}
                onChange={(e) => handleFilterChange(() => setSearchQuery(e.target.value))}
                className="pl-9"
              />
            </div>
            <Select value={genreFilter} onValueChange={(v) => handleFilterChange(() => setGenreFilter(v))}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os gêneros</SelectItem>
                {Array.from(allGenres.entries()).sort(([, a], [, b]) => a.localeCompare(b)).map(([id, name]) => (
                  <SelectItem key={id} value={String(id)}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={platformFilter} onValueChange={(v) => handleFilterChange(() => setPlatformFilter(v))}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Tv className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as plataformas</SelectItem>
                <SelectItem value="none">Não informado</SelectItem>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <span className="flex items-center gap-2"><PlatformBadge value={p.value} />{p.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={(v) => handleFilterChange(() => setRatingFilter(v))}>
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
            <Select value={datePreset} onValueChange={(v) => handleFilterChange(() => {
              setDatePreset(v);
              if (v !== "custom") { setDateFrom(undefined); setDateTo(undefined); }
            })}>
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
            <Button
              variant="outline"
              onClick={() =>
                setSortOrder((prev) =>
                  prev === "none" ? "asc" : prev === "asc" ? "desc" : "none"
                )
              }
              className="w-full sm:w-auto"
              title={
                sortOrder === "asc"
                  ? "Ordem alfabética (A-Z)"
                  : sortOrder === "desc"
                    ? "Ordem alfabética (Z-A)"
                    : "Sem ordenação"
              }
            >
              {sortOrder === "desc" ? (
                <ArrowDownZA className="h-4 w-4 mr-2" />
              ) : (
                <ArrowUpAZ className="h-4 w-4 mr-2" />
              )}
              {sortOrder === "asc" ? "A-Z" : sortOrder === "desc" ? "Z-A" : "Ordenar"}
            </Button>
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
                  <Calendar mode="single" selected={dateFrom} onSelect={(d) => handleFilterChange(() => setDateFrom(d))} disabled={(date) => date > new Date() || (dateTo ? date > dateTo : false)} initialFocus className={cn("p-3 pointer-events-auto")} />
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
                  <Calendar mode="single" selected={dateTo} onSelect={(d) => handleFilterChange(() => setDateTo(d))} disabled={(date) => date > new Date() || (dateFrom ? date < dateFrom : false)} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
              {(dateFrom || dateTo) && (
                <Button variant="ghost" size="sm" onClick={() => handleFilterChange(() => { setDateFrom(undefined); setDateTo(undefined); })}>
                  Limpar
                </Button>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg bg-muted aspect-[2/3]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {ratedMovies.length === 0 ? "Nenhum filme avaliado ainda." : "Nenhum filme encontrado com os filtros selecionados."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {paginated.map((rm) => {
                const posterUrl = getPosterUrl(rm.movie.poster_path);
                const formattedDate = new Date(rm.date + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
                return (
                  <Link key={rm.movie.id} to={`/movie/${rm.movie.id}`} className="group rounded-lg border border-border bg-card overflow-hidden transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                    <div className="aspect-[2/3] overflow-hidden">
                      {posterUrl ? (
                        <img src={posterUrl} alt={rm.movie.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <span className="text-muted-foreground text-sm">Sem imagem</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 space-y-1.5">
                      <h3 className="truncate text-sm font-semibold text-card-foreground">{rm.movie.title}</h3>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`h-3.5 w-3.5 ${s <= rm.rating ? "fill-star text-star" : "fill-transparent text-star-empty"}`} />
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

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                  .reduce<(number | "...")[]>((acc, page, idx, arr) => {
                    if (idx > 0 && page - (arr[idx - 1] as number) > 1) acc.push("...");
                    acc.push(page);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "..." ? (
                      <span key={`ellipsis-${idx}`} className="px-1 text-muted-foreground text-sm">...</span>
                    ) : (
                      <Button
                        key={item}
                        variant={currentPage === item ? "default" : "outline"}
                        size="sm"
                        className="w-9"
                        onClick={() => setCurrentPage(item as number)}
                      >
                        {item}
                      </Button>
                    )
                  )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserRatedMovies;