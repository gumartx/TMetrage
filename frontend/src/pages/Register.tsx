import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Film, UserPlus } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const USERS_KEY = "tmetrage_users";

interface User {
  name: string;
  username: string;
  email: string;
  password: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error("Preencha todos os campos");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    // Check if email or username already exists
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    if (users.find((u: User) => u.email === email.trim().toLowerCase())) {
      toast.error("Este email já está cadastrado");
      return;
    }
    const formattedUsername = username.startsWith("@") ? username : `@${username}`;
    if (users.find((u: User) => u.username === formattedUsername.toLowerCase())) {
      toast.error("Este nome de perfil já está em uso");
      return;
    }

    // Save user
    users.push({
      name: name.trim(),
      username: formattedUsername.toLowerCase(),
      email: email.trim().toLowerCase(),
      password,
    });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Auto-login: set profile
    const profileData = {
      name: name.trim(),
      profileName: formattedUsername.toLowerCase(),
      username: formattedUsername.toLowerCase(),
      bio: "",
      avatar: "",
      cover: "",
      followers: 0,
      following: 0,
    };
    localStorage.setItem("tmetrage_profile", JSON.stringify(profileData));

    toast.success("Conta criada com sucesso!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container flex items-center justify-center py-16">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
              <Film className="h-7 w-7 text-primary" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-bold text-foreground">
              Criar sua conta
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Junte-se ao TMetrage e organize seus filmes favoritos
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Nome completo
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Nome de perfil
              </label>
              <Input
                id="username"
                type="text"
                placeholder="@seunome"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={30}
              />
            </div>

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
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Senha
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
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

            <div className="space-y-2">
              <label htmlFor="confirm" className="text-sm font-medium text-foreground">
                Confirmar senha
              </label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full gap-2">
              <UserPlus className="h-4 w-4" />
              Criar conta
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;
