import { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Search, Star, Filter, ArrowLeft, Calendar as CalendarIcon, ArrowUpAZ, ArrowDownZA } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Pagination from "@/components/Pagination";
import { PLATFORMS, PlatformBadge } from "@/components/UserRating";
import { getUserRatingsByProfilePaged, type PeriodParam, type RatingResponse } from "@/lib/ratings";
import { getMovieDetails, getPosterUrl, getGenres, type MovieDetails, type Genre } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { Tv } from "lucide-react";

interface RatedMovie {
  movie: MovieDetails;
  rating: number;
  date: string;
  platform?: string;
}

const DATE_PRESETS: { label: string; value: string; period?: PeriodParam }[] = [
  { label: "Todos", value: "all" },
  { label: "Última semana", value: "7d", period: "LAST_WEEK" },
  { label: "Último mês", value: "30d", period: "LAST_MONTH" },
  { label: "Últimos 3 meses", value: "90d", period: "LAST_3_MONTHS" },
  { label: "Último ano", value: "1y", period: "LAST_YEAR" },
  { label: "Personalizado", value: "custom", period: "CUSTOM" },
];

const PAGE_SIZE = 10;

const UserRatedMovies = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const [items, setItems] = useState<RatedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [allGenres, setAllGenres] = useState<Genre[]>([]);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [datePreset, setDatePreset] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"none" | "asc" | "desc">("none");

  const [searchParams, setSearchParams] = useSearchParams();
  const genreParam = searchParams.get("genre");

  const backendSort = "createdAt,desc";

  useEffect(() => {
    getGenres().then(setAllGenres).catch(() => setAllGenres([]));
  }, []);

  useEffect(() => {
    if (!genreParam || allGenres.length === 0) return;
    const match = allGenres.find(
      (g) => g.name.toLowerCase() === genreParam.toLowerCase()
    );
    if (match) {
      setGenreFilter(String(match.id));
      const next = new URLSearchParams(searchParams);
      next.delete("genre");
      setSearchParams(next, { replace: true });
    }
  }, [genreParam, allGenres, searchParams, setSearchParams]);

  // Debounce search input -> searchQuery
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset to page 1 when backend filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, platformFilter, ratingFilter, genreFilter, datePreset, dateFrom, dateTo, username]);

  useEffect(() => {
    if (!username) return;
    let cancelled = false;

    const loadPage = async () => {
      setLoading(true);
      try {
        const params: Parameters<typeof getUserRatingsByProfilePaged>[1] = {
          page: currentPage - 1,
          size: PAGE_SIZE,
          sort: backendSort,
        };

        if (searchQuery) {
          params.title = searchQuery;
        }
        if (platformFilter !== "all" && platformFilter !== "none") {
          params.platform = platformFilter;
        }
        if (ratingFilter !== "all") {
          params.score = Number(ratingFilter);
        }
        if (genreFilter !== "all") {
          params.genreId = Number(genreFilter);
        }
        const preset = DATE_PRESETS.find((p) => p.value === datePreset);
        if (preset?.period) {
          params.period = preset.period;
          if (preset.period === "CUSTOM") {
            if (dateFrom) params.startDate = format(dateFrom, "yyyy-MM-dd");
            if (dateTo) params.endDate = format(dateTo, "yyyy-MM-dd");
          }
        }

        const page = await getUserRatingsByProfilePaged(username, params);
        if (cancelled) return;

        setTotalElements(page.totalElements);
        setTotalPages(page.totalPages);

        const enriched = await Promise.all(
          page.content.map(async (entry: RatingResponse) => {
            try {
              const movie = await getMovieDetails(entry.movieId);
              return {
                movie,
                rating: entry.rating,
                date: entry.createdAt,
                platform: entry.platform,
              } as RatedMovie;
            } catch {
              return null;
            }
          })
        );

        if (cancelled) return;
        setItems(enriched.filter((x): x is RatedMovie => x !== null));
      } catch (err) {
        console.error("Erro ao carregar avaliações:", err);
        if (!cancelled) {
          setItems([]);
          setTotalElements(0);
          setTotalPages(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPage();
    return () => {
      cancelled = true;
    };
  }, [username, currentPage, searchQuery, platformFilter, ratingFilter, genreFilter, datePreset, dateFrom, dateTo]);

  const filtered = useMemo(() => {
    const list = items.filter((rm) => {
      const matchesNoPlatform = platformFilter !== "none" || !rm.platform;
      return matchesNoPlatform;
    });

    if (sortOrder === "asc") {
      list.sort((a, b) => a.movie.title.localeCompare(b.movie.title, "pt-BR"));
    } else if (sortOrder === "desc") {
      list.sort((a, b) => b.movie.title.localeCompare(a.movie.title, "pt-BR"));
    }
    return list;
  }, [items, platformFilter, sortOrder]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(`/usuario/${username}`)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-2xl font-bold text-foreground">Filmes avaliados por <span className="text-primary">{username}</span></h1>
          <span className="text-sm text-muted-foreground">({totalElements})</span>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Pesquisar por nome do filme..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="pl-9" />
            </div>
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os gêneros</SelectItem>
                {[...allGenres]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((g) => (
                    <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>
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
                    <span className="flex items-center gap-2"><PlatformBadge value={p.value} />{p.label}</span>
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
            <Select value={datePreset} onValueChange={(v) => { setDatePreset(v); if (v !== "custom") { setDateFrom(undefined); setDateTo(undefined); } }}>
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
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} disabled={(date) => date > new Date() || (dateTo ? date > dateTo : false)} initialFocus className={cn("p-3 pointer-events-auto")} />
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
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} disabled={(date) => date > new Date() || (dateFrom ? date < dateFrom : false)} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
              {(dateFrom || dateTo) && (
                <Button variant="ghost" size="sm" onClick={() => { setDateFrom(undefined); setDateTo(undefined); }}>Limpar</Button>
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
              {totalElements === 0 ? "Nenhum filme avaliado ainda." : "Nenhum filme encontrado com os filtros selecionados."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((rm) => {
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
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => setCurrentPage(p)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserRatedMovies;
