import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Trash2, Film, Search } from "lucide-react";

import {
  getList,
  removeMovieFromList,
  addMovieToList,
  type MovieList
} from "@/lib/movieLists";

import { searchMovies, getPosterUrl } from "@/lib/tmdb";
import { useQuery } from "@tanstack/react-query";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ListDetail = () => {

  const { id } = useParams();

  const [list, setList] = useState<MovieList | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  async function loadList() {

    if (!id) return;

    const data = await getList(Number(id));

    setList(data);
  }

  useEffect(() => {
    loadList();
  }, [id]);

  const { data: results } = useQuery({

    queryKey: ["search-movies", searchTerm],

    queryFn: () => searchMovies(searchTerm, 1),

    enabled: searchTerm.length > 1,

  });

  async function handleAddMovie(movieId: number) {

    if (!list) return;

    await addMovieToList(list.id, movieId);

    loadList();
  }

  async function handleRemoveMovie(movieId: number) {

    if (!list) return;

    await removeMovieFromList(list.id, movieId);

    loadList();
  }

  if (!list) return <p>Carregando...</p>;

  return (
    <div className="min-h-screen bg-background">

      <Navbar />

      <main className="container py-10">

        <Link
          to="/listas"
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>

        <h1 className="text-2xl font-bold mt-4">

          {list.name}

        </h1>

        <p className="text-muted-foreground">

          {list.description}

        </p>

        <div className="mt-6">

          <Input
            placeholder="Buscar filme..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>

        {results && (

          <div className="mt-6 grid grid-cols-5 gap-4">

            {results.results.map((movie) => {

              const poster = getPosterUrl(movie.poster_path);

              return (

                <div key={movie.id}>

                  <img
                    src={poster || ""}
                    className="rounded-md"
                  />

                  <Button
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => handleAddMovie(movie.id)}
                  >
                    Adicionar
                  </Button>

                </div>

              );
            })}

          </div>

        )}

        <h2 className="text-xl font-semibold mt-10">

          Filmes da lista

        </h2>

        <div className="grid grid-cols-5 gap-4 mt-4">

          {list.movies.map((movie) => {

            const poster = getPosterUrl(movie.poster_path);

            return (

              <div key={movie.id}>

                <img
                  src={poster || ""}
                  className="rounded-md"
                />

                <Button
                  size="sm"
                  variant="destructive"
                  className="mt-2 w-full"
                  onClick={() => handleRemoveMovie(movie.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remover
                </Button>

              </div>

            );
          })}

        </div>

      </main>

    </div>
  );
};

export default ListDetail;