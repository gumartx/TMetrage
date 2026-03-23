import { useState } from "react";
import { Heart, MessageCircle, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  getCommentsForMovie,
  addComment,
  toggleLike,
  deleteComment,
  type Comment,
} from "@/lib/comments";

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

const CURRENT_USER = "Você";

interface CommentItemProps {
  comment: Comment;
  onRefresh: () => void;
  depth?: number;
  movieId: number;
}

const CommentItem = ({ comment, onRefresh, depth = 0, movieId }: CommentItemProps) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const liked = comment.likedBy.includes(CURRENT_USER);

  const handleLike = () => {
    toggleLike(comment.id, CURRENT_USER);
    onRefresh();
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    addComment(movieId, CURRENT_USER, replyText.trim(), comment.id);
    setReplyText("");
    setShowReply(false);
    onRefresh();
  };

  return (
    <div className={`${depth > 0 ? "ml-8 border-l-2 border-border pl-4" : ""}`}>
      <div className="py-3">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
            {comment.author.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-foreground">{comment.author}</span>
          <span className="text-xs text-muted-foreground">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-sm leading-relaxed text-secondary-foreground mb-2">{comment.content}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-xs transition-colors ${
              liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${liked ? "fill-current" : ""}`} />
            {comment.likes > 0 && comment.likes}
          </button>
          {depth < 2 && (
            <button
              onClick={() => setShowReply(!showReply)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Responder
            </button>
          )}
          {comment.author === CURRENT_USER && (
            <button
              onClick={() => {
                deleteComment(comment.id);
                onRefresh();
              }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
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
            <Button size="sm" variant="ghost" onClick={handleReply} className="h-8 px-2">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
      {comment.replies?.map((reply) => (
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
  const [comments, setComments] = useState(() => getCommentsForMovie(movieId));
  const [newComment, setNewComment] = useState("");

  const refresh = () => setComments(getCommentsForMovie(movieId));

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    addComment(movieId, CURRENT_USER, newComment.trim());
    setNewComment("");
    refresh();
  };

  return (
    <section className="mt-12 pb-16">
      <h2 className="mb-4 text-xl font-bold text-foreground">
        Comentários {comments.length > 0 && `(${comments.length})`}
      </h2>

      {/* New comment */}
      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escreva seu comentário sobre o filme..."
          className="mb-3 min-h-[80px] resize-none"
          maxLength={500}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{newComment.length}/500</span>
          <Button size="sm" onClick={handleSubmit} disabled={!newComment.trim()}>
            <Send className="mr-1.5 h-3.5 w-3.5" />
            Comentar
          </Button>
        </div>
      </div>

      {comments.length === 0 ? (
        <p className="text-muted-foreground">Seja o primeiro a comentar!</p>
      ) : (
        <div className="space-y-1 divide-y divide-border">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onRefresh={refresh}
              movieId={movieId}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default MovieComments;
