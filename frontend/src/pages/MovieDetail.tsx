import { useState } from "react";
import * as React from "react";
import { getGenreColor } from "@/lib/genreColors";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, Clock, Calendar, Film, User, ListPlus, Check } from "lucide-react";

import UserRating from "@/components/UserRating";
import MovieComments from "@/components/MovieComments";
import Navbar from "@/components/Navbar";

import {
  getMovieDetails,
  getMovieCredits,
  getPosterUrl,
  getBackdropUrl,
  getProfileUrl,
} from "@/lib/tmdb";

import { getLists, addMovieToList, type MovieListItem } from "@/lib/movieLists";

interface MovieList {
  id: string;
  name: string;
  movies: MovieListItem[];
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";

function formatDate(dateStr: string) {
  if (!dateStr) return "—";

  const d = new Date(dateStr);

  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatRuntime(minutes: number | null) {
  if (!minutes) return "—";

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return `${h}h ${m}min`;
}

function getAgeRating(lang: string): string {
  const map: Record<string, string> = {
    en: "12+",
    ja: "14+",
    ko: "14+",
    pt: "12+",
  };

  return map[lang] || "Livre";
}

const AddToListButton = ({
  movie,
}: {
  movie: {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
    genres: { id: number }[];
  };
}) => {
  const navigate = useNavigate();
  const [lists, setLists] = useState<MovieList[]>([]);

  const handleAdd = async (listId: string) => {
    const item: MovieListItem = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      genre_ids: movie.genres.map((g) => g.id),
    };

    addMovieToList(Number(listId), movie.id);

    const updatedLists = await getLists();
    setLists(updatedLists);

    const listName = updatedLists.find((l) => l.id === listId)?.name;

    toast.success(`Adicionado a "${listName}"`);
  };

  const isInList = (listId: string) => {
    const list = lists.find((l) => l.id === listId);
    return list?.movies.some((m) => m.id === movie.id) ?? false;
  };

  if (lists.length === 0) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/listas")}
      >
        <ListPlus className="mr-1.5 h-4 w-4" />
        Criar uma lista primeiro
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <ListPlus className="mr-1.5 h-4 w-4" />
          Adicionar a uma lista
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        {lists.map((list) => {
          const added = isInList(list.id);

          return (
            <DropdownMenuItem
              key={list.id}
              disabled={added}
              onClick={() => !added && handleAdd(list.id)}
              className="flex items-center gap-2"
            >
              {added && <Check className="h-3.5 w-3.5 text-primary" />}
              <span className={added ? "text-muted-foreground" : ""}>
                {list.name}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const movieId = Number(id);

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => getMovieDetails(movieId),
    enabled: !!movieId,
  });

  const { data: credits } = useQuery({
    queryKey: ["movie-credits", movieId],
    queryFn: () => getMovieCredits(movieId),
    enabled: !!movieId,
  });

  const cast = credits ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="container py-10 space-y-6">
          <Skeleton className="h-8 w-48" />

          <div className="flex gap-8">
            <Skeleton className="h-[450px] w-[300px] rounded-lg shrink-0" />

            <div className="flex-1 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Filme não encontrado.</p>

          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => navigate("/")}
          >
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const posterUrl = getPosterUrl(movie.poster_path, "w500");

  const rating5 = Math.round((movie.vote_average / 2) * 10) / 10;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {backdropUrl && (
        <div className="relative h-[340px] w-full overflow-hidden">
          <img
            src={backdropUrl}
            alt=""
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
      )}

      <main
        className="container relative z-10"
        style={{ marginTop: backdropUrl ? "-120px" : "0" }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar
        </Button>

        <div className="flex flex-col gap-8 md:flex-row">

          <div className="shrink-0">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-[260px] rounded-lg border border-border shadow-2xl"
              />
            ) : (
              <div className="flex h-[390px] w-[260px] items-center justify-center rounded-lg border border-border bg-muted">
                <Film className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">

            <h1 className="font-display text-3xl font-bold md:text-4xl">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-sm italic text-muted-foreground">
                "{movie.tagline}"
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm">

              <span className="flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(movie.release_date)}
              </span>

              <span className="flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1">
                <Clock className="h-3.5 w-3.5" />
                {formatRuntime(movie.runtime)}
              </span>

              <span className="rounded-md bg-secondary px-2.5 py-1">
                {getAgeRating(movie.original_language)}
              </span>

            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genres.map((g) => {
                const colors = getGenreColor(g.name);

                return (
                  <span
                    key={g.id}
                    className="rounded-full px-3 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: colors.bg,
                      color: colors.text,
                    }}
                  >
                    {g.name}
                  </span>
                );
              })}
            </div>

            <div className="flex items-center gap-3">

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-5 w-5 ${
                      s <= Math.round(rating5)
                        ? "fill-star text-star"
                        : "fill-star-empty text-star-empty"
                    }`}
                  />
                ))}
              </div>

              <span className="text-lg font-semibold">
                {movie.vote_average.toFixed(1)}
              </span>

              <span className="text-sm text-muted-foreground">
                ({movie.vote_count.toLocaleString("pt-BR")} votos)
              </span>

            </div>

            <AddToListButton movie={movie} />

            <UserRating movieId={movieId} />

            <div>
              <h2 className="mb-2 text-lg font-semibold">Sinopse</h2>

              <p className="leading-relaxed text-secondary-foreground">
                {movie.overview || "Sinopse não disponível."}
              </p>
            </div>

          </div>
        </div>

        {cast.length > 0 && (
          <section className="mt-12">

            <h2 className="mb-4 text-xl font-bold">Elenco</h2>

            <div className="flex gap-4 overflow-x-auto pb-4">

              {cast.slice(0, 12).map((person: CastMember) => (
                <div key={person.id} className="shrink-0 w-[110px] text-center">

                  {getProfileUrl(person.profile_path) ? (
                    <img
                      src={getProfileUrl(person.profile_path)!}
                      alt={person.name}
                      className="mx-auto h-[110px] w-[110px] rounded-full border object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="mx-auto flex h-[110px] w-[110px] items-center justify-center rounded-full border bg-muted">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}

                  <p className="mt-2 truncate text-xs font-semibold">
                    {person.name}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {person.character}
                  </p>

                </div>
              ))}

            </div>

          </section>
        )}

        <MovieComments movieId={movieId} />

      </main>
    </div>
  );
};

export default MovieDetail;