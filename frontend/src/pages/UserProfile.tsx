import { useState } from "react";
import { getGenreColor } from "@/lib/genreColors";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Film, Users, UserPlus, MessageSquare, ChevronDown, ChevronUp, Search, Heart, MessageCircle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { getPosterUrl } from "@/lib/tmdb";

// Mock data for other users
const MOCK_USER_PROFILES: Record<string, {
  name: string;
  username: string;
  bio: string;
  followers: number;
  following: number;
  avgRating: string;
  topGenres: { name: string; count: number }[];
  ratings: { movieId: number; movieTitle: string; posterPath: string | null; rating: number }[];
  reviews: { movieId: number; movieTitle: string; posterPath: string | null; content: string; date: string }[];
}> = {
  anasouza: {
    name: "Ana Souza",
    username: "@anasouza",
    bio: "Amante de dramas e filmes independentes. Sempre com pipoca na mão 🍿",
    followers: 312,
    following: 145,
    avgRating: "4.2",
    topGenres: [
      { name: "Drama", count: 28 },
      { name: "Romance", count: 15 },
      { name: "Comédia", count: 12 },
      { name: "Thriller", count: 8 },
      { name: "Ficção científica", count: 5 },
    ],
    ratings: [
      { movieId: 1084242, movieTitle: "Zootopia 2", posterPath: "/fOCTW3D6RywUzoxpvxF7G6YM5bT.jpg", rating: 4.5 },
      { movieId: 83533, movieTitle: "Avatar: Fogo e Cinzas", posterPath: "/9k2zKeUfcKkAz1dGt5MP6dZMm4G.jpg", rating: 4 },
      { movieId: 1265609, movieTitle: "Máquina de Guerra", posterPath: "/48h40o6Q97hZaqH0g7bOiXOrImX.jpg", rating: 3.5 },
      { movieId: 1236153, movieTitle: "Justiça Artificial", posterPath: "/vI7bNC07BaSEvZ9ATzV57wpAYwQ.jpg", rating: 5 },
    ],
    reviews: [
      { movieId: 1084242, movieTitle: "Zootopia 2", posterPath: "/fOCTW3D6RywUzoxpvxF7G6YM5bT.jpg", content: "Superou as expectativas! A animação está incrível e a história tem camadas para todas as idades.", date: "2026-03-10" },
      { movieId: 1236153, movieTitle: "Justiça Artificial", posterPath: "/vI7bNC07BaSEvZ9ATzV57wpAYwQ.jpg", content: "Um thriller de ficção científica que te prende do início ao fim. A atuação está impecável.", date: "2026-03-05" },
    ],
  },
  carloslima: {
    name: "Carlos Lima",
    username: "@carloslima",
    bio: "Fã de ação e ficção científica. Se explode, eu assisto 💥",
    followers: 89,
    following: 203,
    avgRating: "3.8",
    topGenres: [
      { name: "Ação", count: 42 },
      { name: "Ficção científica", count: 25 },
      { name: "Thriller", count: 18 },
      { name: "Aventura", count: 14 },
      { name: "Terror", count: 7 },
    ],
    ratings: [
      { movieId: 1265609, movieTitle: "Máquina de Guerra", posterPath: "/48h40o6Q97hZaqH0g7bOiXOrImX.jpg", rating: 4.5 },
      { movieId: 1290821, movieTitle: "Missão Refúgio", posterPath: "/hSvhZRkbYD9crC4nqy8uCk9EdFH.jpg", rating: 3 },
      { movieId: 799882, movieTitle: "O Refúgio", posterPath: "/49b7CTeJqugnpBboT6D5xGy3h4H.jpg", rating: 3.5 },
    ],
    reviews: [
      { movieId: 1265609, movieTitle: "Máquina de Guerra", posterPath: "/48h40o6Q97hZaqH0g7bOiXOrImX.jpg", content: "Ação do começo ao fim! Efeitos visuais de tirar o fôlego.", date: "2026-03-12" },
    ],
  },
  bearocha: {
    name: "Beatriz Rocha",
    username: "@bearocha",
    bio: "Cinéfila de carteirinha. Meu coração pertence ao cinema francês 🎬",
    followers: 567,
    following: 321,
    avgRating: "4.5",
    topGenres: [
      { name: "Drama", count: 55 },
      { name: "Romance", count: 30 },
      { name: "Mistério", count: 20 },
      { name: "História", count: 12 },
      { name: "Animação", count: 8 },
    ],
    ratings: [
      { movieId: 83533, movieTitle: "Avatar: Fogo e Cinzas", posterPath: "/9k2zKeUfcKkAz1dGt5MP6dZMm4G.jpg", rating: 4 },
      { movieId: 1084242, movieTitle: "Zootopia 2", posterPath: "/fOCTW3D6RywUzoxpvxF7G6YM5bT.jpg", rating: 5 },
    ],
    reviews: [
      { movieId: 83533, movieTitle: "Avatar: Fogo e Cinzas", posterPath: "/9k2zKeUfcKkAz1dGt5MP6dZMm4G.jpg", content: "Visualmente deslumbrante, mas senti falta de mais profundidade nos personagens novos.", date: "2026-03-08" },
    ],
  },
  diegosantos: {
    name: "Diego Santos",
    username: "@diegosantos",
    bio: "Terror e suspense são minha praia. Não assisto comédias 🎃",
    followers: 45,
    following: 67,
    avgRating: "3.5",
    topGenres: [
      { name: "Terror", count: 38 },
      { name: "Thriller", count: 22 },
      { name: "Mistério", count: 15 },
      { name: "Ficção científica", count: 10 },
      { name: "Crime", count: 6 },
    ],
    ratings: [
      { movieId: 1193501, movieTitle: "O Som da Morte", posterPath: "/1tX11KQzujSDXdszFNRvQbbNi72.jpg", rating: 4 },
      { movieId: 680493, movieTitle: "Terror em Silent Hill", posterPath: "/mRbdOe5vMnY3HXxLnWgRFJHbCPs.jpg", rating: 2.5 },
    ],
    reviews: [
      { movieId: 1193501, movieTitle: "O Som da Morte", posterPath: "/1tX11KQzujSDXdszFNRvQbbNi72.jpg", content: "Conceito original e bem executado. Os sustos são genuínos, sem depender de jump scares baratos.", date: "2026-03-01" },
      { movieId: 680493, movieTitle: "Terror em Silent Hill", posterPath: "/mRbdOe5vMnY3HXxLnWgRFJHbCPs.jpg", content: "Decepcionante. Esperava mais fidelidade ao jogo e menos clichês de terror genérico.", date: "2026-02-25" },
    ],
  },
};

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [ratingsOpen, setRatingsOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [ratingSearch, setRatingSearch] = useState("");
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  const profile = username ? MOCK_USER_PROFILES[username] : undefined;

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Cover */}
      <div className="relative h-56 w-full bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      <div className="container relative">
        {/* Avatar + Info */}
        <div className="relative -mt-16 mb-4 flex items-end gap-6">
          <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
            <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-display">
              {profile.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="pb-2 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">{profile.name}</h1>
                <p className="text-sm text-muted-foreground">{profile.username}</p>
              </div>
              <Button
                variant={isFollowing ? "secondary" : "default"}
                size="sm"
                onClick={() => setIsFollowing(!isFollowing)}
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
            <span className="font-semibold text-foreground">{profile.followers + (isFollowing ? 1 : 0)}</span>
            <span className="text-muted-foreground">seguidores</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <UserPlus className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">{profile.following}</span>
            <span className="text-muted-foreground">seguindo</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <Film className="h-6 w-6 text-primary mb-2" />
              <span className="text-2xl font-bold text-foreground">{profile.ratings.length}</span>
              <span className="text-xs text-muted-foreground">Filmes avaliados</span>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <Star className="h-6 w-6 text-star mb-2" />
              <span className="text-2xl font-bold text-foreground">{profile.avgRating}</span>
              <span className="text-xs text-muted-foreground">Nota média</span>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <MessageSquare className="h-6 w-6 text-primary mb-2" />
              <span className="text-2xl font-bold text-foreground">{profile.reviews.length}</span>
              <span className="text-xs text-muted-foreground">Comentários</span>
            </CardContent>
          </Card>
        </div>

        {/* Favorite Genres */}
        <div className="mb-8">
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">Gêneros Favoritos</h2>
          <div className="flex flex-wrap gap-2">
            {profile.topGenres.map((g) => {
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
        </div>

        {/* Recent Ratings - Collapsible */}
        <Collapsible open={ratingsOpen} onOpenChange={setRatingsOpen} className="mb-4">
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-accent">
            <h2 className="font-display text-lg font-semibold text-foreground">Avaliações Recentes</h2>
            {ratingsOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={ratingSearch}
                onChange={(e) => setRatingSearch(e.target.value)}
                placeholder="Pesquisar filme avaliado..."
                className="pl-9"
              />
            </div>
            {(() => {
              const filtered = profile.ratings.filter((r) =>
                r.movieTitle.toLowerCase().includes(ratingSearch.toLowerCase())
              );
              return filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Nenhum filme encontrado.</p>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {filtered.map((r) => (
                    <Link
                      key={r.movieId}
                      to={`/movie/${r.movieId}`}
                      className="group rounded-lg border border-border bg-card overflow-hidden transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                    >
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
                            <Film className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="truncate text-sm font-semibold text-card-foreground">{r.movieTitle}</h3>
                        <div className="mt-1 flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-star text-star" />
                          <span className="text-xs font-medium text-foreground">{r.rating}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              );
            })()}
          </CollapsibleContent>
        </Collapsible>

        {/* Recent Reviews - Collapsible */}
        <Collapsible open={reviewsOpen} onOpenChange={setReviewsOpen} className="mb-10">
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-accent">
            <h2 className="font-display text-lg font-semibold text-foreground">Comentários Recentes</h2>
            {reviewsOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="space-y-4">
              {profile.reviews.map((review) => {
                const reviewKey = `${review.movieId}-${review.date}`;
                const isLiked = likedReviews[reviewKey] || false;
                return (
                  <div
                    key={reviewKey}
                    className="rounded-lg border border-border bg-card p-4"
                  >
                    <div className="flex items-start gap-4">
                      <Link to={`/movie/${review.movieId}`} className="shrink-0">
                        {getPosterUrl(review.posterPath, "w185") ? (
                          <img
                            src={getPosterUrl(review.posterPath, "w185")!}
                            alt={review.movieTitle}
                            className="h-20 w-14 rounded object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-20 w-14 items-center justify-center rounded bg-muted">
                            <Film className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/movie/${review.movieId}`} className="hover:underline">
                          <h3 className="text-sm font-semibold text-card-foreground">{review.movieTitle}</h3>
                        </Link>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(review.date).toLocaleDateString("pt-BR")}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          {review.content}
                        </p>
                        <div className="mt-3 flex items-center gap-4">
                          <button
                            onClick={() => setLikedReviews((prev) => ({ ...prev, [reviewKey]: !prev[reviewKey] }))}
                            className={`flex items-center gap-1.5 text-xs transition-colors ${
                              isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                            }`}
                          >
                            <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-current" : ""}`} />
                            Curtir
                          </button>
                          <button
                            onClick={() => navigate(`/movie/${review.movieId}`)}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            Responder
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default UserProfile;
