import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MessageCircle, ArrowLeft, Heart, Calendar as CalendarIcon, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { type Comment, toggleLike } from "@/lib/comments";
import { apiRequest } from "@/lib/api";
import { getMovieDetails, getPosterUrl } from "@/lib/tmdb";

const PROFILE_KEY = "tmetrage_profile";

function getCurrentUsername(): string {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.profileName) return parsed.profileName;
      if (parsed.name) return parsed.name;
    }
  } catch { /* empty */ }
  return "Você";
}

function getProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* empty */ }
  return { name: "Você", avatar: "" };
}

async function getUserComments(username: string): Promise<Comment[]> {
  try {
    return await apiRequest<Comment[]>(`/users/${encodeURIComponent(username)}/comments`);
  } catch {
    return [];
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

interface CommentWithMovie extends Comment {
  movieTitle?: string;
  moviePoster?: string | null;
}

const DATE_PRESETS = [
  { label: "Todos", value: "all" },
  { label: "Última semana", value: "7d" },
  { label: "Último mês", value: "30d" },
  { label: "Últimos 3 meses", value: "90d" },
  { label: "Último ano", value: "1y" },
  { label: "Personalizado", value: "custom" },
];

const UserComments = () => {
  const [comments, setComments] = useState<CommentWithMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [datePreset, setDatePreset] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const navigate = useNavigate();
  const profile = getProfile();
  const currentUser = getCurrentUsername();

  useEffect(() => {
    const loadComments = async () => {
      const userComments = await getUserComments(currentUser);

      // Fetch movie details for each unique movieId
      const movieIds = [...new Set(userComments.map((c) => c.movieId))];
      const movieMap = new Map<number, { title: string; poster: string | null }>();

      for (const id of movieIds) {
        try {
          const movie = await getMovieDetails(id);
          movieMap.set(id, { title: movie.title, poster: movie.poster_path });
        } catch {
          movieMap.set(id, { title: `Filme #${id}`, poster: null });
        }
      }

      const enriched: CommentWithMovie[] = userComments.map((c) => ({
        ...c,
        movieTitle: movieMap.get(c.movieId)?.title,
        moviePoster: movieMap.get(c.movieId)?.poster,
      }));

      enriched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setComments(enriched);
      setLoading(false);
    };

    loadComments();
  }, [currentUser]);

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

  const filtered = comments.filter((c) => {
    const matchesSearch = !searchQuery.trim() ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.movieTitle || "").toLowerCase().includes(searchQuery.toLowerCase());
    const range = getDateRange();
    const commentDate = new Date(c.createdAt);
    const matchesDate =
      (!range.from || commentDate >= range.from) &&
      (!range.to || commentDate <= new Date(range.to.getTime() + 86400000));
    return matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/perfil" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display text-2xl font-bold text-foreground">Comentários</h1>
          <span className="text-sm text-muted-foreground">({comments.length})</span>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por conteúdo ou filme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={datePreset} onValueChange={(v) => {
              setDatePreset(v);
              if (v !== "custom") {
                setDateFrom(undefined);
                setDateTo(undefined);
              }
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

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg bg-muted h-28" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {comments.length === 0
                ? "Você ainda não publicou nenhum comentário."
                : "Nenhum comentário encontrado com os filtros selecionados."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((comment) => {
              const posterUrl = comment.moviePoster ? getPosterUrl(comment.moviePoster) : null;
              const formattedDate = new Date(comment.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={comment.id}
                  className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40"
                >
                  <div className="flex gap-4">
                    {/* Movie poster */}
                    <Link to={`/movie/${comment.movieId}`} className="shrink-0">
                      {posterUrl ? (
                        <img
                          src={posterUrl}
                          alt={comment.movieTitle}
                          className="h-24 w-16 rounded object-cover transition-transform hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-24 w-16 items-center justify-center rounded bg-muted">
                          <span className="text-xs text-muted-foreground">Sem img</span>
                        </div>
                      )}
                    </Link>

                    <div className="flex-1 min-w-0">
                      {/* Header: user info + movie name */}
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={profile.avatar} />
                          <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                            {profile.name?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-semibold text-foreground">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{timeAgo(comment.createdAt)}</span>
                      </div>

                      {/* Movie link */}
                      <Link
                        to={`/movie/${comment.movieId}`}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline mb-2"
                      >
                        {comment.movieTitle || `Filme #${comment.movieId}`}
                        <ExternalLink className="h-3 w-3" />
                      </Link>

                      {/* Comment content */}
                      <p className="text-sm text-secondary-foreground leading-relaxed mb-2">
                        {comment.content}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={async () => {
                            await toggleLike(comment.id);
                            const userComments = await getUserComments(currentUser);
                            setComments((prev) =>
                              prev.map((pc) => {
                                const updated = userComments.find((uc) => uc.id === pc.id);
                                return updated ? { ...pc, likes: updated.likes, likedByMe: updated.likedByMe } : pc;
                              })
                            );
                          }}
                          className={`flex items-center gap-1 text-xs transition-colors ${
                            comment.likedByMe
                              ? "text-red-500"
                              : "text-muted-foreground hover:text-red-500"
                          }`}
                        >
                          <Heart className={`h-3.5 w-3.5 ${comment.likedByMe ? "fill-current" : ""}`} />
                          {comment.likes > 0 && <span>{comment.likes}</span>}
                        </button>
                        <Link
                          to={`/movie/${comment.movieId}#comentarios`}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          Responder
                        </Link>
                        <span className="text-xs text-muted-foreground">{formattedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserComments;
