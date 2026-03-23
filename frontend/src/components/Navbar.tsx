import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn, User, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = true;

  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tmetrage_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profileImage) setProfileImage(parsed.profileImage);
      }
    } catch { /* empty */ }
  }, [location]);

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      location.pathname === path ? "text-primary underline underline-offset-4" : "text-navbar-foreground"
    }`;

  const handleLogout = () => {
    // Visual-only logout
    navigate("/login");
  };

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
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/30 hover:ring-primary transition-all cursor-pointer">
                    {profileImage ? (
                      <AvatarImage src={profileImage} alt="Perfil" />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">U</AvatarFallback>
                    )}
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => navigate("/perfil")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login" className={`${linkClass("/login")} flex items-center gap-1.5`}>
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
