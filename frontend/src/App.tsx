import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import MovieDetail from "./pages/MovieDetail.tsx";
import Lists from "./pages/Lists.tsx";
import ListDetail from "./pages/ListDetail.tsx";
import Profile from "./pages/Profile.tsx";
import Register from "./pages/Register.tsx";
import Login from "./pages/Login.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import UserProfile from "./pages/UserProfile.tsx";
import RatedMovies from "./pages/RatedMovies.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/listas" element={<Lists />} />
          <Route path="/listas/:id" element={<ListDetail />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/esqueci-senha" element={<ForgotPassword />} />
          <Route path="/usuario/:username" element={<UserProfile />} />
          <Route path="/filmes-avaliados" element={<RatedMovies />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
