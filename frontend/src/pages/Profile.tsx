import { useState, useEffect, useRef } from "react";
import { getGenreColor } from "@/lib/genreColors";
import { Link } from "react-router-dom";
import { Search, Star, Film, List, Users, UserPlus, Camera, Pencil, X, Upload, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getRatings } from "@/components/UserRating";
import { getLists } from "@/lib/movieLists";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const STORAGE_KEY = "tmetrage_profile";

const loadProfile = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    name: "Cinéfilo Anônimo",
    username: "@cinefilo",
    bio: "Apaixonado por cinema. Sempre em busca do próximo grande filme.",
    avatar: "",
    cover: "",
    followers: 124,
    following: 89,
  };
};

interface ProfileUser {
  name: string;
  username: string;
  avatar: string;
}

interface StoredUser {
  email: string;
  password: string;
}

const MOCK_USERS: ProfileUser[] = [
  { name: "Ana Souza", username: "@anasouza", avatar: "" },
  { name: "Carlos Lima", username: "@carloslima", avatar: "" },
  { name: "Beatriz Rocha", username: "@bearocha", avatar: "" },
  { name: "Diego Santos", username: "@diegosantos", avatar: "" },
];

const MOCK_FOLLOWERS: ProfileUser[] = [
  { name: "Ana Souza", username: "@anasouza", avatar: "" },
  { name: "Beatriz Rocha", username: "@bearocha", avatar: "" },
  { name: "Diego Santos", username: "@diegosantos", avatar: "" },
];

