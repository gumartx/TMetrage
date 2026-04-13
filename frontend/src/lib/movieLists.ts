import { apiRequest } from "./api";

export interface UserMovieRating {
  movieId: number;
  profileName: string;
  avatar: string | null;
  rating: number;
}

export interface MovieListItem {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  genre_ids: number[];
  rating?: number;
  platform?: string;
  createdAt?: string;
}

export interface MovieList {
  id: string;
  name: string;
  description: string;
  movies: MovieListItem[];
  owner?: boolean;
  ownerUser?: { profileName: string; name: string; avatar: string | null };
  createdAt: string;
  isPublic: boolean;
}

export interface SharedList {
  id: string;
  list: MovieList;
  sharedBy: string;
  sharedTo: { profileName: string; name: string; avatar: string | null }[];
  sharedAt: string;
  ratings?: UserMovieRating[];
  direction: "sent" | "received";
}

// CRUD de listas
export async function getLists(): Promise<MovieList[]> {
  return apiRequest<MovieList[]>("/lists", { auth: true });
}

export async function getList(listId: string): Promise<MovieList> {
  return apiRequest<MovieList>(`/lists/${listId}`, { auth: true });
}

export async function createList(name: string, description: string | null, isPublic: boolean): Promise<MovieList> {
  return apiRequest<MovieList>("/lists", {
    method: "POST",
    body: { name, description, isPublic },
    auth: true,
  });
}

export async function updateList(listId: string, name: string, description: string | null, isPublic: boolean): Promise<MovieList> {
  return apiRequest<MovieList>(`/lists/${listId}`, {
    method: "PUT",
    body: { name, description, isPublic },
    auth: true,
  });
}

export async function deleteList(listId: string): Promise<void> {
  await apiRequest(`/lists/${listId}`, { method: "DELETE", auth: true });
}

// Filmes na lista
export async function addMovieToList(listId: string, movie: MovieListItem): Promise<void> {
  await apiRequest(`/lists/${listId}/movies`, {
    method: "POST",
    body: movie,
    auth: true,
  });
}

export async function removeMovieFromList(listId: string, movieId: number): Promise<void> {
  await apiRequest(`/lists/${listId}/movies/${movieId}`, {
    method: "DELETE",
    auth: true,
  });
}

// Compartilhamento
export async function shareList(listId: string, sharedTo: string[]): Promise<void> {
  await apiRequest(`/lists/${listId}/share`, {
    method: "POST",
    body: { sharedTo },
    auth: true,
  });
}

export async function getSharedLists(): Promise<SharedList[]> {
  return apiRequest<SharedList[]>("/lists/shared", { auth: true });
}
