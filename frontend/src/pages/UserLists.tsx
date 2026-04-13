import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Film, ListMusic, Search, ArrowLeft } from "lucide-react";
import { getPosterUrl } from "@/lib/tmdb";
import { getPublicListsByUser, type MovieList } from "@/lib/movieLists";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";

const UserLists = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [lists, setLists] = useState<MovieList[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!username) return;
    const load = async () => {
      try {
        const data = await getPublicListsByUser(username);
        setLists(data);
      } catch {
        setLists([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [username]);

  const filtered = lists.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(`/usuario/${username}`)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Listas de {username}
          </h1>
          {!loading && (
            <span className="text-sm text-muted-foreground">({lists.length})</span>
          )}
        </div>

        {!loading && lists.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Pesquisar listas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg bg-muted h-52" />
            ))}
          </div>
        ) : lists.length === 0 ? (
          <div className="mt-20 flex flex-col items-center text-center">
            <ListMusic className="h-16 w-16 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">
              Nenhuma lista pública encontrada
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Este usuário ainda não possui listas públicas
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-12 flex flex-col items-center text-center">
            <Search className="h-12 w-12 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              Nenhuma lista encontrada para "{search}"
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((list) => (
              <Link
                key={list.id}
                to={`/usuario/${username}/listas/${list.id}`}
                className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 block"
              >
                <h3 className="text-lg font-semibold text-card-foreground">
                  {list.name}
                </h3>
                {list.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {list.description}
                  </p>
                )}

                <div className="mt-4 flex items-center overflow-hidden">
                  {list.movies.length === 0 ? (
                    <div className="flex h-[100px] w-full items-center justify-center rounded-md bg-muted">
                      <Film className="h-8 w-8 text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      {list.movies.slice(0, 7).map((m) => {
                        const url = getPosterUrl(m.poster_path, "w185");
                        return url ? (
                          <img
                            key={m.id}
                            src={url}
                            alt={m.title}
                            className="h-[100px] w-[67px] shrink-0 -ml-8 first:ml-0 rounded-md object-cover border border-border"
                            loading="lazy"
                          />
                        ) : (
                          <div
                            key={m.id}
                            className="flex h-[100px] w-[67px] shrink-0 -ml-8 first:ml-0 items-center justify-center rounded-md bg-muted border border-border"
                          >
                            <Film className="h-4 w-4 text-muted-foreground" />
                          </div>
                        );
                      })}
                      {list.movies.length > 4 && (
                        <div className="flex h-[100px] w-[67px] shrink-0 -ml-8 items-center justify-center rounded-md bg-muted border border-border text-xs font-semibold">
                          +{list.movies.length - 4}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{list.movies.length} {list.movies.length === 1 ? "filme" : "filmes"}</span>
                  <span>{new Date(list.createdAt + "T00:00:00").toLocaleDateString("pt-BR")}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLists;