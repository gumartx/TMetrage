import { apiRequest, isAuthenticated } from "./api";

export interface RatingResponse {
  movieId: number;
  rating: number;
  platform?: string;
  createdAt: string;
}

// Fetch all ratings for the authenticated user
export async function getUserRatings(): Promise<RatingResponse[]> {
  return apiRequest<RatingResponse[]>("/ratings", { auth: true });
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
