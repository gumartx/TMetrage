import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Send, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import {
  getCommentsForMovie,
  getReplies,
  addComment,
  toggleLike,
  deleteComment,
  type Comment,
} from "@/lib/comments";

function isLoggedIn(): boolean {
  return !!localStorage.getItem("token");
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}min`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function getCurrentUsername(): string {
  try {
    const saved = localStorage.getItem("tmetrage_profile");

    if (saved) {
      const parsed = JSON.parse(saved);

      if (parsed.profileName) return parsed.profileName;
      if (parsed.name) return parsed.name;
    }
  } catch { /* empty */ }

  return "";
}

interface CommentItemProps {
  comment: Comment;
  onRefresh: () => void;
  depth?: number;
  movieId: number;
}

const CommentItem = ({ comment, onRefresh, depth = 0, movieId }: CommentItemProps) => {

  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);

  const navigate = useNavigate();
  const currentUser = getCurrentUsername();

  const liked = comment.likedBy?.includes(currentUser);

  const loadReplies = async () => {
    const data = await getReplies(comment.id);
    setReplies(data);
  };

  const handleToggleReplies = async () => {

    if (!showReplies) {
      await loadReplies();
    }

    setShowReplies(!showReplies);
  };

  const handleLike = async () => {

    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    await toggleLike(comment.id);
    onRefresh();
  };

  const handleReply = async () => {

    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    if (!replyText.trim()) return;

    await addComment(movieId, replyText.trim(), comment.id);

    setReplyText("");
    setShowReply(false);

    onRefresh();
  };

  const handleDelete = async () => {

    await deleteComment(comment.id);
    onRefresh();
  };

  const goToProfile = () => {

    if (comment.author === currentUser) {
      navigate("/perfil");
    } else {
      navigate(`/usuario/${encodeURIComponent(comment.author)}`);
    }
  };

  return (
    <div className={`${depth > 0 ? "ml-8 border-l-2 border-border pl-4" : ""}`}>
      <div className="py-3">

        <div className="flex items-center gap-2 mb-1.5">

          <button
            onClick={goToProfile}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary"
          >
            {comment.author.charAt(0).toUpperCase()}
          </button>

          <button
            onClick={goToProfile}
            className="text-sm font-semibold hover:text-primary hover:underline"
          >
            {comment.author}
          </button>

          <span className="text-xs text-muted-foreground">
            {timeAgo(comment.createdAt)}
          </span>

        </div>

        <p className="text-sm mb-2">{comment.content}</p>

        <div className="flex items-center gap-3">

          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-xs ${liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
              }`}
          >
            <Heart className={`h-3.5 w-3.5 ${liked ? "fill-current" : ""}`} />
            {comment.likes > 0 && comment.likes}
          </button>

          {depth < 2 && (
            <button
              onClick={() => setShowReply(!showReply)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Responder
            </button>
          )}

          {comment.author === currentUser && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Excluir
            </button>
          )}

        </div>

        {showReply && (

          <div className="mt-2 flex gap-2">

            <Input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Escreva uma resposta..."
              className="text-sm h-8"
              onKeyDown={(e) => e.key === "Enter" && handleReply()}
            />

            <Button
              size="sm"
              variant="ghost"
              onClick={handleReply}
              className="h-8 px-2"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>

          </div>

        )}

      </div>

      {depth === 0 && (
        <button
          onClick={handleToggleReplies}
          className="ml-2 mb-1 flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {showReplies ? "Ocultar respostas" : "Ver respostas"}
        </button>
      )}

      {showReplies &&
        replies.map((reply) => (
          <CommentItem
            key={reply.id}
            comment={reply}
            onRefresh={onRefresh}
            depth={depth + 1}
            movieId={movieId}
          />
        ))}

    </div>
  );
};

const MovieComments = ({ movieId }: { movieId: number }) => {

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const navigate = useNavigate();

  const loadComments = async () => {

    const data = await getCommentsForMovie(movieId);
    setComments(data);
  };

  useEffect(() => {
    loadComments();
  }, [movieId]);

  const handleSubmit = async () => {

    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    if (!newComment.trim()) return;

    await addComment(movieId, newComment.trim());

    setNewComment("");
    loadComments();
  };

  return (

    <section className="mt-12 pb-16">

      <h2 className="mb-4 text-xl font-bold text-foreground">
        Comentários {comments?.length ? `(${comments.length})` : ""}
      </h2>

      <div className="mb-6 rounded-lg border border-border bg-card p-4">

        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escreva seu comentário sobre o filme..."
          className="mb-3 min-h-[80px]"
          maxLength={500}
        />

        <div className="flex items-center justify-between">

          <span className="text-xs text-muted-foreground">
            {newComment.length}/500
          </span>

          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!newComment.trim()}
          >
            <Send className="mr-1.5 h-3.5 w-3.5" />
            Comentar
          </Button>

        </div>

      </div>

      {comments.length === 0 ? (

        <p className="text-muted-foreground">
          Seja o primeiro a comentar!
        </p>

      ) : (

        <div className="space-y-1 divide-y divide-border">

          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onRefresh={loadComments}
              movieId={movieId}
            />
          ))}

        </div>

      )}

    </section>

  );
};

export default MovieComments;