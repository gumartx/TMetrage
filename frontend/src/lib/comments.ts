export interface Comment {
  id: string;
  movieId: number;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
  parentId: string | null;
  replies?: Comment[];
}

const STORAGE_KEY = "movie_comments";

function getAllComments(): Comment[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveAllComments(comments: Comment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
}

export function getCommentsForMovie(movieId: number): Comment[] {
  const all = getAllComments().filter((c) => c.movieId === movieId);
  const map = new Map<string, Comment>();
  const roots: Comment[] = [];

  all.forEach((c) => map.set(c.id, { ...c, replies: [] }));
  map.forEach((c) => {
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.replies!.push(c);
    } else {
      roots.push(c);
    }
  });

  roots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return roots;
}

export function addComment(movieId: number, author: string, content: string, parentId: string | null = null): Comment {
  const all = getAllComments();
  const comment: Comment = {
    id: crypto.randomUUID(),
    movieId,
    author: author.trim(),
    content: content.trim(),
    createdAt: new Date().toISOString(),
    likes: 0,
    likedBy: [],
    parentId,
  };
  all.push(comment);
  saveAllComments(all);
  return comment;
}

export function toggleLike(commentId: string, userId: string): void {
  const all = getAllComments();
  const comment = all.find((c) => c.id === commentId);
  if (!comment) return;

  const idx = comment.likedBy.indexOf(userId);
  if (idx >= 0) {
    comment.likedBy.splice(idx, 1);
    comment.likes--;
  } else {
    comment.likedBy.push(userId);
    comment.likes++;
  }
  saveAllComments(all);
}

export function deleteComment(commentId: string): void {
  const all = getAllComments().filter(
    (c) => c.id !== commentId && c.parentId !== commentId
  );
  saveAllComments(all);
}
