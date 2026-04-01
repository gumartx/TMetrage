import { Comment } from "@/lib/comments";

export function buildCommentTree(comments: Comment[]): Comment[] {

  const map = new Map<number, Comment>();

  const roots: Comment[] = [];

  comments.forEach(c => {
    map.set(c.id, { ...c, replies: [] });
  });

  comments.forEach(c => {

    const node = map.get(c.id)!;

    if (c.parentId === null) {
      roots.push(node);
    } else {

      const parent = map.get(c.parentId);

      if (parent) {
        parent.replies!.push(node);
      }

    }

  });

  return roots;
}