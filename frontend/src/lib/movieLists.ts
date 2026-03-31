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

// Shared lists
export interface SharedList {
  id: string;
  list: MovieList;
  sharedBy: string; // username of who shared
  sharedTo: string[]; // usernames of recipients
  sharedAt: string;
}

const SHARED_KEY = "tmetrage_shared_lists";

export function getSharedLists(): SharedList[] {
  const raw = localStorage.getItem(SHARED_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function shareList(list: MovieList, sharedBy: string, sharedTo: string[]) {
  const shared = getSharedLists();
  const entry: SharedList = {
    id: crypto.randomUUID(),
    list: { ...list },
    sharedBy,
    sharedTo,
    sharedAt: new Date().toISOString(),
  };
  shared.push(entry);
  localStorage.setItem(SHARED_KEY, JSON.stringify(shared));
  return entry;
}

export function getMySharedLists(username: string): SharedList[] {
  return getSharedLists().filter((s) => s.sharedBy === username);
}

export function getSharedWithMe(username: string): SharedList[] {
  return getSharedLists().filter((s) => s.sharedTo.includes(username));
}

export function isListShared(listId: string): boolean {
  return getSharedLists().some((s) => s.list.id === listId);
}
