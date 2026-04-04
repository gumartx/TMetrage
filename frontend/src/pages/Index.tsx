import { useState, useCallback, useEffect, useRef } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { searchMovies, discoverMovies, getGenres, getTrendingMovies, getBackdropUrl, getPosterUrl } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import Navbar from "@/components/Navbar";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const Index = () => {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<number | undefined>();

  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
  });

  const { data: trending } = useQuery({
    queryKey: ["trending"],
    queryFn: getTrendingMovies,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["movies", searchTerm, page, selectedGenre],
    queryFn: () =>
      searchTerm
        ? searchMovies(searchTerm, page)
        : discoverMovies(page, selectedGenre),
  });

  const handleSearch = useCallback(() => {
    setSearchTerm(query);
    setPage(1);
  }, [query]);

  const handleGenreChange = (genreId: number | undefined) => {
    setSelectedGenre(genreId);
    setSearchTerm("");
    setQuery("");
    setPage(1);
  };

  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!trending || trending.length === 0) return;

    const interval = setInterval(() => {
      nextRef.current?.click(); 
    }, 5000);

    return () => clearInterval(interval);
  }, [trending]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Trending Carousel */}
      {trending && trending.length > 0 && (
        <section className="relative">
          <Carousel opts={{ loop: true }} className="w-full">
            <CarouselContent>
              {trending.slice(0, 10).map((movie) => (
                <CarouselItem key={movie.id}>
                  <Link to={`/movie/${movie.id}`} className="relative block h-[400px] w-full overflow-hidden">
                    <img
                      src={getBackdropUrl(movie.backdrop_path) || getPosterUrl(movie.poster_path, "w500") || ""}
                      alt={movie.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 container">
                      <h2 className="font-display text-3xl font-bold text-foreground drop-shadow-lg">
                        {movie.title}
                      </h2>
                      <div className="mt-2 flex items-center gap-2">
                        <Star className="h-4 w-4 fill-star text-star" />
                        <span className="text-sm font-medium text-foreground">
                          {(movie.vote_average / 2).toFixed(1)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({movie.vote_count} votos)
                        </span>
                      </div>
                      <p className="mt-2 max-w-2xl text-sm text-muted-foreground line-clamp-2">
                        {movie.overview}
                      </p>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 top-1/2 z-10 bg-background/60 border-border hover:bg-background/80" />
            <CarouselNext
              ref={nextRef}
              className="right-4 top-1/2 z-10 bg-background/60 border-border hover:bg-background/80"
            />
          </Carousel>
          <div className="container mt-4 mb-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">🔥 Mais avaliados do mês</p>
          </div>
        </section>
      )}

      <main className="container py-10">
        <h1 className="text-center font-display text-2xl font-bold text-foreground">
          Procurando por um filme?
        </h1>

        <div className="mx-auto mt-6 flex max-w-2xl items-center gap-4">
          <div className="flex flex-1 items-center rounded-md border border-border bg-card">
            <input
              type="text"
              placeholder="Pesquise um filme pelo nome"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="px-3 py-2.5 text-muted-foreground transition-colors hover:text-primary"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          <select
            value={selectedGenre ?? ""}
            onChange={(e) =>
              handleGenreChange(e.target.value ? Number(e.target.value) : undefined)
            }
            className="rounded-md border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Filtrar por Gênero</option>
            {genres?.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8 border-t border-border" />

        {isLoading ? (
          <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg bg-card">
                <div className="aspect-[2/3] rounded-t-lg bg-muted" />
                <div className="p-3 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {data?.results.slice(0, 18).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            {data && data.total_pages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={data.total_pages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;