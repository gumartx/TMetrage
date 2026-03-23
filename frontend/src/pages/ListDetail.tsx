import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Trash2, Film, Search, BarChart3 } from "lucide-react";
import { getList, removeMovieFromList, addMovieToList, type MovieList, type MovieListItem } from "@/lib/movieLists";
import { searchMovies, getPosterUrl, getGenres } from "@/lib/tmdb";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ListDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [list, setList] = useState<MovieList | undefined>();
  const [showChart, setShowChart] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (id) setList(getList(id));
  }, [id]);

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
            </p>
          </div>

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

        <div className="mt-6 border-t border-border" />

        {list.movies.length === 0 ? (
          <div className="mt-20 flex flex-col items-center text-center">
            <Film className="h-16 w-16 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">Lista vazia</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Adicione filmes usando o botão acima
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {list.movies.map((movie) => {
              const url = getPosterUrl(movie.poster_path);
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
                    <div className="p-3">
                      <h3 className="truncate text-sm font-semibold text-card-foreground">{movie.title}</h3>
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

        {/* Genre Chart */}
        {list.movies.length > 0 && (
          <section className="mt-12 pb-16">
            {!showChart ? (
              <Button
                variant="outline"
                onClick={() => setShowChart(true)}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Gerar gráfico de gêneros
              </Button>
            ) : genreChartData.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">Distribuição de Gêneros</h2>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowChart(false)}>
                    Fechar
                  </Button>
                </div>
                <div className="rounded-lg border border-border bg-card p-6 animate-fade-in">
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={genreChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={120}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
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
                        formatter={(value) => <span style={{ color: "white", fontSize: "13px" }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum dado de gênero disponível.</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default ListDetail;
