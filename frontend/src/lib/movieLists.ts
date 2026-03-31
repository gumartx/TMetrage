import axios from "axios";
import api from "./api";

const API = "http://localhost:8080/listas";

export interface MovieListItem {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  genre_ids: number[];
}

export interface MovieList {
  id: number;
  name: string;
  description: string;
  movies: MovieListItem[];
  createdAt: string;
}

export interface ShareListDTO {
  userId: number;
}

export interface MovieDTO {
  id: number;
}

export async function getLists() {
  const res = await axios.get(API);
  return res.data;
}

export async function getList(id: number) {
  const res = await axios.get(`${API}/${id}`);
  return res.data;
}

export async function createList(name:string,description:string) {
  const res = await api.post("/listas",{name,description});
  return res.data;
}

export async function updateList(id: number, name: string, description: string) {
  const res = await axios.put(`${API}/${id}`, { name, description });
  return res.data;
}

export async function deleteList(id: number) {
  await axios.delete(`${API}/${id}`);
}

export async function addMovieToList(listId: number, movieId: number) {
  await axios.post(`${API}/${listId}/filmes`, { id: movieId });
}

export async function removeMovieFromList(listId: number, movieId: number) {
  await axios.delete(`${API}/${listId}/filmes`, {
    data: { id: movieId }
  });
}