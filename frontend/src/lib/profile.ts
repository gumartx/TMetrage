import { apiRequest } from "./api";

export interface CurrentUser {
    profileName: string;
    avatar?: string;
}

export interface FavoriteMovie {
    id: number;
    title: string;
    poster_path: string | null;
    genres?: { id: number; name: string }[];
}

export interface UserProfile {
    id: string | number;
    name: string;
    profileName: string;
    email?: string;
    bio?: string;
    avatar?: string;
    cover?: string;
    followers: number;
    following: number;
    isFollowing?: boolean;
    totalRatings: number;
    totalLists: number;
    avgRating: number;
    totalComments: number;
    topGenres?: { name: string; count: number }[];
    ratings: { movieId: number; movieTitle: string; posterPath: string | null; rating: number; date: string }[];
    reviews: { id: number; movieId: number; movieTitle: string; posterPath: string | null; content: string; date: string }[];
    favoriteMovies?: FavoriteMovie[];
}

export async function getCurrentUserProfile(): Promise<CurrentUser> {
  const data = await apiRequest<{ profileName: string, avatar?: string }>("/users/me", { auth: true });
  return {
    ...data,
    profileName: data.profileName.startsWith("@")
      ? data.profileName
      : `@${data.profileName}`,
      avatar: data.avatar || undefined,
  };
}

export async function getMyProfile(): Promise<UserProfile> {
    return apiRequest<UserProfile>("/users", { auth: true });
}

export async function updateProfile(data: {
    name?: string;
    profileName?: string;
    bio?: string;
}): Promise<UserProfile> {
    return apiRequest<UserProfile>("/users", {
        method: "PUT",
        body: data,
        auth: true,
    });
}

export async function updateAvatar(file: File): Promise<UserProfile> {
    const formData = new FormData();
    formData.append("file", file);
    return apiRequest<UserProfile>("/users/avatar", {
        method: "POST",
        body: formData,
        auth: true,
        isFormData: true,
    });
}

export async function updateCover(file: File): Promise<UserProfile> {
    const formData = new FormData();
    formData.append("file", file);
    return apiRequest<UserProfile>("/users/cover", {
        method: "POST",
        body: formData,
        auth: true,
        isFormData: true,
    });
}

export async function removeAvatar(): Promise<void> {
    await apiRequest("/users/avatar", {
        method: "DELETE",
        auth: true,
    });
}

export async function getUserProfile(profileName: string): Promise<UserProfile> {
    profileName = profileName.startsWith("@") ? profileName : `@${profileName}`;
    return apiRequest<UserProfile>(`/users/profile/${profileName}`, {
        method: "GET",
        auth: true
    });
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiRequest("/users/password", {
        method: "PUT",
        body: { currentPassword, newPassword },
        auth: true,
    });
}

export async function deleteAccount(): Promise<void> {
    await apiRequest("/users", {
        method: "DELETE",
        auth: true,
    });
}

export async function searchUsers(query: string): Promise<{ name: string; profileName: string; avatar: string }[]> {
    return apiRequest(`/users/search?search=${encodeURIComponent(query)}`, { auth: true });
}

export async function getFollowers(): Promise<{ name: string; profileName: string; avatar: string }[]> {
    return apiRequest("/users/followers", { auth: true });
}

export async function getFollowing(): Promise<{ name: string; profileName: string; avatar: string }[]> {
    return apiRequest("/users/following", { auth: true });
}

export async function toggleFollow(profileName: string): Promise<{ following: boolean }> {
    profileName = profileName.startsWith("@") ? profileName : `@${profileName}`;
    return apiRequest(`/users/${profileName}/follow`, {
        method: "PUT",
        auth: true,
    });
}

// ===== Favorite movies =====

export async function getFavoriteMovies(profileName: string): Promise<FavoriteMovie[]> {
    const username = profileName.startsWith("@") ? profileName : `@${profileName}`;
    return apiRequest<FavoriteMovie[]>(`/users/${encodeURIComponent(username)}/favorites`, {
        auth: true,
    });
}

export async function addFavoriteMovie(movieId: number): Promise<void> {
    await apiRequest("/users/favorites", {
        method: "POST",
        body: movieId,
        auth: true,
    });
}

export async function removeFavoriteMovie(movieId: number): Promise<void> {
    await apiRequest("/users/favorites", {
        method: "DELETE",
        body: movieId,
        auth: true,
    });
}
