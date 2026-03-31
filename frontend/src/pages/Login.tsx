import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Film, LogIn } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const USERS_KEY = "tmetrage_users";

interface User {
  email: string;
  password: string;
  name: string;
  username: string;
}

interface ProfileData {
  name: string;
  profileName: string;
  username: string;
  bio: string;
  avatar: string;
  cover: string;
  followers: number;
  following: number;
}

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as User[];
    const user = users.find(
      (u: User) => u.email === email.trim().toLowerCase() && u.password === password
    );

    if (!user) {
      toast.error("Email ou senha incorretos");
      return;
    }

    // Set profile in localStorage
    const existing = localStorage.getItem("tmetrage_profile");
    let profileData: ProfileData | undefined;
    if (existing) {
      const parsed = JSON.parse(existing);
      // Only restore if same user
      if (parsed.username === user.username || parsed.profileName === user.username) {
        profileData = parsed;
      }
    }
    if (!profileData) {
      profileData = {
        name: user.name,
        profileName: user.username,
        username: user.username,
        bio: "",
        avatar: "",
        cover: "",
        followers: 0,
        following: 0,
      };
    }
    localStorage.setItem("tmetrage_profile", JSON.stringify(profileData));

    // Seed mock following data if not already present
    const followingKey = `following_${profileData.username}`;
    if (!localStorage.getItem(followingKey)) {
      const mockFollowing = ["cinefilo42", "filmlover", "movieguru", "cinemafan", "screenwriter01"];
      localStorage.setItem(followingKey, JSON.stringify(mockFollowing));

      // Seed mock profiles for the followed users
      const mockProfiles = [
        { name: "Ana Cinéfila", username: "cinefilo42", bio: "Amante de cinema clássico", avatar: "" },
        { name: "Lucas Film", username: "filmlover", bio: "Fã de ficção científica", avatar: "" },
        { name: "Maria Guru", username: "movieguru", bio: "Crítica de filmes independentes", avatar: "" },
        { name: "Pedro Cinema", username: "cinemafan", bio: "Maratonista de séries e filmes", avatar: "" },
        { name: "Julia Roteirista", username: "screenwriter01", bio: "Aspirante a roteirista", avatar: "" },
      ];
      mockProfiles.forEach((p) => {
        if (!localStorage.getItem(`profile_${p.username}`)) {
          localStorage.setItem(`profile_${p.username}`, JSON.stringify(p));
        }
      });
    }

    // Seed mock shared lists if not already present
    const sharedKey = "tmetrage_shared_lists";
    if (!localStorage.getItem(sharedKey)) {
      const lists = JSON.parse(localStorage.getItem("tmetrage_lists") || "[]");
      if (lists.length > 0) {
        const mockShared = [
          {
            id: crypto.randomUUID(),
            list: lists[0],
            sharedBy: profileData.username,
            sharedTo: ["cinefilo42", "filmlover"],
            sharedAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem(sharedKey, JSON.stringify(mockShared));
      }
    }

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container flex items-center justify-center py-16">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
              <Film className="h-7 w-7 text-primary" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-bold text-foreground">
              Entrar na sua conta
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Acesse o TMetrage e continue explorando filmes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Senha
                </label>
                <Link to="/esqueci-senha" className="text-xs text-primary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full gap-2">
              <LogIn className="h-4 w-4" />
              Entrar
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link to="/cadastro" className="font-medium text-primary hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
