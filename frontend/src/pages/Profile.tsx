import { getImageUrl } from "@/lib/files";
import { useState, useEffect, useRef, useCallback } from "react";
import { getGenreColor } from "@/lib/genreColors";
import { Link } from "react-router-dom";
import { Search, Star, Film, List, Users, UserPlus, Camera, Pencil, X, Upload, Lock, MessageCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
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
import { toast } from "sonner";
import {
  getMyProfile,
  updateProfile,
  updateAvatar,
  updateCover,
  changePassword,
  removeAvatar,
  deleteAccount,
  searchUsers,
  getFollowers,
  getFollowing,
  UserProfile,
  getUserProfile,
} from "@/lib/profile";
import { removeToken } from "@/lib/api";
import { getMovieDetails } from "@/lib/tmdb";
import { getLists } from "@/lib/movieLists";
import { getUserRatings } from "@/lib/ratings";

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [topGenres, setTopGenres] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ name: string; profileName: string; avatar: string }[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [followDialog, setFollowDialog] = useState<"followers" | "following" | null>(null);
  const [followSearch, setFollowSearch] = useState("");
  const [followList, setFollowList] = useState<{ name: string; profileName: string; avatar: string }[]>([]);
  const [editName, setEditName] = useState("");
  const [editProfileName, setEditProfileName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [saving, setSaving] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const loadProfile = useCallback(async () => {
    try {
      const data = await getMyProfile();
      setProfile(data);
    } catch (err) {
      toast.error(err.message || "Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

useEffect(() => {
  const loadGenresFromRatings = async () => {
    try {
      const ratings = await getUserRatings();

      const movieIds = new Set<number>();

      ratings.forEach((rating) => {
        movieIds.add(rating.movieId);
      });

      const movies = await Promise.all(
        [...movieIds].map((id) => getMovieDetails(id))
      );

      const genreCount: Record<string, number> = {};

      movies.forEach((movie) => {
        movie.genres?.forEach((g) => {
          genreCount[g.name] = (genreCount[g.name] || 0) + 1;
        });
      });

      const sorted = Object.entries(genreCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setTopGenres(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  loadGenresFromRatings();
}, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const results = await searchUsers(searchQuery);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const updated = await updateAvatar(file);
      localStorage.setItem(
        "tmetrage_profile",
        JSON.stringify({
          name: updated.name,
          profileName: updated.profileName,
          avatar: updated.avatar,
        })
      );

      window.dispatchEvent(new Event("profileUpdated"));

      setProfile((prev) =>
        prev ? { ...prev, avatar: updated.avatar } : prev
      );
      setAvatarDialogOpen(false);
      toast.success("Avatar atualizado!");
    } catch (err) {
      toast.error(err.message || "Erro ao atualizar avatar");
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const updated = await updateCover(file);
      setProfile(updated);
      toast.success("Capa atualizada!");
    } catch (err) {
      toast.error(err.message || "Erro ao atualizar capa");
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updated = await updateProfile({
        name: editName.trim(),
        profileName: editProfileName.trim(),
        bio: editBio.trim(),
      });
      setProfile(updated);
      // Update localStorage for navbar
      const formattedUsername = updated.profileName.startsWith("@") ? updated.profileName : `@${updated.profileName}`;
      localStorage.setItem("tmetrage_profile", JSON.stringify({
        name: updated.name,
        profileName: formattedUsername,
        username: formattedUsername,
        bio: updated.bio,
        avatar: updated.avatar,
        cover: updated.cover,
        followers: updated.followers,
        following: updated.following,
      }));
      setEditOpen(false);
      toast.success("Perfil atualizado!");
    } catch (err) {
      toast.error(err.message || "Erro ao salvar perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      setPasswordError("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não coincidem.");
      return;
    }
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordError("");
      setPasswordDialogOpen(false);
      toast.success("Senha alterada com sucesso!");
    } catch (err) {
      setPasswordError(err.message || "Erro ao alterar senha");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      removeToken();
      localStorage.removeItem("tmetrage_profile");
      window.location.href = "/";
    } catch (err) {
      toast.error(err.message || "Erro ao excluir conta");
    }
  };

  const handleOpenFollowDialog = async (type: "followers" | "following") => {
    setFollowDialog(type);
    try {
      const list = type === "followers" ? await getFollowers() : await getFollowing();
      setFollowList(list);
    } catch {
      setFollowList([]);
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
          <p className="text-muted-foreground">Erro ao carregar perfil. Faça login novamente.</p>
          <Link to="/login">
            <Button className="mt-4">Ir para login</Button>
          </Link>
        </div>
      </div>
    );
  }

  const displayUsername = profile.profileName.startsWith("@") ? profile.profileName : `@${profile.profileName}`;

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
            src={getImageUrl(profile.cover)}
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
              <AvatarImage src={getImageUrl(profile.avatar)} />
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
                <p className="text-sm text-muted-foreground">{displayUsername}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                  setEditName(profile.name);
                  setEditProfileName(profile.profileName);
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
            onClick={() => handleOpenFollowDialog("followers")}
            className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
          >
            <Users className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">{profile.followers}</span>
            <span className="text-muted-foreground">seguidores</span>
          </button>
          <button
            onClick={() => handleOpenFollowDialog("following")}
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
          <Link to="/listas">
            <Card className="bg-card border-border cursor-pointer transition-colors hover:border-primary/40">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <List className="h-6 w-6 text-primary mb-2" />
                <span className="text-2xl font-bold text-foreground">
                  {profile.totalLists > 0 ? profile.totalLists : "—"}
                </span>
                <span className="text-xs text-muted-foreground">Listas criadas</span>
              </CardContent>
            </Card>
          </Link>
          <Link to="/comentarios">
            <Card className="bg-card border-border cursor-pointer transition-colors hover:border-primary/40">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <MessageCircle className="h-6 w-6 text-accent mb-2" />
                <span className="text-2xl font-bold text-foreground">{profile.totalComments}</span>
                <span className="text-xs text-muted-foreground">Comentários</span>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Favorite Genres */}
        <div className="mb-8">
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">Gêneros Favoritos</h2>
          {topGenres?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {topGenres?.map((g) => {
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
              {searchResults.length > 0 ? (
                searchResults.map((u) => (
                  <Link
                    key={u.profileName}
                    to={`/usuario/${u.profileName.replace("@", "")}`}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40"
                  >
                    <Avatar className="h-9 w-9">
                      {u.avatar ? (
                        <AvatarImage src={getImageUrl(u.avatar)} />
                      ) : (
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                          {u.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {u.profileName.startsWith("@") ? u.profileName : `@${u.profileName}`}
                      </p>
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
              <AvatarImage src={getImageUrl(profile.avatar)} />
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
                onClick={async () => {
                  try {
                    await removeAvatar();

                    // atualizar perfil na tela
                    setProfile((prev) =>
                      prev ? { ...prev, avatar: null } : prev
                    );

                    // atualizar localStorage (usado pela navbar)
                    const saved = localStorage.getItem("tmetrage_profile");
                    if (saved) {
                      const parsed = JSON.parse(saved);
                      parsed.avatar = null;
                      localStorage.setItem("tmetrage_profile", JSON.stringify(parsed));
                    }

                    // avisar navbar para atualizar
                    window.dispatchEvent(new Event("profileUpdated"));

                    setAvatarDialogOpen(false);
                    toast.success("Avatar removido!");
                  } catch (err) {
                    toast.error(err.message || "Erro ao remover avatar");
                  }
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
                value={editProfileName}
                onChange={(e) => setEditProfileName(e.target.value)}
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
              disabled={!editName.trim() || saving}
              onClick={handleSaveProfile}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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
                      onClick={handleDeleteAccount}
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
      <Dialog open={followDialog !== null} onOpenChange={(open) => { if (!open) { setFollowDialog(null); setFollowSearch(""); setFollowList([]); } }}>
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
            {followList
              .filter((u) =>
                !followSearch.trim() ||
                u.name.toLowerCase().includes(followSearch.toLowerCase()) ||
                u.profileName.toLowerCase().includes(followSearch.toLowerCase())
              )
              .map((u) => (
                <Link
                  key={u.profileName}
                  to={`/usuario/${u.profileName.replace("@", "")}`}
                  onClick={() => { setFollowDialog(null); setFollowSearch(""); setFollowList([]); }}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40"
                >
                  <Avatar className="h-9 w-9">
                    {u.avatar ? (
                      <AvatarImage src={getImageUrl(u.avatar)} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                        {u.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {u.profileName.startsWith("@") ? u.profileName : `@${u.profileName}`}
                    </p>
                  </div>
                  <span className="text-xs text-primary font-medium">Ver perfil →</span>
                </Link>
              ))}
            {followList.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum usuário encontrado.</p>
            )}
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
              onClick={handleChangePassword}
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