const MOCK_FOLLOWING: ProfileUser[] = [
  { name: "Carlos Lima", username: "@carloslima", avatar: "" },
  { name: "Beatriz Rocha", username: "@bearocha", avatar: "" },
];

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const Profile = () => {
  const [profile, setProfile] = useState(loadProfile);
  const [searchQuery, setSearchQuery] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [followDialog, setFollowDialog] = useState<"followers" | "following" | null>(null);
  const [followSearch, setFollowSearch] = useState("");
  const [editName, setEditName] = useState(profile.name);
  const [editUsername, setEditUsername] = useState(profile.username);
  const [editBio, setEditBio] = useState(profile.bio);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const lists = getLists();

  // Persist profile to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setProfile((prev: typeof profile) => ({ ...prev, avatar: base64 }));
    setAvatarDialogOpen(false);
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setProfile((prev: typeof profile) => ({ ...prev, cover: base64 }));
  };

  const totalMoviesInLists = lists.reduce((acc, l) => acc + l.movies.length, 0);

  const genreCount: Record<number, number> = {};
  lists.forEach((l) =>
    l.movies.forEach((m) =>
      m.genre_ids?.forEach((gid) => {
        genreCount[gid] = (genreCount[gid] || 0) + 1;
      })
    )
  );

  const GENRE_NAMES: Record<number, string> = {
    28: "Ação", 12: "Aventura", 16: "Animação", 35: "Comédia", 80: "Crime",
    99: "Documentário", 18: "Drama", 10751: "Família", 14: "Fantasia",
    36: "História", 27: "Terror", 10402: "Música", 9648: "Mistério",
    10749: "Romance", 878: "Ficção científica", 10770: "Cinema TV",
    53: "Thriller", 10752: "Guerra", 37: "Faroeste",
  };

  const topGenres = Object.entries(genreCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id, count]) => ({ name: GENRE_NAMES[Number(id)] || `#${id}`, count }));

  const ratings = getRatings();
  const ratingEntries = Object.values(ratings);
  const totalRated = ratingEntries.length;
  const avgRating =
    totalRated > 0
      ? (ratingEntries.reduce((sum, e) => sum + e.rating, 0) / totalRated).toFixed(1)
      : "—";

  const filteredUsers = searchQuery.trim()
    ? MOCK_USERS.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hidden file inputs */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
      />
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCoverChange}
      />

      {/* Cover Image */}
      <div className="relative h-56 w-full bg-secondary overflow-hidden group">
        {profile.cover && (
          <img
            src={profile.cover}
            alt="Capa do perfil"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={() => coverInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" /> Alterar capa
          </Button>
        </div>
      </div>

      <div className="container relative">
        {/* Avatar */}
        <div className="relative -mt-16 mb-4 flex items-end gap-6">
          <div
            className="relative group cursor-pointer"
            onClick={() => setAvatarDialogOpen(true)}
          >
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-display">
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background/50">
              <Camera className="h-5 w-5 text-foreground" />
            </div>
          </div>

          <div className="pb-2 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">{profile.name}</h1>
                <p className="text-sm text-muted-foreground">{profile.username}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                  setEditName(profile.name);
                  setEditUsername(profile.username);
                  setEditBio(profile.bio);
                  setEditOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
                Editar perfil
              </Button>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground max-w-xl mb-6">{profile.bio}</p>

        {/* Followers / Following */}
        <div className="flex gap-6 mb-8">
          <button
            onClick={() => setFollowDialog("followers")}
            className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
          >
            <Users className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">{profile.followers}</span>
            <span className="text-muted-foreground">seguidores</span>
          </button>
          <button
            onClick={() => setFollowDialog("following")}
            className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
          >
            <UserPlus className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">{profile.following}</span>
            <span className="text-muted-foreground">seguindo</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
          <Link to="/filmes-avaliados">
            <Card className="bg-card border-border cursor-pointer transition-colors hover:border-primary/40">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <Film className="h-6 w-6 text-primary mb-2" />
                <span className="text-2xl font-bold text-foreground">{totalRated}</span>
                <span className="text-xs text-muted-foreground">Filmes avaliados</span>
              </CardContent>
            </Card>
          </Link>
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <Star className="h-6 w-6 text-star mb-2" />
              <span className="text-2xl font-bold text-foreground">{avgRating}</span>
              <span className="text-xs text-muted-foreground">Nota média</span>
            </CardContent>
          </Card>
          <Link to="/listas">
            <Card className="bg-card border-border cursor-pointer transition-colors hover:border-primary/40">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <List className="h-6 w-6 text-primary mb-2" />
                <span className="text-2xl font-bold text-foreground">{lists.length}</span>
                <span className="text-xs text-muted-foreground">Listas criadas</span>
              </CardContent>
            </Card>
          </Link>
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <Film className="h-6 w-6 text-accent mb-2" />
              <span className="text-2xl font-bold text-foreground">{totalMoviesInLists}</span>
              <span className="text-xs text-muted-foreground">Filmes em listas</span>
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
            <p className="text-sm text-muted-foreground">
              Adicione filmes às suas listas para ver seus gêneros favoritos.
            </p>
          )}
        </div>

        {/* Profile Search */}
        <div className="mb-10">
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">Buscar Perfis</h2>
          <div className="flex max-w-md items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome ou @usuário"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {searchQuery.trim() && (
            <div className="mt-3 space-y-2 max-w-md">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <Link
                    key={u.username}
                    to={`/usuario/${u.username.replace("@", "")}`}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                        {u.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.username}</p>
                    </div>
                    <span className="text-xs text-primary font-medium">Ver perfil →</span>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum perfil encontrado.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Avatar Preview Dialog */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Foto de perfil</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <Avatar className="h-48 w-48 border-2 border-border">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-6xl font-display">
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => avatarInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              Alterar foto
            </Button>
            {profile.avatar && (
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive gap-2"
                onClick={() => {
                  setProfile((prev: typeof profile) => ({ ...prev, avatar: "" }));
                  setAvatarDialogOpen(false);
                }}
              >
                <X className="h-4 w-4" />
                Remover foto
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nome</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Seu nome"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Usuário</label>
              <Input
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="@usuario"
                maxLength={30}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Bio</label>
              <Textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Fale um pouco sobre você..."
                rows={3}
                maxLength={200}
              />
            </div>
            <Button
              className="w-full"
              disabled={!editName.trim()}
              onClick={() => {
                setProfile((prev: typeof profile) => ({
                  ...prev,
                  name: editName.trim(),
                  username: editUsername.trim(),
                  bio: editBio.trim(),
                }));
                setEditOpen(false);
              }}
            >
              Salvar alterações
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setPasswordError("");
                setPasswordDialogOpen(true);
              }}
            >
              <Lock className="h-4 w-4" />
              Alterar senha
            </Button>

            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground mb-2">Zona de perigo</p>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Excluir conta
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir conta</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        localStorage.clear();
                        window.location.href = "/";
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Followers / Following Dialog */}
      <Dialog open={followDialog !== null} onOpenChange={(open) => { if (!open) { setFollowDialog(null); setFollowSearch(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {followDialog === "followers" ? "Seguidores" : "Seguindo"}
            </DialogTitle>
          </DialogHeader>
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar usuário..."
              value={followSearch}
              onChange={(e) => setFollowSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="space-y-2 max-h-[350px] overflow-y-auto">
            {(followDialog === "followers" ? MOCK_FOLLOWERS : MOCK_FOLLOWING)
              .filter((u) =>
                !followSearch.trim() ||
                u.name.toLowerCase().includes(followSearch.toLowerCase()) ||
                u.username.toLowerCase().includes(followSearch.toLowerCase())
              )
              .map((u) => (
              <Link
                key={u.username}
                to={`/usuario/${u.username.replace("@", "")}`}
                onClick={() => { setFollowDialog(null); setFollowSearch(""); }}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                    {u.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.username}</p>
                </div>
                <span className="text-xs text-primary font-medium">Ver perfil →</span>
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Alterar senha</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Senha atual</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite sua senha atual"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nova senha</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirmar nova senha</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a nova senha"
              />
            </div>
            {passwordError && (
              <p className="text-sm text-destructive">{passwordError}</p>
            )}
            <Button
              className="w-full"
              disabled={!currentPassword || !newPassword || !confirmPassword}
              onClick={() => {
                const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
                const users = JSON.parse(localStorage.getItem("users") || "[]");
                const user = users.find((u: any) => u.email === currentUser.email);

                if (!user || user.password !== currentPassword) {
                  setPasswordError("Senha atual incorreta.");
                  return;
                }
                if (newPassword.length < 6) {
                  setPasswordError("A nova senha deve ter pelo menos 6 caracteres.");
                  return;
                }
                if (newPassword !== confirmPassword) {
                  setPasswordError("As senhas não coincidem.");
                  return;
                }

                const updatedUsers = users.map((u: StoredUser) =>
                  u.email === currentUser.email ? { ...u, password: newPassword } : u
                );
                localStorage.setItem("users", JSON.stringify(updatedUsers));
                setPasswordError("");
                setPasswordDialogOpen(false);
              }}
            >
              Salvar nova senha
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
