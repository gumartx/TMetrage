import { apiRequest, isAuthenticated } from "./api";

export interface RatingResponse {
  movieId: number;
  movieTitle: string;
  posterPath: string | null;
  rating: number;
  platform?: string;
  createdAt: string;
}

// Fetch all ratings for the authenticated user
export async function getUserRatings(): Promise<RatingResponse[]> {
  return apiRequest<RatingResponse[]>("/ratings", { auth: true });
}

export async function getUserRatingsByProfileName(username: string): Promise<RatingResponse[]> {
  username = username.startsWith("@") ? username : `@${username}`;
  return apiRequest<RatingResponse[]>(`/ratings/public/${encodeURIComponent(username)}`, { auth: true });
}

export async function getRecentRatings(username: string): Promise<RatingResponse[]> {
  const profileName = username.startsWith("@") ? username : `@${username}`;

  return apiRequest<RatingResponse[]>(`/ratings/${encodeURIComponent(profileName)}/recent`, { auth: true });
}

export async function getMovieRatingsList(listId: string): Promise<RatingResponse[]> {
  const raw = await apiRequest<{ id: number; title: string; poster_path: string | null; rating: number | null; platform: string | null; createdAt: string }[]>(
    `/ratings/${listId}/lists`,
    { auth: true }
  );

  return raw
    .filter((r) => r.rating != null)
    .map((r) => ({
      movieId: r.id,
      movieTitle: r.title,
      posterPath: r.poster_path,
      rating: r.rating!,
      platform: r.platform ?? undefined,
      createdAt: r.createdAt,
    }));
}

// Fetch a single rating by movie
export async function getMovieRating(movieId: number): Promise<RatingResponse | null> {
  try {
    return await apiRequest<RatingResponse>(`/ratings/${movieId}`, { auth: true });
  } catch {
    return null;
  }
}

// Create or update a rating (upsert by movieId)
export async function createRating(movieId: number, rating: number, platform?: string): Promise<RatingResponse> {
  return apiRequest<RatingResponse>("/ratings", {
    method: "POST",
    body: { movieId, rating, platform },
    auth: true,
  });
}

// Update an existing rating by movieId
export async function updateRating(movieId: number, rating: number, platform?: string): Promise<RatingResponse> {
  return apiRequest<RatingResponse>(`/ratings/${movieId}`, {
    method: "PUT",
    body: { rating, platform },
    auth: true,
  });
}

// Delete a rating by movieId
export async function deleteRating(movieId: number): Promise<void> {
  await apiRequest(`/ratings/${movieId}`, {
    method: "DELETE",
    auth: true,
  });
}

// Helper: check if user can rate (is authenticated)
export function canRate(): boolean {
  return isAuthenticated();
}
