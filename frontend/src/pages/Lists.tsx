import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  Film,
  List,
  Pencil,
  Search,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Globe,
  Lock,
} from "lucide-react";
import {
  getLists,
  createList,
  deleteList,
  updateList,
  getSharedLists,
  type MovieList,
  type SharedList,
} from "@/lib/movieLists";
import { getPosterUrl } from "@/lib/tmdb";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/files";

const VisibilityToggle = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center gap-2 rounded-lg border border-border p-1 w-full">
    <button
      type="button"
      onClick={() => onChange(false)}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
        !value
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-accent",
      )}
    >
      <Lock className="h-3.5 w-3.5" />
      Privada
    </button>
    <button
      type="button"
      onClick={() => onChange(true)}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
        value
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-accent",
      )}
    >
      <Globe className="h-3.5 w-3.5" />
      Pública
    </button>
  </div>
);

const Lists = () => {
  const [lists, setLists] = useState<MovieList[]>([]);
  const [sharedLists, setSharedLists] = useState<SharedList[]>([]);
  const [activeTab, setActiveTab] = useState<"mine" | "shared">("mine");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isEditingOwner, setIsEditingOwner] = useState(true);
  const [isPublic, setIsPublic] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsPublic, setEditIsPublic] = useState(false);
  const [filterMonth, setFilterMonth] = useState<number | null>(null);
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadLists = async () => {
    try {
      const data = await getLists();
      setLists(data);
    } catch {
      /**/
    }
  };

  const loadShared = async () => {
    try {
      const data = await getSharedLists();
      setSharedLists(data);
    } catch {
      /**/
    }
  };

  const isShared = (listId: string) =>
    sharedLists.some((s) => s.list.id === listId && !s.list.owner);

  useEffect(() => {
    loadLists();
  }, []);
  useEffect(() => {
    if (activeTab === "shared") loadShared();
  }, [activeTab]);

  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const filteredLists = lists.filter((list) => {
    if (!list.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterYear === null && filterMonth === null) return true;
    const created = new Date(list.createdAt);
    if (filterYear !== null && created.getFullYear() !== filterYear) return false;
    if (filterMonth !== null && created.getMonth() !== filterMonth) return false;
    return true;
  });

  const filteredSharedLists = sharedLists.filter((s) =>
    s.list.name.toLowerCase().includes(search.toLowerCase()),
  );

  const clearDateFilter = () => {
    setFilterMonth(null);
    setFilterYear(null);
    setDateFilterOpen(false);
  };

  const dateFilterLabel =
    filterYear !== null || filterMonth !== null
      ? `${filterMonth !== null ? months[filterMonth] : ""} ${filterYear ?? ""}`.trim()
      : "";

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createList(name.trim(), description.trim() || null, isPublic);
    await loadLists();
    setName("");
    setDescription("");
    setIsPublic(false);
    setOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteList(deleteId);
    setLists((prev) => prev.filter((l) => l.id !== deleteId));
    setSharedLists((prev) => prev.filter((s) => s.list.id !== deleteId));
    setDeleteId(null);
  };

  const openEdit = (list: MovieList) => {
    setEditId(list.id);
    setEditName(list.name);
    setEditDescription(list.description ?? "");
    setEditIsPublic(list.isPublic ?? false);
    setIsEditingOwner(list.owner ?? false);
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editId || !editName.trim()) return;
    await updateList(editId, editName.trim(), editDescription.trim() || null, editIsPublic);
    setLists((prev) =>
      prev.map((l) =>
        l.id === editId
          ? { ...l, name: editName, description: editDescription, isPublic: editIsPublic }
          : l,
      ),
    );
    setSharedLists((prev) =>
      prev.map((s) =>
        s.list.id === editId
          ? {
              ...s,
              list: {
                ...s.list,
                name: editName,
                description: editDescription,
                isPublic: editIsPublic,
              },
            }
          : s,
      ),
    );
    setEditOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 py-6 sm:py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab("mine")}
              className={cn(
                "px-3 py-2 text-base sm:text-lg font-bold rounded-md transition-colors",
                activeTab === "mine"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Minhas Listas
            </button>
            <button
              onClick={() => {
                setActiveTab("shared");
                loadShared();
              }}
              className={cn(
                "px-3 py-2 text-base sm:text-lg font-bold rounded-md transition-colors flex items-center gap-1.5",
                activeTab === "shared"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Share2 className="h-4 w-4" />
              Compartilhadas
            </button>
          </div>

          {activeTab === "mine" && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full sm:w-auto">
                  <Plus className="mr-1.5 h-4 w-4" />
                  Nova Lista
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-lg">
                <DialogHeader>
                  <DialogTitle>Criar nova lista</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <Input
                    placeholder="Nome da lista"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  />
                  <Textarea
                    placeholder="Descrição (opcional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                  <div className="space-y-1.5">
                    <p className="text-sm text-muted-foreground">Visibilidade</p>
                    <VisibilityToggle value={isPublic} onChange={setIsPublic} />
                    <p className="text-xs text-muted-foreground">
                      {isPublic
                        ? "Qualquer pessoa pode visualizar esta lista."
                        : "Somente você e quem você compartilhar pode ver."}
                    </p>
                  </div>
                  <Button onClick={handleCreate} className="w-full" disabled={!name.trim()}>
                    Criar Lista
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {((activeTab === "mine" && lists.length > 0) ||
          (activeTab === "shared" && sharedLists.length > 0)) && (
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={
                  activeTab === "mine"
                    ? "Pesquisar listas..."
                    : "Pesquisar listas compartilhadas..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            {activeTab === "mine" && (
              <Popover open={dateFilterOpen} onOpenChange={setDateFilterOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-[180px] justify-start text-left font-normal"
                  >
                    <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                    {dateFilterLabel || (
                      <span className="text-muted-foreground">Filtrar por data</span>
                    )}
                    {dateFilterLabel && (
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label="Remover filtro de período"
                        className="ml-auto rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          clearDateFilter();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            clearDateFilter();
                          }
                        }}
                      >
                        <X className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3" align="end">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => setCalendarYear((y) => y - 1)}
                      className="p-1 rounded hover:bg-accent"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setFilterYear(calendarYear);
                        setFilterMonth(null);
                      }}
                      className={`text-sm font-semibold px-2 py-1 rounded hover:bg-accent ${filterYear === calendarYear && filterMonth === null ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                    >
                      {calendarYear}
                    </button>
                    <button
                      onClick={() => setCalendarYear((y) => y + 1)}
                      className="p-1 rounded hover:bg-accent"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {months.map((m, i) => (
                      <button
                        key={m}
                        onClick={() => {
                          setFilterMonth(i);
                          setFilterYear(calendarYear);
                        }}
                        className={`rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent ${filterMonth === i && filterYear === calendarYear ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        )}

        <div className="mt-5 border-t border-border" />

        {activeTab === "mine" && (
          <>
            {lists.length === 0 ? (
              <div className="mt-20 flex flex-col items-center text-center px-4">
                <List className="h-14 w-14 text-muted-foreground" />
                <p className="mt-4 text-base font-medium text-muted-foreground">
                  Você ainda não criou nenhuma lista
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Crie uma lista para organizar seus filmes favoritos
                </p>
              </div>
            ) : filteredLists.length === 0 ? (
              <div className="mt-12 flex flex-col items-center text-center px-4">
                <Search className="h-10 w-10 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Nenhuma lista encontrada para "{search}"
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredLists.map((list) => (
                  <div
                    key={list.id}
                    className={cn(
                      "group relative rounded-lg border bg-card p-4 sm:p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
                      list.isShared ? "border-blue-400 bg-blue-500/5" : "border-border",
                    )}
                  >
                    <div className="absolute right-3 top-3 flex gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          openEdit(list);
                        }}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setDeleteId(list.id);
                        }}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <Link to={`/listas/${list.id}`} className="block">
                      <div className="flex items-center gap-2 pr-16">
                        <h3 className="text-base sm:text-lg font-semibold text-card-foreground truncate">
                          {list.name}
                        </h3>
                        {list.isPublic ? (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                            <Globe className="h-2.5 w-2.5" />
                            Pública
                          </span>
                        ) : (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            <Lock className="h-2.5 w-2.5" />
                            Privada
                          </span>
                        )}
                      </div>
                      {list.description && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {list.description}
                        </p>
                      )}
                      <div className="mt-3 flex items-center overflow-hidden">
                        {list.movies.length === 0 ? (
                          <div className="flex h-[80px] sm:h-[100px] w-full items-center justify-center rounded-md bg-muted">
                            <Film className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground" />
                          </div>
                        ) : (
                          <>
                            {list.movies.slice(0, 7).map((m) => {
                              const url = getPosterUrl(m.poster_path, "w185");
                              return url ? (
                                <img
                                  key={m.id}
                                  src={url}
                                  alt={m.title}
                                  className="h-[80px] w-[54px] sm:h-[100px] sm:w-[67px] shrink-0 -ml-6 sm:-ml-8 first:ml-0 rounded-md object-cover border border-border"
                                />
                              ) : (
                                <div
                                  key={m.id}
                                  className="flex h-[80px] w-[54px] sm:h-[100px] sm:w-[67px] shrink-0 -ml-6 sm:-ml-8 first:ml-0 items-center justify-center rounded-md bg-muted border border-border"
                                >
                                  <Film className="h-4 w-4 text-muted-foreground" />
                                </div>
                              );
                            })}
                            {list.movies.length > 4 && (
                              <div className="flex h-[80px] w-[54px] sm:h-[100px] sm:w-[67px] shrink-0 -ml-6 sm:-ml-8 items-center justify-center rounded-md bg-muted border border-border text-xs font-semibold">
                                +{list.movies.length - 4}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {list.movies.length} {list.movies.length === 1 ? "filme" : "filmes"}
                        </span>
                        <span>
                          {new Date(list.createdAt + "T00:00:00").toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "shared" && (
          <>
            {sharedLists.length === 0 ? (
              <div className="mt-20 flex flex-col items-center text-center px-4">
                <Share2 className="h-14 w-14 text-muted-foreground" />
                <p className="mt-4 text-base font-medium text-muted-foreground">
                  Nenhuma lista compartilhada
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Compartilhe listas com seus amigos na página de detalhes da lista
                </p>
              </div>
            ) : filteredSharedLists.length === 0 ? (
              <div className="mt-12 flex flex-col items-center text-center px-4">
                <Search className="h-10 w-10 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Nenhuma lista compartilhada encontrada para "{search}"
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSharedLists.map((shared) => (
                  <div
                    key={shared.id}
                    className="group relative rounded-lg border bg-card p-4 sm:p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="absolute right-3 top-3 flex gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          openEdit(shared.list);
                        }}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {shared.list.owner && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setDeleteId(shared.list.id);
                          }}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <Link to={`/listas/${shared.list.id}`} className="block">
                      {(shared.sharedBy.profileName ||
                        (shared.sharedTo && shared.sharedTo.length > 0)) && (
                        <div className="flex items-center gap-2 mb-3 px-2 py-1.5 rounded-md bg-muted/50">
                          <div className="h-6 w-6 rounded-full border-2 bg-muted flex items-center justify-center overflow-hidden shrink-0">
                            {shared.sharedBy.avatar ? (
                              <img
                                src={getImageUrl(shared.sharedBy.avatar)}
                                alt={shared.sharedBy.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-[10px] font-medium text-muted-foreground">
                                {shared.sharedBy.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground truncate">
                            Criada por{" "}
                            <span className="font-medium text-foreground">
                              {shared.sharedBy.profileName}
                            </span>
                          </span>
                        </div>
                      )}
                      {shared.sharedTo && shared.sharedTo.length > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          {shared.sharedTo.slice(0, 5).map((user, index) => (
                            <div
                              key={index}
                              className="h-7 w-7 rounded-full border border-background overflow-hidden bg-muted flex items-center justify-center"
                            >
                              {user.avatar ? (
                                <img
                                  src={getImageUrl(user.avatar)}
                                  alt={user.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-[10px] font-medium text-muted-foreground">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                          ))}
                          {shared.sharedTo.length > 5 && (
                            <span className="text-xs text-muted-foreground ml-1">
                              +{shared.sharedTo.length - 5}
                            </span>
                          )}
                        </div>
                      )}
                      <h3 className="text-base sm:text-lg font-semibold text-card-foreground pr-8">
                        {shared.list.name}
                      </h3>
                      {shared.list.description && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {shared.list.description}
                        </p>
                      )}
                      <div className="mt-3 flex items-center overflow-hidden">
                        {shared.list.movies.length === 0 ? (
                          <div className="flex h-[80px] sm:h-[100px] w-full items-center justify-center rounded-md bg-muted">
                            <Film className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground" />
                          </div>
                        ) : (
                          <>
                            {shared.list.movies.slice(0, 7).map((m) => {
                              const url = getPosterUrl(m.poster_path, "w185");
                              return url ? (
                                <img
                                  key={m.id}
                                  src={url}
                                  alt={m.title}
                                  className="h-[80px] w-[54px] sm:h-[100px] sm:w-[67px] shrink-0 -ml-6 sm:-ml-8 first:ml-0 rounded-md object-cover border border-border"
                                />
                              ) : (
                                <div
                                  key={m.id}
                                  className="flex h-[80px] w-[54px] sm:h-[100px] sm:w-[67px] shrink-0 -ml-6 sm:-ml-8 first:ml-0 items-center justify-center rounded-md bg-muted border border-border"
                                >
                                  <Film className="h-4 w-4 text-muted-foreground" />
                                </div>
                              );
                            })}
                            {shared.list.movies.length > 4 && (
                              <div className="flex h-[80px] w-[54px] sm:h-[100px] sm:w-[67px] shrink-0 -ml-6 sm:-ml-8 items-center justify-center rounded-md bg-muted border border-border text-xs font-semibold">
                                +{shared.list.movies.length - 4}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {shared.list.movies.length}{" "}
                          {shared.list.movies.length === 1 ? "filme" : "filmes"}
                        </span>
                        <span>
                          {new Date(shared.list.createdAt + "T00:00:00").toLocaleDateString(
                            "pt-BR",
                          )}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-lg">
            <DialogHeader>
              <DialogTitle>Editar lista</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <Input
                placeholder="Nome da lista"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEdit()}
              />
              <Textarea
                placeholder="Descrição (opcional)"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
              />
              {isEditingOwner && (
                <div className="space-y-1.5">
                  <p className="text-sm text-muted-foreground">Visibilidade</p>
                  <VisibilityToggle value={editIsPublic} onChange={setEditIsPublic} />
                  <p className="text-xs text-muted-foreground">
                    {editIsPublic
                      ? "Qualquer pessoa pode visualizar esta lista."
                      : "Somente você e quem você compartilhar pode ver."}
                  </p>
                </div>
              )}
              <Button onClick={handleEdit} className="w-full" disabled={!editName.trim()}>
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir lista</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta lista? Essa ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
              <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default Lists;
