import api from "../lib/api";

const API = "http://localhost:8080/comentarios";

export interface Comment {
  id: number;
  movieId: number;
  author: string;
  content: string;
  profileImg: string
  createdAt: string;
  likes: number;
  likedBy: string[];
  parentId: number | null;
  replies?: Comment[];
}

export const getCommentsForMovie = async (movieId: number) => {
  const response = await api.get(`${API}/filme/${movieId}`);
  return response.data;
};

export const getReplies = async (parentId: number) => {
  const response = await api.get(`${API}/${parentId}/respostas`);
  return response.data;
};

export async function addComment(movieId: number, message: string, parentId?: number) {

  const token = localStorage.getItem("token");

  const response = await api.post(
    `${API}`,
    {
      movieId,
      message,
      parentId
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
}

export const toggleLike = async (commentId: number) => {
  const response = await api.put(`${API}/${commentId}/curtir`);
  return response.data;
};

export const deleteComment = async (commentId: number) => {
  await api.delete(`${API}/${commentId}`);
};