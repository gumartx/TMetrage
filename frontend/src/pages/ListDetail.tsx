import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Trash2, Film, Search, BarChart3, Star, Calendar as CalendarIcon, Filter, Share2 } from "lucide-react";
import { Tv } from "lucide-react";
import { format } from "date-fns";
import { getList, removeMovieFromList, addMovieToList, shareList, type MovieList, type MovieListItem } from "@/lib/movieLists";
import { searchMovies, getPosterUrl, getGenres } from "@/lib/tmdb";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { getRatings, PLATFORMS, PlatformBadge } from "@/components/UserRating";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DATE_PRESETS = [
  { label: "Todos", value: "all" },
  { label: "Última semana", value: "7d" },
  { label: "Último mês", value: "30d" },
  { label: "Últimos 3 meses", value: "90d" },
  { label: "Último ano", value: "1y" },
  { label: "Personalizado", value: "custom" },
];

const ListDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [list, setList] = useState<MovieList | undefined>();
  const [showChart, setShowChart] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareSearch, setShareSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Filters
  const [genreFilter, setGenreFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [datePreset, setDatePreset] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [ratingFilter, setRatingFilter] = useState("all");

  useEffect(() => {
    if (id) setList(getList(id));
  }, [id]);

  const ratings = useMemo(() => getRatings(), [list]);

  // Get following list for share
  const following = useMemo(() => {
    const currentUser = localStorage.getItem("tmetrage_profile");
    if (!currentUser) return [];
    const parsed = JSON.parse(currentUser);
    const allFollowing: { username: string; name: string; avatar?: string }[] = [];
    const followingData = JSON.parse(localStorage.getItem(`following_${parsed.username}`) || "[]");
    followingData.forEach((username: string) => {
      const profile = localStorage.getItem(`profile_${username}`);
      if (profile) {
        const p = JSON.parse(profile);
        allFollowing.push({ username, name: p.name || username, avatar: p.avatar });
      } else {
        allFollowing.push({ username, name: username });
      }
    });
    return allFollowing;
  }, [showShare]);

  const filteredFollowing = useMemo(() => {
    if (!shareSearch.trim()) return following;
    const q = shareSearch.toLowerCase();
    return following.filter(
      (u) => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)
    );
  }, [following, shareSearch]);

  const toggleUserSelection = (username: string) => {
    setSelectedUsers((prev) =>
      prev.includes(username) ? prev.filter((u) => u !== username) : [...prev, username]
    );
  };

  const handleShare = () => {
    if (selectedUsers.length === 0 || !list) return;
    const profile = JSON.parse(localStorage.getItem("tmetrage_profile") || "{}");
    shareList(list, profile.username || "unknown", selectedUsers);
    setShowShare(false);
    setSelectedUsers([]);
    setShareSearch("");
  };

  const { data: searchResults } = useQuery({
    queryKey: ["list-search", searchTerm],
    queryFn: () => searchMovies(searchTerm, 1),
    enabled: searchTerm.length > 1,
  });

  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
  });

  const CHART_COLORS = [
    "hsl(199, 89%, 48%)", "hsl(45, 93%, 58%)", "hsl(142, 71%, 45%)",
    "hsl(280, 65%, 60%)", "hsl(0, 84%, 60%)", "hsl(25, 95%, 53%)",
    "hsl(330, 80%, 55%)", "hsl(180, 60%, 45%)", "hsl(210, 70%, 55%)",
    "hsl(60, 70%, 50%)",
  ];

  // Collect all genres from list movies
  const allGenres = useMemo(() => {
    if (!list || !genres) return new Map<number, string>();
    const map = new Map<number, string>();
    list.movies.forEach((m) =>
      (m.genre_ids || []).forEach((gid) => {
        const g = genres.find((g) => g.id === gid);
        if (g) map.set(gid, g.name);
      })
    );
    return map;
  }, [list, genres]);

  const genreChartData = useMemo(() => {
    if (!list || !genres || list.movies.length === 0) return [];
    const counts: Record<number, number> = {};
    list.movies.forEach((m) => {
      (m.genre_ids || []).forEach((gid) => {
        counts[gid] = (counts[gid] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([id, count]) => ({
        name: genres.find((g) => g.id === Number(id))?.name || `ID ${id}`,
        value: count,
      }))
      .sort((a, b) => b.value - a.value);
  }, [list, genres]);

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

  const filteredMovies = useMemo(() => {
    if (!list) return [];
    return list.movies.filter((movie) => {
      const rating = ratings[movie.id];

      // Genre filter
      if (genreFilter !== "all") {
        if (!(movie.genre_ids || []).includes(Number(genreFilter))) return false;
      }

      // Platform filter
      if (platformFilter !== "all") {
        if (platformFilter === "none") {
          if (rating?.platform) return false;
        } else {
          if (rating?.platform !== platformFilter) return false;
        }
      }

      // Date filter (based on rating date)
      if (datePreset !== "all" && rating?.date) {
        const range = getDateRange();
        const ratingDate = new Date(rating.date);
        if (range.from && ratingDate < range.from) return false;
        if (range.to && ratingDate > new Date(range.to.getTime() + 86400000)) return false;
      } else if (datePreset !== "all" && !rating?.date) {
        return false; // no rating date means exclude when filtering by date
      }

      // Rating filter
      if (ratingFilter !== "all") {
        if (!rating || rating.rating !== Number(ratingFilter)) return false;
      }

      return true;
    });
  }, [list, ratings, genreFilter, platformFilter, datePreset, dateFrom, dateTo, ratingFilter]);

  const handleSearch = () => {
    setSearchTerm(query);
  };

  const handleAddMovie = (movie: { id: number; title: string; poster_path: string | null; vote_average: number; genre_ids: number[] }) => {
    if (!id) return;
    const item: MovieListItem = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      genre_ids: movie.genre_ids || [],
    };
    addMovieToList(id, item);
    setList(getList(id));
  };

  const handleRemove = (movieId: number) => {
    if (!id) return;
    removeMovieFromList(id, movieId);
    setList(getList(id));
  };

  if (!list) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Lista não encontrada.</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate("/listas")}>Voltar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/listas")}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">{list.name}</h1>
            {list.description && (
              <p className="mt-1 text-sm text-muted-foreground">{list.description}</p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              {list.movies.length} {list.movies.length === 1 ? "filme" : "filmes"}
              {filteredMovies.length !== list.movies.length && ` (${filteredMovies.length} exibidos)`}
            </p>
          </div>

          <div className="flex gap-2">
            {list.movies.length > 0 && (
              <Dialog open={showChart} onOpenChange={setShowChart}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <BarChart3 className="mr-1.5 h-4 w-4" />
                    Gerar Gráfico
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[850px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Distribuição de Gêneros
                    </DialogTitle>
                  </DialogHeader>
                  {genreChartData.length > 0 ? (
                    <div className="pt-4 pb-2 overflow-visible">
                      <ResponsiveContainer width="100%" height={480}>
                        <PieChart margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
                          <Pie
                            data={genreChartData}
                            cx="50%"
                            cy="45%"
                            innerRadius={80}
                            outerRadius={130}
                            paddingAngle={3}
                            dataKey="value"
                            label={({ name, percent, x, y, textAnchor, index }) => (
                              <text x={x} y={y} textAnchor={textAnchor} fill={CHART_COLORS[index % CHART_COLORS.length]} fontSize={12} fontWeight={500}>
                                {`${name} (${(percent * 100).toFixed(0)}%)`}
                              </text>
                            )}
                            labelLine={true}
                          >
                            {genreChartData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(215, 25%, 16%)",
                              border: "1px solid hsl(215, 20%, 25%)",
                              borderRadius: "8px",
                              color: "white",
                            }}
                            formatter={(value: number) => [<span style={{ color: "white" }}>{`${value} filme${value > 1 ? "s" : ""}`}</span>, <span style={{ color: "white" }}>Quantidade</span>]}
                            labelStyle={{ color: "white" }}
                          />
                          <Legend
                            verticalAlign="bottom"
                            wrapperStyle={{ paddingTop: "30px" }}
                            formatter={(value) => <span style={{ color: "white", fontSize: "13px" }}>{value}</span>}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-8 text-center">Nenhum dado de gênero disponível.</p>
                  )}
                </DialogContent>
              </Dialog>
            )}
            <Dialog open={showShare} onOpenChange={(v) => { setShowShare(v); if (!v) { setShareSearch(""); setSelectedUsers([]); } }}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Share2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-primary" />
                    Compartilhar Lista
                  </DialogTitle>
                </DialogHeader>
                <div className="flex gap-2 pt-2">
                  <div className="flex flex-1 items-center rounded-md border border-border bg-secondary">
                    <Search className="ml-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Buscar por nome ou usuário..."
                      value={shareSearch}
                      onChange={(e) => setShareSearch(e.target.value)}
                      className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                  </div>
                </div>
                <div className="mt-2 max-h-[300px] overflow-y-auto space-y-1">
                  {filteredFollowing.length > 0 ? (
                    filteredFollowing.map((user) => (
                      <div
                        key={user.username}
                        onClick={() => toggleUserSelection(user.username)}
                        className={cn(
                          "flex items-center gap-3 rounded-md border p-2.5 cursor-pointer transition-colors",
                          selectedUsers.includes(user.username)
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card hover:bg-accent"
                        )}
                      >
                        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-sm font-medium text-muted-foreground">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-card-foreground truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                        </div>
                        <div className={cn(
                          "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                          selectedUsers.includes(user.username)
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        )}>
                          {selectedUsers.includes(user.username) && (
                            <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      {following.length === 0 ? "Você ainda não segue ninguém." : "Nenhum usuário encontrado."}
                    </p>
                  )}
                </div>
                {following.length > 0 && (
                  <div className="flex justify-end pt-2">
                    <Button
                      size="sm"
                      disabled={selectedUsers.length === 0}
                      onClick={handleShare}
                    >
                      <Share2 className="mr-1.5 h-4 w-4" />
                      Compartilhar{selectedUsers.length > 0 ? ` (${selectedUsers.length})` : ""}
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            <Dialog open={searchOpen} onOpenChange={(v) => { setSearchOpen(v); if (!v) { setQuery(""); setSearchTerm(""); } }}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Search className="mr-1.5 h-4 w-4" />
                  Adicionar Filme
                </Button>
              </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Buscar filme para adicionar</DialogTitle>
              </DialogHeader>
              <div className="flex gap-2 pt-2">
                <div className="flex flex-1 items-center rounded-md border border-border bg-secondary">
                  <input
                    type="text"
                    placeholder="Pesquisar filme..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
                <Button size="sm" onClick={handleSearch}>Buscar</Button>
              </div>
              {searchResults && (
                <div className="mt-4 space-y-2">
                  {searchResults.results.slice(0, 10).map((movie) => {
                    const alreadyAdded = list.movies.some((m) => m.id === movie.id);
                    return (
                      <div key={movie.id} className="flex items-center gap-3 rounded-md border border-border bg-card p-2">
                        {getPosterUrl(movie.poster_path, "w185") ? (
                          <img
                            src={getPosterUrl(movie.poster_path, "w185")!}
                            alt={movie.title}
                            className="h-16 w-11 rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-11 items-center justify-center rounded bg-muted">
                            <Film className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium text-card-foreground">{movie.title}</p>
                          <p className="text-xs text-muted-foreground">{movie.release_date?.slice(0, 4)}</p>
                        </div>
                        <Button
                          size="sm"
                          variant={alreadyAdded ? "secondary" : "default"}
                          disabled={alreadyAdded}
                          onClick={() => handleAddMovie(movie)}
                        >
                          {alreadyAdded ? "Adicionado" : "Adicionar"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Filters */}
        {list.movies.length > 0 && (
          <div className="mt-6 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
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
                if (v !== "custom") { setDateFrom(undefined); setDateTo(undefined); }
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
        )}

        <div className="mt-6 border-t border-border" />

        {list.movies.length === 0 ? (
          <div className="mt-20 flex flex-col items-center text-center">
            <Film className="h-16 w-16 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">Lista vazia</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Adicione filmes usando o botão acima
            </p>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="mt-20 flex flex-col items-center text-center">
            <Filter className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Nenhum filme encontrado com os filtros selecionados.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredMovies.map((movie) => {
              const url = getPosterUrl(movie.poster_path);
              const rating = ratings[movie.id];
              const ratingDate = rating?.date
                ? new Date(rating.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
                : null;

              return (
                <div key={movie.id} className="group relative overflow-hidden rounded-lg border border-border bg-card animate-fade-in">
                  <Link to={`/movie/${movie.id}`} className="block">
                    <div className="aspect-[2/3] overflow-hidden">
                      {url ? (
                        <img src={url} alt={movie.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <Film className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="p-3 space-y-1.5">
                      <h3 className="truncate text-sm font-semibold text-card-foreground">{movie.title}</h3>
                      {rating && (
                        <>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`h-3.5 w-3.5 ${
                                  s <= rating.rating
                                    ? "fill-star text-star"
                                    : "fill-transparent text-star-empty"
                                }`}
                              />
                            ))}
                          </div>
                          {ratingDate && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <CalendarIcon className="h-3 w-3" />
                              <span>{ratingDate}</span>
                            </div>
                          )}
                          {rating.platform && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <PlatformBadge value={rating.platform} />
                              <span>{PLATFORMS.find((p) => p.value === rating.platform)?.label || rating.platform}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={() => handleRemove(movie.id)}
                    className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
};

export default ListDetail;