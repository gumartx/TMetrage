import { getImageUrl } from "@/lib/files";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { logoutAPI } from "@/lib/auth";

interface ProfileData {
  profileName?: string;
  email?: string;
  avatar?: string;
  name?: string;
}

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const loadProfile = () => {
    try {
      const saved = localStorage.getItem("tmetrage_profile");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (parsed.profileName || parsed.email) {
          setProfileData(parsed);
        } else {
          setProfileData(null);
        }
      } else {
        setProfileData(null);
      }
    } catch {
      setProfileData(null);
    }
  };

  useEffect(() => {
    loadProfile();

    // Atualiza quando navegar
  }, [location]);

  useEffect(() => {
    // Atualiza quando perfil mudar (ex: avatar atualizado)
    const handleProfileUpdate = () => {
      loadProfile();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  const isLoggedIn = !!profileData;

  const handleLogout = () => {
    logoutAPI();
    localStorage.removeItem("tmetrage_profile");
    setProfileData(null);

    toast.success("Você saiu da sua conta");

    navigate("/");
  };

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      location.pathname === path
        ? "text-primary underline underline-offset-4"
        : "text-navbar-foreground"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-navbar">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold text-foreground">
          TMétrage
        </Link>

        <div className="flex items-center gap-8">
          <Link to="/" className={linkClass("/")}>
            Menu
          </Link>

          <Link to={isLoggedIn ? "/listas" : "/login"} className={linkClass("/listas")}>
            Listas
          </Link>

          <Link to={isLoggedIn ? "/filmes-avaliados" : "/login"} className={linkClass("/filmes-avaliados")}>
            Avaliações
          </Link>

          <Link to={isLoggedIn ? "/comentarios" : "/login"} className={linkClass("/comentarios")}>
            Comentários
          </Link>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center focus:outline-none">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/30 hover:ring-primary transition-all cursor-pointer">
                    {profileData?.avatar ? (
                      <AvatarImage
                        src={getImageUrl(profileData.avatar)}
                        alt="Perfil"
                      />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {profileData?.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => navigate("/perfil")}
                  className="cursor-pointer"
                >
                  Perfil
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className={`${linkClass("/login")} flex items-center gap-1.5`}
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;