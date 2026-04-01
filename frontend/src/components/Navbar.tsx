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

interface ProfileData {
  profileName?: string;
  username?: string;
  avatar?: string;
  name?: string;
}

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  function loadProfile() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setProfileData(null);
        return;
      }

      const saved = localStorage.getItem("tmetrage_profile");

      if (saved) {
        setProfileData(JSON.parse(saved));
      } else {
        setProfileData(null);
      }
    } catch {
      setProfileData(null);
    }
  }

  useEffect(() => {
    loadProfile();
  }, [location]);

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("tmetrage_profile");
    localStorage.removeItem("token");

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
        {/* Logo */}
        <Link to="/" className="font-display text-xl font-bold text-foreground">
          TMétrage
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8">
          <Link to="/" className={linkClass("/")}>
            Menu
          </Link>

          <Link
            to={isLoggedIn ? "/listas" : "/login"}
            className={linkClass("/listas")}
          >
            Listas
          </Link>

          {/* Logged User */}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center focus:outline-none">
                  <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-primary/30 transition-all hover:ring-primary">
                    {profileData?.avatar ? (
                      <AvatarImage src={profileData.avatar} alt="Perfil" />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                        {profileData?.name?.[0]?.toUpperCase() ||
                          profileData?.profileName?.[0]?.toUpperCase() ||
                          "U"}
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
                  <LogOut className="mr-2 h-4 w-4" />
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