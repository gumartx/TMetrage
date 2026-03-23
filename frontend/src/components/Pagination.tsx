import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const maxVisible = 5;
  const clampedTotal = Math.min(totalPages, 500); // TMDB max

  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (clampedTotal <= maxVisible + 2) {
      for (let i = 1; i <= clampedTotal; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(clampedTotal - 1, currentPage + 1);
    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < clampedTotal - 1) pages.push("...");
    pages.push(clampedTotal);
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 py-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {getPages().map((page, i) =>
        page === "..." ? (
          <span key={`e${i}`} className="px-2 text-sm text-muted-foreground">…</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-8 w-8 rounded-md text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= clampedTotal}
        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-30"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Pagination;
