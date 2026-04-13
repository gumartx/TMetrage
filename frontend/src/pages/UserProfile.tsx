import { getImageUrl } from "@/lib/files";
import { useState, useEffect, useCallback } from "react";
import { getGenreColor } from "@/lib/genreColors";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Film, Users, UserPlus, MessageSquare, ChevronDown, ChevronUp, Search, Heart, MessageCircle, Loader2, List } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { getPosterUrl } from "@/lib/tmdb";
import { getMovieDetails } from "@/lib/tmdb";
import { toast } from "sonner";
import { getUserProfile, toggleFollow, UserProfile as UserProfileType } from "@/lib/profile";
import { toggleLike } from "@/lib/comments";

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [topGenres, setTopGenres] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [ratingsOpen, setRatingsOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [ratingSearch, setRatingSearch] = useState("");
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  const loadProfile = useCallback(async () => {
    if (!username) return;
    try {
      const data = await getUserProfile(username);
      setProfile(data);
      setIsFollowing(data.isFollowing);
    } catch (err) {
      toast.error(err.message || "Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!profile?.ratings?.length) {
      setTopGenres([]);
      return;
    }

    const loadGenres = async () => {
      try {
        const movieIds = [...new Set(profile.ratings.map(r => r.movieId))];
        const movies = await Promise.all(movieIds.map(id => getMovieDetails(id)));

        const genreCount: Record<string, number> = {};
        movies.forEach(movie => {
          movie.genres?.forEach((g: { name: string }) => {
            genreCount[g.name] = (genreCount[g.name] || 0) + 1;
          });
        });

        const sorted = Object.entries(genreCount)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setTopGenres(sorted);
      } catch (err) {
        console.error("Erro ao carregar gêneros:", err);
      }
    };

    loadGenres();
  }, [profile]);

  const handleFollow = async () => {
    if (!username) return;
    try {
      await toggleFollow(username);
      setIsFollowing(prev => !prev);
    } catch (err) {
      toast.error(err.message || "Erro ao seguir/deixar de seguir");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Perfil não encontrado.</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate(-1)}>Voltar</Button>
        </div>
      </div>
    );
  }

  const displayUsername = profile.profileName.startsWith("@") ? profile.profileName : `@${profile.profileName}`;

  // Filtragem de avaliações
  const filteredRatings = (profile.ratings || []).filter(r =>
    r.movieTitle.toLowerCase().includes(ratingSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Cover */}
      <div className="relative h-56 w-full bg-secondary overflow-hidden">
        {profile.cover && (
          <img
            src={getImageUrl(profile.cover)}
            alt="Capa"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      <div className="container relative">
        {/* Avatar + Info */}
        <div className="relative -mt-16 mb-4 flex items-end gap-6">
          <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
            {profile.avatar ? (
              <AvatarImage src={getImageUrl(profile.avatar)} />
            ) : (
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-display">
                {profile.name.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="pb-2 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">{profile.name}</h1>
                <p className="text-sm text-muted-foreground">{displayUsername}</p>
              </div>
              <Button
                variant={isFollowing ? "secondary" : "default"}
                size="sm"
                onClick={handleFollow}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                {isFollowing ? "Seguindo" : "Seguir"}
              </Button>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground max-w-xl mb-6">{profile.bio}</p>

        {/* Followers / Following */}
        <div className="flex gap-6 mb-8">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">{profile.followers}</span>
            <span className="text-muted-foreground">seguidores</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <UserPlus className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">{profile.following}</span>
            <span className="text-muted-foreground">seguindo</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
          <Link to={`/usuario/${profile.profileName}/filmes-avaliados`}>
            <Card className="bg-card border-border cursor-pointer transition-colors hover:border-primary/40">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <Film className="h-6 w-6 text-primary mb-2" />
                <span className="text-2xl font-bold text-foreground">{profile.totalRatings}</span>
                <span className="text-xs text-muted-foreground">Filmes avaliados</span>
              </CardContent>
            </Card>
          </Link>
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <Star className="h-6 w-6 text-star mb-2" />
              <span className="text-2xl font-bold text-foreground">
                {profile.avgRating > 0 ? profile.avgRating.toFixed(1) : "—"}
              </span>
              <span className="text-xs text-muted-foreground">Nota média</span>
            </CardContent>
          </Card>
          <Link to={`/usuario/${profile.profileName}/listas`}>
            <Card className="bg-card border-border cursor-pointer transition-colors hover:border-primary/40">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <List className="h-6 w-6 text-primary mb-2" />
                <span className="text-2xl font-bold text-foreground">{profile.totalLists ?? 0}</span>
                <span className="text-xs text-muted-foreground">Listas criadas</span>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <MessageCircle className="h-6 w-6 text-primary mb-2" />
              <span className="text-2xl font-bold text-foreground">{profile.totalComments}</span>
              <span className="text-xs text-muted-foreground">Comentários</span>
            </CardContent>
          </Card>
        </div>

        {/* Favorite Genres */}
        <div className="mb-8">
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">Gêneros Favoritos</h2>
          {topGenres.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {topGenres.map((g) => {
                const colors = getGenreColor(g.name);
                return (
                  <span
                    key={g.name}
                    className="rounded-full px-4 py-1.5 text-sm font-medium"
                    style={{ backgroundColor: colors.bg, color: colors.text }}
                  >
                    {g.name} <span style={{ color: colors.text, opacity: 0.75 }}>({g.count})</span>
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum gênero favorito ainda.</p>
          )}
        </div>

        {/* Dropdowns lado a lado */}
        <div className="flex gap-4 mb-10">
          {/* Avaliações */}
          <Collapsible open={ratingsOpen} onOpenChange={setRatingsOpen} className="flex-1">
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-accent">
              <h2 className="font-display text-lg font-semibold text-foreground">Avaliações</h2>
              {ratingsOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <Input
                value={ratingSearch}
                onChange={(e) => setRatingSearch(e.target.value)}
                placeholder="Pesquisar filme..."
                className="mb-3"
              />
              {filteredRatings.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Nenhum filme encontrado.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {filteredRatings.map((r) => (
                    <Link key={r.movieId} to={`/movie/${r.movieId}`} className="group rounded-lg overflow-hidden border border-border bg-card hover:shadow-lg">
                      <div className="aspect-[2/3] overflow-hidden">
                        {getPosterUrl(r.posterPath) ? (
                          <img
                            src={getPosterUrl(r.posterPath)!}
                            alt={r.movieTitle}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            <Film className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <h3 className="truncate text-xs font-semibold text-card-foreground">{r.movieTitle}</h3>
                        <div className="mt-1 flex items-center gap-1">
                          <Star className="h-3 w-3 fill-star text-star" />
                          <span className="text-xs font-medium text-foreground">{r.rating}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Comentários */}
          <Collapsible open={reviewsOpen} onOpenChange={setReviewsOpen} className="flex-1">
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-accent">
              <h2 className="font-display text-lg font-semibold text-foreground">Comentários</h2>
              {reviewsOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3">
              {(profile.reviews || []).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum comentário ainda.</p>
              ) : (
                profile.reviews.map((review, index) => {
                  const reviewKey = `${review.movieId}-${index}`;
                  const isLiked = likedReviews[reviewKey] || false;
                  return (
                    <div key={reviewKey} className="rounded-lg border border-border bg-card p-3">
                      <div className="flex items-start gap-3">
                        <Link to={`/movie/${review.movieId}`} className="shrink-0">
                          {getPosterUrl(review.posterPath, "w185") ? (
                            <img
                              src={getPosterUrl(review.posterPath, "w185")!}
                              alt={review.movieTitle}
                              className="h-16 w-12 rounded object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-16 w-12 items-center justify-center rounded bg-muted">
                              <Film className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/movie/${review.movieId}`} className="hover:underline">
                            <h3 className="text-xs font-semibold text-card-foreground">{review.movieTitle}</h3>
                          </Link>
                          <p className="mt-0.5 text-[10px] text-muted-foreground">{new Date(review.date).toLocaleDateString("pt-BR")}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{review.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;