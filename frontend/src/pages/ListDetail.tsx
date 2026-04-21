import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Trash2, Film, Search, BarChart3, Star, Calendar as CalendarIcon, Filter, Share2, User, Users } from "lucide-react";
import { Tv } from "lucide-react";
import { format } from "date-fns";
import { getList, getSharedLists, removeMovieFromList, addMovieToList, shareList, unshareList, type MovieList, type MovieListItem, type SharedList, type UserMovieRating, getSharedListDetail } from "@/lib/movieLists";
import { getMovieDetails, searchMovies, getPosterUrl, getGenres } from "@/lib/tmdb";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { PLATFORMS, PlatformBadge } from "@/components/UserRating";
import { getFollowing, getCurrentUserProfile } from "@/lib/profile"; // ✅ import adicionado
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
import { getMovieRatingsList, getUserRatings, type RatingResponse } from "@/lib/ratings";
import { getImageUrl } from "@/lib/files";
import { link } from "fs";

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
  const [sharedList, setSharedList] = useState<SharedList | null>(null);
  const [movieGenres, setMovieGenres] = useState<Record<number, number[]>>({});
  const [movieRatings, setRatings] = useState<Record<number, RatingResponse>>({});
  const [showChart, setShowChart] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareSearch, setShareSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showSharedUsers, setShowSharedUsers] = useState(false);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [following, setFollowing] = useState<{ name: string; profileName: string; avatar: string }[]>([]);
  const [currentUser, setCurrentUser] = useState<{
    profileName: string;
    avatar: string | null;
  } | null>(null);

  // Filters
  const [genreFilter, setGenreFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [datePreset, setDatePreset] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [ratingFilter, setRatingFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");

  const loadList = async () => {
    if (!id) return;

    try {
      const data = await getList(id);
      setList(data);
    } catch {
      try {
        const shared = await getSharedListDetail(id);
        setSharedList(shared);
        setList(shared.list);
      } catch {
        setList(undefined);
      }
    }
  };

  useEffect(() => {
    getCurrentUserProfile()
      .then((u) =>
        setCurrentUser({
          profileName: u.profileName,
          avatar: u.avatar ?? null,
        })
      )
      .catch(() => setCurrentUser(null));
  }, []);

  useEffect(() => {
    loadList();
  }, [id]);

  useEffect(() => {
    if (showShare) {
      getFollowing().then(setFollowing).catch(() => { });
    }
  }, [showShare]);

  useEffect(() => {
    if (!list?.movies) return;

    async function fetchRatings() {
      try {
        const userRatings = await getMovieRatingsList(list.id);
        const map: Record<number, RatingResponse> = {};
        userRatings.forEach((r) => {
          map[r.movieId] = r;
        });
        setRatings(map);
      } catch (err) {
        console.error("Erro ao carregar avaliações:", err);
      }
    }

    fetchRatings();
  }, [list]);

  useEffect(() => {
    if (!list?.movies) return;

    async function fetchGenres() {
      const map: Record<number, number[]> = {};

      await Promise.all(
        list!.movies.map(async (movie) => {
          try {
            const data = await getMovieDetails(movie.id);
            map[movie.id] = data.genres?.map((g: { id: number; name: string }) => g.id) || [];
          } catch (err) {
            console.error("Erro ao buscar gêneros:", movie.id, err);
          }
        })
      );

      setMovieGenres(map);
    }

    fetchGenres();
  }, [list]);

  useEffect(() => {
    if (!list?.id) return;

    const loadShared = async () => {
      try {
        const data = await getSharedListDetail(list.id);
        setSharedList(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadShared();
  }, [list?.id]);

  const getMovieSharedRatings = (movieId: number) => {
    if (!sharedList?.ratings) return [];

    return sharedList.ratings.filter(r => r.movieId === movieId);
  };

  const toggleUserSelection = (profileName: string) => {
    setSelectedUsers((prev) =>
      prev.includes(profileName) ? prev.filter((u) => u !== profileName) : [...prev, profileName]
    );
  };

  const sharedUsers = useMemo(() => {
    if (!sharedList?.ratings) return [];

    const map = new Map();

    sharedList.ratings.forEach(r => {
      if (!map.has(r.profileName)) {
        map.set(r.profileName, {
          profileName: r.profileName,
          name: r.profileName,
          avatar: r.avatar ?? null
        });
      }
    });

    return Array.from(map.values());
  }, [sharedList]);

  const filteredFollowing = useMemo(() => {
    if (!list) return [];

    const sharedSet = new Set(sharedUsers.map(u => u.profileName));
    const availableUsers = following.filter(u => !sharedSet.has(u.profileName));

    if (!shareSearch.trim()) return availableUsers;

    const q = shareSearch.toLowerCase();
    return availableUsers.filter(
      u => u.name.toLowerCase().includes(q) || u.profileName.toLowerCase().includes(q)
    );
  }, [following, shareSearch, list, sharedUsers]);

  const handleShare = async () => {
    if (selectedUsers.length === 0 || !list) return;

    try {
      await shareList(list.id, selectedUsers);

      const updatedShared = await getSharedListDetail(list.id);

      setSharedList(updatedShared);
      setList(updatedShared.list);

      setSelectedUsers([]);
      setShareSearch("");
      setShowShare(false);
    } catch (err) {
      console.error("Erro ao compartilhar lista:", err);
    }
  };

  const handleUnshare = async (profileName: string) => {
    if (!list) return;
    try {
      await unshareList(list.id, profileName);
      const updatedSharedList = await getSharedListDetail(list.id);
      setSharedList(updatedSharedList);
      await loadList();
    } catch (err) {
      console.error("Erro ao remover usuário da lista:", err);
    }
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

  const allGenres = useMemo(() => {
    if (!list || !genres) return new Map<number, string>();
    const map = new Map<number, string>();
    list.movies.forEach((movie) => {
      const gIds = movieGenres[movie.id] || [];
      gIds.forEach((gid) => {
        const g = genres.find((g) => g.id === gid);
        if (g) map.set(gid, g.name);
      });
    });
    return map;
  }, [list, genres, movieGenres]);

  const genreChartData = useMemo(() => {
    if (!list || !genres) return [];
    const counts: Record<number, number> = {};
    list.movies.forEach((movie) => {
      const gIds = movieGenres[movie.id] || [];
      gIds.forEach((gid) => {
        counts[gid] = (counts[gid] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([id, count]) => ({
        name: genres.find((g) => g.id === Number(id))?.name || `ID ${id}`,
        value: count,
      }))
      .sort((a, b) => b.value - a.value);
  }, [list, genres, movieGenres]);

  const genreMoviesMap = useMemo(() => {
    if (!list || !genres) return new Map<string, string[]>();
    const map = new Map<string, string[]>();

    list.movies.forEach((movie) => {
      (movieGenres[movie.id] || []).forEach((gid) => {
        const genreName = genres.find((g) => g.id === gid)?.name;
        if (!genreName) return;
        if (!map.has(genreName)) map.set(genreName, []);
        map.get(genreName)!.push(movie.title);
      });
    });

    return map;
  }, [list, genres, movieGenres]);

  const totalMovies = list?.movies.length ?? 0;
  const totalGenres = genreChartData.length;

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
      const rating = movieRatings[movie.id];
      if (genreFilter !== "all") {
        const gIds = movieGenres[movie.id] || [];
        if (!gIds.includes(Number(genreFilter))) return false;
      }
      if (platformFilter !== "all") {
        if (platformFilter === "none") {
          if (rating?.platform) return false;
        } else {
          if (rating?.platform !== platformFilter) return false;
        }
      }
      if (datePreset !== "all" && rating?.createdAt) {
        const range = getDateRange();
        const ratingDate = new Date(rating.createdAt + "T00:00:00");
        if (range.from) {
          const from = new Date(range.from);
          from.setHours(0, 0, 0, 0);
          if (ratingDate < from) return false;
        }
        if (range.to) {
          const to = new Date(range.to);
          to.setHours(0, 0, 0, 0);
          if (ratingDate > to) return false;
        }
      } else if (datePreset !== "all" && !rating?.createdAt) {
        return false;
      }
      if (ratingFilter !== "all") {
        if (!rating || rating.rating !== Number(ratingFilter)) return false;
      }
      if (userFilter !== "all") {
        const hasUserRating = sharedList?.ratings?.some(
          (r) =>
            r.movieId === movie.id &&
            r.profileName === userFilter &&
            r.rating !== null
        );

        if (!hasUserRating) return false;
      }
      return true;
    });
  }, [list, movieRatings, movieGenres, genreFilter, platformFilter, datePreset, dateFrom, dateTo, ratingFilter, userFilter]);

  const handleSearch = () => setSearchTerm(query);

  const handleAddMovie = async (movie: { id: number; title: string; poster_path: string | null; vote_average: number; genre_ids: number[] }) => {
    if (!id) return;
    const item: MovieListItem = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      genre_ids: movieGenres[movie.id] || [],
    };
    await addMovieToList(id, item);
    await loadList();
  };

  const handleRemove = async (movieId: number) => {
    if (!id) return;
    await removeMovieFromList(id, movieId);
    await loadList();
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

        {list.isShared && sharedList?.sharedBy && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <img
              src={getImageUrl(sharedList.sharedBy.avatar)}
              alt={sharedList.sharedBy.profileName}
              className="h-6 w-6 rounded-full"
            />

            <span>
              Lista de{" "}
              {sharedList.sharedBy.profileName === currentUser?.profileName ? (
                <Link to={`/perfil`} className="font-semibold hover:text-blue-300 transition-colors">
                  <strong>{sharedList.sharedBy.profileName}</strong>
                </Link>
              ) : (
                <Link to={`/usuario/${sharedList.sharedBy.profileName}`} className="font-semibold hover:text-blue-300 transition-colors">
                  <strong>{sharedList.sharedBy.profileName}</strong>
                </Link>
              )}
            </span>
          </div>
        )}

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
                    <div className="pt-4 pb-2 overflow-visible flex gap-6">
                      <div className="flex-1">
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
                                maxWidth: "220px",
                              }}
                              content={({ active, payload }) => {
                                if (!active || !payload?.length) return null;
                                const genreName = payload[0].name as string;
                                const count = payload[0].value as number;
                                const movies = genreMoviesMap.get(genreName) || [];

                                return (
                                  <div
                                    style={{
                                      backgroundColor: "hsl(215, 25%, 16%)",
                                      border: "1px solid hsl(215, 20%, 25%)",
                                      borderRadius: "8px",
                                      padding: "10px 12px",
                                      maxWidth: "220px",
                                    }}
                                  >
                                    <p style={{ color: "white", fontWeight: 600, marginBottom: 6 }}>
                                      {genreName} ({count} {count === 1 ? "filme" : "filmes"})
                                    </p>
                                    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                                      {movies.map((title) => (
                                        <li
                                          key={title}
                                          style={{
                                            color: "hsl(215, 20%, 75%)",
                                            fontSize: "11px",
                                            paddingTop: "2px",
                                            borderTop: "1px solid hsl(215, 20%, 25%)",
                                            marginTop: "3px",
                                          }}
                                        >
                                          {title}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                );
                              }}
                            />
                            <Legend
                              verticalAlign="bottom"
                              wrapperStyle={{ paddingTop: "30px" }}
                              formatter={(value) => <span style={{ color: "white", fontSize: "13px" }}>{value}</span>}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="w-[180px] flex flex-col gap-4 justify-center">
                        <div className="rounded-lg border border-border bg-card p-4 text-center">
                          <p className="text-xs text-muted-foreground">Filmes na lista</p>
                          <p className="text-2xl font-bold text-foreground">{totalMovies}</p>
                        </div>
                        <div className="rounded-lg border border-border bg-card p-4 text-center">
                          <p className="text-xs text-muted-foreground">Gêneros diferentes</p>
                          <p className="text-2xl font-bold text-foreground">{totalGenres}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-8 text-center">Nenhum dado de gênero disponível.</p>
                  )}
                </DialogContent>
              </Dialog>
            )}
            {list.owner !== false && (
              <Dialog open={showShare} onOpenChange={(v) => {
                setShowShare(v);
                if (!v) { setShareSearch(""); setSelectedUsers([]); }
              }}>
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
                          key={user.profileName}
                          onClick={() => toggleUserSelection(user.profileName)}
                          className={cn(
                            "flex items-center gap-3 rounded-md border p-2.5 cursor-pointer transition-colors",
                            selectedUsers.includes(user.profileName)
                              ? "border-primary bg-primary/10"
                              : "border-border bg-card hover:bg-accent"
                          )}
                        >
                          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                            {user.avatar ? (
                              <img src={getImageUrl(user.avatar)} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-sm font-medium text-muted-foreground">
                                {user.profileName.charAt(1).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-card-foreground truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.profileName}</p>
                          </div>
                          <div className={cn(
                            "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                            selectedUsers.includes(user.profileName) ? "border-primary bg-primary" : "border-muted-foreground"
                          )}>
                            {selectedUsers.includes(user.profileName) && (
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
                      <Button size="sm" disabled={selectedUsers.length === 0} onClick={handleShare}>
                        <Share2 className="mr-1.5 h-4 w-4" />
                        Compartilhar{selectedUsers.length > 0 ? ` (${selectedUsers.length})` : ""}
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            )}
            {sharedUsers.length > 0 && (
              <Dialog open={showSharedUsers} onOpenChange={setShowSharedUsers}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" title="Ver usuários compartilhados">
                    <Users className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[450px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Compartilhada com ({sharedUsers.length})
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-2 max-h-[400px] overflow-y-auto space-y-2">
                    {sharedUsers.map((user) => (
                      <div
                        key={user.profileName}
                        className="flex items-center justify-between gap-3 rounded-md border border-border bg-card p-2.5 hover:bg-accent transition-colors"
                      >
                        <Link
                          to={`/usuario/${user.profileName}`}
                          onClick={() => setShowSharedUsers(false)}
                          className="flex flex-1 items-center gap-3 min-w-0"
                        >
                          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                            {user.avatar ? (
                              <img
                                src={getImageUrl(user.avatar)}
                                alt={user.profileName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium text-muted-foreground">
                                {user.profileName.charAt(1).toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-card-foreground truncate">
                              {user.profileName}
                            </p>
                          </div>
                        </Link>

                        {list.owner !== false && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                            onClick={() => handleUnshare(user.profileName)}
                            title="Remover usuário"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}
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
                            <img src={getPosterUrl(movie.poster_path, "w185")!} alt={movie.title} className="h-16 w-11 rounded object-cover" />
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
                  {Array.from(allGenres.entries()).sort(([, a], [, b]) => a.localeCompare(b)).map(([id, name]) => (
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

              {sharedUsers.length > 0 && (
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os usuários</SelectItem>
                    {sharedUsers.map((u) => (
                      <SelectItem key={u.profileName} value={u.profileName}>
                        <span className="flex items-center gap-2">
                          <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                            {u.avatar ? (
                              <img src={getImageUrl(u.avatar)} alt={u.name} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-[10px] font-medium text-muted-foreground">{u.profileName.charAt(1).toUpperCase()}</span>
                            )}
                          </span>
                          {u.profileName}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

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
        )}

        <div className="mt-6 border-t border-border" />

        {list.movies.length === 0 ? (
          <div className="mt-20 flex flex-col items-center text-center">
            <Film className="h-16 w-16 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">Lista vazia</p>
            <p className="mt-1 text-sm text-muted-foreground">Adicione filmes usando o botão acima</p>
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
              const rating = movieRatings[movie.id];
              const ratingDate = rating?.createdAt
                ? new Date(rating.createdAt + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
                : null;

              const normalize = (p?: string | null) => p?.replace(/^@/, "").toLowerCase() ?? "";

              const othersRatings = (list.isShared)
                ? (getMovieSharedRatings(movie.id) || []).filter(
                  (r) =>
                    normalize(r.profileName) !== normalize(currentUser.profileName) &&
                    r.rating !== null &&
                    r.rating !== undefined
                )
                : [];

              return (
                <div key={movie.id} className="group relative overflow-visible rounded-lg border border-border bg-card animate-fade-in">
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

                      {othersRatings.length > 0 && (
                        <div className="space-y-1.5 pb-1.5 border-b border-border">
                          {othersRatings.map((r) => (
                            <div key={r.profileName} className="flex items-center gap-2 text-xs text-muted-foreground">

                              <div className="relative h-5 w-5 shrink-0">

                                <Link
                                  to={`/usuario/${r.profileName}`}
                                  className="peer block h-5 w-5 rounded-full overflow-hidden bg-muted"
                                >
                                  {r.avatar ? (
                                    <img
                                      src={getImageUrl(r.avatar)}
                                      alt={r.profileName}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center h-full w-full text-[9px]">
                                      {r.profileName.charAt(1).toUpperCase()}
                                    </div>
                                  )}
                                </Link>

                                {/* Tooltip */}
                                <div
                                  className="
              pointer-events-none
              absolute bottom-full left-1/2 -translate-x-1/2 mb-2
              whitespace-nowrap
              rounded-md bg-popover border border-border
              px-2 py-1 text-[10px] text-popover-foreground
              shadow-md
              opacity-0 scale-95
              transition-all duration-150
              peer-hover:opacity-100 peer-hover:scale-100
            "
                                >
                                  {r.profileName}
                                </div>

                              </div>

                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < r.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground"
                                      }`}
                                  />
                                ))}
                              </div>

                            </div>
                          ))}
                        </div>
                      )}

                      {rating && (
                        <>
                          <div className="flex items-center gap-0.5">
                            {list.isShared && (
                              <div className="relative h-7 w-7 shrink-0">

                                <Link
                                  to={`/perfil`}
                                  className="peer block h-7 w-7 rounded-full overflow-hidden bg-muted"
                                >
                                  <img
                                    src={getImageUrl(currentUser?.avatar)}
                                    alt={currentUser.profileName}
                                    className="h-7 w-7 rounded-full object-cover"
                                  />
                                </Link>
                                {/* Tooltip */}
                                <div
                                  className="
              pointer-events-none
              absolute bottom-full left-1/2 -translate-x-1/2 mb-2
              whitespace-nowrap
              rounded-md bg-popover border border-border
              px-2 py-1 text-[10px] text-popover-foreground
              shadow-md
              opacity-0 scale-95
              transition-all duration-150
              peer-hover:opacity-100 peer-hover:scale-100
            "
                                >
                                  {currentUser?.profileName}
                                </div>

                              </div>
                            )}
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`h-3.5 w-3.5 ${s <= rating.rating ? "fill-star text-star" : "fill-transparent text-star-empty"}`}
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