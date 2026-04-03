import { apiRequest } from "./api";

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
    totalRatings: number;
    totalLists: number;
    avgRating: number;
    totalComments: number;
    topGenres?: { name: string; count: number }[];
    ratings: { movieId: number; movieTitle: string; posterPath: string | null; rating: number; date: string }[];
    reviews: { movieId: number; movieTitle: string; posterPath: string | null; content: string; date: string }[];
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
    return apiRequest<UserProfile>(`/users/profile/${profileName}`, { auth: true });
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
    return apiRequest(`/users/${profileName}/follow`, {
        method: "POST",
        auth: true,
    });
}
