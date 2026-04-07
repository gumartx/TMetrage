import { apiRequest, setToken, removeToken } from "./api";

export interface AuthUser {
  id: string | number;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

interface RegisterResponse {
  token: string;
  user: AuthUser;
}

export async function loginAPI(email: string, password: string): Promise<AuthUser> {
  const data = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  setToken(data.token);
  saveProfileFromUser(data.user);
  return data.user;
}

export async function registerAPI(
  name: string,
  profileName: string,
  email: string,
  password: string
): Promise<AuthUser> {

  const data = await apiRequest<RegisterResponse>("/auth/register", {
    method: "POST",
    body: { name, profileName, email, password },
  });

  return data.user;
}

export async function forgotPasswordAPI(email: string): Promise<void> {
  await apiRequest("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

export function logoutAPI(): void {
  removeToken();
  localStorage.removeItem("tmetrage_profile");
}
 
function saveProfileFromUser(user: AuthUser): void {
  const formattedUsername = user.username.startsWith("@") ? user.username : `@${user.username}`;
  const profileData = {
    name: user.name,
    profileName: formattedUsername,
    username: formattedUsername,
    bio: user.bio || "",
    avatar: user.avatar || "",
    cover: "",
    followers: 0,
    following: 0,
  };
  localStorage.setItem("tmetrage_profile", JSON.stringify(profileData));
}
