import { apiRequest } from "./api";

export interface Comment {
  id: number;
  movieId: number;
  author: string;
  avatar: string | null;
  content: string;
  createdAt: string;
  likes: number;
  likedByMe: boolean;
  parentId: number | null;
  replies?: Comment[];
}

interface CommentFilters {
  message?: string;
  movieTitle?: string;
  periodo?: string;
  inicio?: string;
  fim?: string;
}


export async function getCommentsForMovie(movieId: number): Promise<Comment[]> {
  return apiRequest<Comment[]>(`/comments/movies/${movieId}`, {
    method: "GET",
    auth: true
  });
}

export async function getRecentComments(username: string): Promise<Comment[]> {
  return apiRequest<Comment[]>(`/comments/${encodeURIComponent(username)}/recent`, {
    method: "GET",
    auth: true
  });
}

export async function getUserComments(filters?: CommentFilters): Promise<Comment[]> {
  try {
    const params = new URLSearchParams();

    if (filters?.message) params.append("message", filters.message);
    if (filters?.movieTitle) params.append("movieTitle", filters.movieTitle);
    if (filters?.periodo) params.append("periodo", filters.periodo);
    if (filters?.inicio) params.append("inicio", filters.inicio);
    if (filters?.fim) params.append("fim", filters.fim);

    const query = params.toString();

    return await apiRequest<Comment[]>(
      `/comments/search${query ? `?${query}` : ""}`, {
      method: "GET",
      auth: true
    }
    );
  } catch {
    return [];
  }
}

export async function getUserCommentsByProfileName(username: string, filters?: CommentFilters): Promise<Comment[]> {
  try {
    const params = new URLSearchParams();

    if (filters?.message) params.append("message", filters.message);
    if (filters?.movieTitle) params.append("movieTitle", filters.movieTitle);
    if (filters?.periodo) params.append("periodo", filters.periodo);
    if (filters?.inicio) params.append("inicio", filters.inicio);
    if (filters?.fim) params.append("fim", filters.fim);

    const query = params.toString();

    return await apiRequest<Comment[]>(
      `/comments/${encodeURIComponent(username)}/search${query ? `?${query}` : ""}`, {
      method: "GET",
      auth: true
    }
    );
  } catch {
    return [];
  }
}

export async function addComment(
  movieId: number,
  content: string,
  parentId: number | null = null
): Promise<Comment> {
  return apiRequest<Comment>(`/comments/movies/${movieId}`, {
    method: "POST",
    body: { content, parentId },
    auth: true,
  });
}

export async function toggleLike(commentId: number): Promise<void> {
  await apiRequest(`/comments/${commentId}/like`, {
    method: "PUT",
    auth: true,
  });
}

export async function deleteComment(commentId: number): Promise<void> {
  await apiRequest(`/comments/${commentId}`, {
    method: "DELETE",
    auth: true,
  });
}
