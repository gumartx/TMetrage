export interface MovieListItem {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  genre_ids: number[];
}

export interface MovieList {
  id: string;
  name: string;
  description: string;
  movies: MovieListItem[];
  createdAt: string;
}

const STORAGE_KEY = "tmetrage_lists";

export function getLists(): MovieList[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveLists(lists: MovieList[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}

export function createList(name: string, description: string): MovieList {
  const lists = getLists();
  const newList: MovieList = {
    id: crypto.randomUUID(),
    name,
    description,
    movies: [],
    createdAt: new Date().toISOString(),
  };
  lists.push(newList);
  saveLists(lists);
  return newList;
}

export function deleteList(listId: string) {
  const lists = getLists().filter((l) => l.id !== listId);
  saveLists(lists);
}

export function addMovieToList(listId: string, movie: MovieListItem) {
  const lists = getLists();
  const list = lists.find((l) => l.id === listId);
  if (!list) return;
  if (list.movies.some((m) => m.id === movie.id)) return;
  list.movies.push(movie);
  saveLists(lists);
}

export function removeMovieFromList(listId: string, movieId: number) {
  const lists = getLists();
  const list = lists.find((l) => l.id === listId);
  if (!list) return;
  list.movies = list.movies.filter((m) => m.id !== movieId);
  saveLists(lists);
}

export function updateList(listId: string, name: string, description: string) {
  const lists = getLists();
  const list = lists.find((l) => l.id === listId);
  if (!list) return;
  list.name = name;
  list.description = description;
  saveLists(lists);
}

export function getList(listId: string): MovieList | undefined {
  return getLists().find((l) => l.id === listId);
}
