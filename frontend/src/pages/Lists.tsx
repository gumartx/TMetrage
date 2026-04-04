import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Film, ListMusic, Pencil, Search, CalendarDays, ChevronLeft, ChevronRight, X, Share2 } from "lucide-react";
import { getLists, createList, deleteList, updateList, getSharedLists, type MovieList, type SharedList } from "@/lib/movieLists";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const Lists = () => {
  const [lists, setLists] = useState<MovieList[]>([]);
  const [sharedLists, setSharedLists] = useState<SharedList[]>([]);
  const [activeTab, setActiveTab] = useState<"mine" | "shared">("mine");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [filterMonth, setFilterMonth] = useState<number | null>(null);
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [search, setSearch] = useState("");

  const loadLists = async () => {
    try {
      const data = await getLists();
      setLists(data);
    } catch { /* */ }
  };

  const loadShared = async () => {
    try {
      const data = await getSharedLists();
      setSharedLists(data);
    } catch { /* */ }
  };

  useEffect(() => {
    loadLists();
    loadShared();
  }, []);

  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  const filteredLists = lists.filter((list) => {
    const matchesSearch = list.name.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filterYear === null && filterMonth === null) return true;
    const created = new Date(list.createdAt);
    if (filterYear !== null && created.getFullYear() !== filterYear) return false;
    if (filterMonth !== null && created.getMonth() !== filterMonth) return false;
    return true;
  });

  const filteredSharedLists = sharedLists.filter((s) =>
    s.list.name.toLowerCase().includes(search.toLowerCase())
  );

  const clearDateFilter = () => {
    setFilterMonth(null);
    setFilterYear(null);
  };

  const dateFilterLabel = filterYear !== null || filterMonth !== null
    ? `${filterMonth !== null ? months[filterMonth] : ""} ${filterYear ?? ""}`.trim()
    : "";

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createList(name.trim(), description.trim());
    await loadLists();
    setName("");
    setDescription("");
    setOpen(false);
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteList(deleteId);
    await loadLists();
    setDeleteId(null);
  };

  const openEdit = (list: MovieList) => {
    setEditId(list.id);
    setEditName(list.name);
    setEditDescription(list.description);
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editId || !editName.trim()) return;
    await updateList(editId, editName.trim(), editDescription.trim());
    await loadLists();
    setEditOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab("mine")}
              className={cn(
                "px-4 py-2 text-lg font-bold rounded-md transition-colors",
                activeTab === "mine"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Minhas Listas
            </button>
            <button
              onClick={() => { setActiveTab("shared"); loadShared(); }}
              className={cn(
                "px-4 py-2 text-lg font-bold rounded-md transition-colors flex items-center gap-2",
                activeTab === "shared"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Share2 className="h-4 w-4" />
              Compartilhadas
            </button>
          </div>

          {activeTab === "mine" && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-1.5 h-4 w-4" />
                  Nova Lista
                </Button>
              </DialogTrigger>
              <DialogContent>
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
                  <Button onClick={handleCreate} className="w-full" disabled={!name.trim()}>
                    Criar Lista
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {((activeTab === "mine" && lists.length > 0) || (activeTab === "shared" && sharedLists.length > 0)) && (
          <div className="mt-6 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={activeTab === "mine" ? "Pesquisar listas..." : "Pesquisar listas compartilhadas..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            {activeTab === "mine" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                    <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                    {dateFilterLabel || <span className="text-muted-foreground">Filtrar por data</span>}
                    {dateFilterLabel && (
                      <X
                        className="ml-auto h-3.5 w-3.5 text-muted-foreground hover:text-foreground"
                        onClick={(e) => { e.stopPropagation(); clearDateFilter(); }}
                      />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3" align="end">
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={() => setCalendarYear((y) => y - 1)} className="p-1 rounded hover:bg-accent">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => { setFilterYear(calendarYear); setFilterMonth(null); }}
                      className={`text-sm font-semibold px-2 py-1 rounded hover:bg-accent ${filterYear === calendarYear && filterMonth === null ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                    >
                      {calendarYear}
                    </button>
                    <button onClick={() => setCalendarYear((y) => y + 1)} className="p-1 rounded hover:bg-accent">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {months.map((m, i) => (
                      <button
                        key={m}
                        onClick={() => { setFilterMonth(i); setFilterYear(calendarYear); }}
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

        <div className="mt-6 border-t border-border" />

        {/* My Lists Tab */}
        {activeTab === "mine" && (
          <>
            {lists.length === 0 ? (
              <div className="mt-20 flex flex-col items-center text-center">
                <ListMusic className="h-16 w-16 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium text-muted-foreground">
                  Você ainda não criou nenhuma lista
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Crie uma lista para organizar seus filmes favoritos
                </p>
              </div>
            ) : filteredLists.length === 0 ? (
              <div className="mt-12 flex flex-col items-center text-center">
                <Search className="h-12 w-12 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Nenhuma lista encontrada para "{search}"
                </p>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredLists.map((list) => (
                  <div
                    key={list.id}
                    className="group relative rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={(e) => { e.preventDefault(); openEdit(list); }}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => { e.preventDefault(); setDeleteId(list.id); }}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <Link to={`/listas/${list.id}`} className="block">
                      <h3 className="text-lg font-semibold text-card-foreground pr-8">
                        {list.name}
                      </h3>
                      {list.description && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {list.description}
                        </p>
                      )}

                      <div className="mt-4 flex gap-2">
                        {list.movies.length === 0 ? (
                          <div className="flex h-[100px] w-full items-center justify-center rounded-md bg-muted">
                            <Film className="h-8 w-8 text-muted-foreground" />
                          </div>
                        ) : (
                          list.movies.slice(0, 5).map((m) => {
                            const url = getPosterUrl(m.poster_path, "w185");
                            return url ? (
                              <img
                                key={m.id}
                                src={url}
                                alt={m.title}
                                className="h-[100px] w-[67px] shrink-0 rounded-md object-cover border border-border"
                                loading="lazy"
                              />
                            ) : (
                              <div
                                key={m.id}
                                className="flex h-[100px] w-[67px] shrink-0 items-center justify-center rounded-md bg-muted border border-border"
                              >
                                <Film className="h-4 w-4 text-muted-foreground" />
                              </div>
                            );
                          })
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{list.movies.length} {list.movies.length === 1 ? "filme" : "filmes"}</span>
                        <span>{new Date(list.createdAt).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Shared Lists Tab */}
        {activeTab === "shared" && (
          <>
            {sharedLists.length === 0 ? (
              <div className="mt-20 flex flex-col items-center text-center">
                <Share2 className="h-16 w-16 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium text-muted-foreground">
                  Nenhuma lista compartilhada
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Compartilhe listas com seus amigos na página de detalhes da lista
                </p>
              </div>
            ) : filteredSharedLists.length === 0 ? (
              <div className="mt-12 flex flex-col items-center text-center">
                <Search className="h-12 w-12 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Nenhuma lista compartilhada encontrada para "{search}"
                </p>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSharedLists.map((shared) => (
                  <div
                    key={shared.id}
                    className="group relative rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {shared.direction === "sent" ? (
                        <>
                          <span className="text-[10px] font-medium bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">Enviada</span>
                          <div className="flex -space-x-2">
                            {shared.sharedTo.map((user) => (
                              <div
                                key={user.profileName}
                                className="h-8 w-8 rounded-full border-2 border-card bg-muted flex items-center justify-center overflow-hidden"
                                title={user.name}
                              >
                                {user.avatar ? (
                                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                ) : (
                                  <span className="text-[10px] font-medium text-muted-foreground">
                                    {user.name.charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {shared.sharedTo.length} {shared.sharedTo.length === 1 ? "pessoa" : "pessoas"}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] font-medium bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">Recebida</span>
                          <span className="text-xs text-muted-foreground">de {shared.sharedBy}</span>
                        </>
                      )}
                    </div>

                    <Link to={`/listas/${shared.list.id}`} className="block">
                      <h3 className="text-lg font-semibold text-card-foreground pr-8">
                        {shared.list.name}
                      </h3>
                      {shared.list.description && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {shared.list.description}
                        </p>
                      )}

                      <div className="mt-4 flex gap-2">
                        {shared.list.movies.length === 0 ? (
                          <div className="flex h-[100px] w-full items-center justify-center rounded-md bg-muted">
                            <Film className="h-8 w-8 text-muted-foreground" />
                          </div>
                        ) : (
                          shared.list.movies.slice(0, 5).map((m) => {
                            const url = getPosterUrl(m.poster_path, "w185");
                            return url ? (
                              <img
                                key={m.id}
                                src={url}
                                alt={m.title}
                                className="h-[100px] w-[67px] shrink-0 rounded-md object-cover border border-border"
                                loading="lazy"
                              />
                            ) : (
                              <div
                                key={m.id}
                                className="flex h-[100px] w-[67px] shrink-0 items-center justify-center rounded-md bg-muted border border-border"
                              >
                                <Film className="h-4 w-4 text-muted-foreground" />
                              </div>
                            );
                          })
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{shared.list.movies.length} {shared.list.movies.length === 1 ? "filme" : "filmes"}</span>
                        <span>Compartilhada em {new Date(shared.sharedAt).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Edit Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
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
              <Button onClick={handleEdit} className="w-full" disabled={!editName.trim()}>
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir lista</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta lista? Essa ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
