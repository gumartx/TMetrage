import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Film, BarChart3, Star, Filter } from "lucide-react";
import { getPublicListByUser, type MovieList } from "@/lib/movieLists";
import { getMovieDetails, getPosterUrl, getGenres } from "@/lib/tmdb";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getImageUrl } from "@/lib/files";

const UserListDetail = () => {
  const { username, id } = useParams<{ username: string; id: string }>();
  const navigate = useNavigate();
  const [list, setList] = useState<MovieList | undefined>();
  const [movieGenres, setMovieGenres] = useState<Record<number, number[]>>({});
  const [showChart, setShowChart] = useState(false);
  const [genreFilter, setGenreFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  useEffect(() => {
    if (!username || !id) return;
    const load = async () => {
      try {
        const data = await getPublicListByUser(username, id);
        setList(data);
      } catch {
        setList(undefined);
      }
    };
    load();
  }, [username, id]);

  useEffect(() => {
    if (!list?.movies) return;
    async function fetchGenres() {
      const map: Record<number, number[]> = {};
      await Promise.all(
        list!.movies.map(async (movie) => {
          try {
            const data = await getMovieDetails(movie.id);
            map[movie.id] = data.genres?.map((g: { id: number; name: string }) => g.id) || [];
          } catch { /* skip */ }
        })
      );
      setMovieGenres(map);
    }
    fetchGenres();
  }, [list]);

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

  const filteredMovies = useMemo(() => {
    if (!list) return [];
    return list.movies.filter((movie) => {
      if (genreFilter !== "all") {
        const gIds = movieGenres[movie.id] || [];
        if (!gIds.includes(Number(genreFilter))) return false;
      }
      if (ratingFilter !== "all") {
        if (ratingFilter === "none") {
          if (movie.rating != null && movie.rating > 0) return false;
        } else {
          if (movie.rating !== Number(ratingFilter)) return false;
        }
      }
      return true;
    });
  }, [list, movieGenres, genreFilter, ratingFilter]);

  if (!list) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Lista não encontrada ou não é pública.</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate(`/usuario/${username}/listas`)}>
            Voltar
          </Button>
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
          onClick={() => navigate(`/usuario/${username}/listas`)}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div>
            {list.ownerUser && (
              <div className="mb-2 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {list.ownerUser.avatar ? (
                    <img src={getImageUrl(list.ownerUser.avatar)} alt={list.ownerUser.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {list.ownerUser.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </span>
                <Link to={`/usuario/${username}`} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  {list.ownerUser.profileName}
                </Link>
              </div>
            )}

            <h1 className="font-display text-2xl font-bold text-foreground">{list.name}</h1>
            {list.description && (
              <p className="mt-1 text-sm text-muted-foreground">{list.description}</p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              {list.movies.length} {list.movies.length === 1 ? "filme" : "filmes"}
              {filteredMovies.length !== list.movies.length && ` (${filteredMovies.length} exibidos)`}
            </p>
          </div>

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
        </div>

        {/* Filtros: gênero + nota */}
        {list.movies.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
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

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Nota" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as notas</SelectItem>
                <SelectItem value="none">Sem avaliação</SelectItem>
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
          </div>
        )}

        <div className="mt-6 border-t border-border" />

        {list.movies.length === 0 ? (
          <div className="mt-20 flex flex-col items-center text-center">
            <Film className="h-16 w-16 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">Lista vazia</p>
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
              return (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                >
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
                    <h3 className="truncate text-sm font-semibold text-card-foreground">
                      {movie.title}
                    </h3>
                    {movie.rating != null && movie.rating > 0 ? (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-3.5 w-3.5 ${s <= movie.rating!
                                ? "fill-star text-star"
                                : "fill-transparent text-star-empty"
                              }`}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Sem avaliação</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserListDetail;