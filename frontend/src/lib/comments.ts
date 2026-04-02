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

export async function getCommentsForMovie(movieId: number): Promise<Comment[]> {
  return apiRequest<Comment[]>(`/comments/movies/${movieId}`, {
    method: "GET",
    auth: true
  });
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
