import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Film, ListMusic, Pencil, Search, CalendarDays, ChevronLeft, ChevronRight, X, Share2, Globe, Lock } from "lucide-react";
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
import { getImageUrl } from "@/lib/files";

// ✅ Fora do componente — evita remontagem a cada render
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
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
  const [isPublic, setIsPublic] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsPublic, setEditIsPublic] = useState(false);
  const [filterMonth, setFilterMonth] = useState<number | null>(null);
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

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

  const isShared = (listId: string) => {
    return sharedLists.some((s) => s.list.id === listId);
  };

  useEffect(() => {
    loadLists();
    loadShared();
  }, []);

  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  const filteredLists = lists.filter((list) => {
    const matchesSearch =
      list.name.toLowerCase().includes(search.toLowerCase()) ||
      list.ownerUser?.profileName.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filterYear === null && filterMonth === null) return true;
    const created = new Date(list.createdAt);
    if (filterYear !== null && created.getFullYear() !== filterYear) return false;
    if (filterMonth !== null && created.getMonth() !== filterMonth) return false;
    return true;
  });

  const groupedSharedLists = Object.values(
    sharedLists.reduce((acc, item) => {
      const listId = item.list.id;
      if (!acc[listId]) {
        acc[listId] = { ...item, sharedTo: [...item.sharedTo] };
      } else {
        acc[listId].sharedTo.push(...item.sharedTo);
      }
      return acc;
    }, {} as Record<string, SharedList>)
  );

  const filteredSharedLists = groupedSharedLists.filter((s) =>
    s.list.name.toLowerCase().includes(search.toLowerCase()) ||
    s.list.ownerUser?.profileName.toLowerCase().includes(search.toLowerCase())
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
    // ✅ description vazia vira null
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
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editId || !editName.trim()) return;
    // ✅ description vazia vira null
    await updateList(editId, editName.trim(), editDescription.trim() || null, editIsPublic);
    setLists((prev) =>
      prev.map((l) =>
        l.id === editId
          ? { ...l, name: editName, description: editDescription, isPublic: editIsPublic }
          : l
      )
    );
    setSharedLists((prev) =>
      prev.map((s) =>
        s.list.id === editId
          ? { ...s, list: { ...s.list, name: editName, description: editDescription, isPublic: editIsPublic } }
          : s
      )
    );
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
                activeTab === "mine" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Minhas Listas
            </button>
            <button
              onClick={() => { setActiveTab("shared"); loadShared(); }}
              className={cn(
                "px-4 py-2 text-lg font-bold rounded-md transition-colors flex items-center gap-2",
                activeTab === "shared" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
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
                <p className="mt-4 text-lg font-medium text-muted-foreground">Você ainda não criou nenhuma lista</p>
                <p className="mt-1 text-sm text-muted-foreground">Crie uma lista para organizar seus filmes favoritos</p>
              </div>
            ) : filteredLists.length === 0 ? (
              <div className="mt-12 flex flex-col items-center text-center">
                <Search className="h-12 w-12 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">Nenhuma lista encontrada para "{search}"</p>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredLists.map((list) => (
                  <div
                    key={list.id}
                    className={cn(
                      "group relative rounded-lg border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
                      isShared(list.id) ? "border-blue-300" : "border-border"
                    )}
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
                      <div className="flex items-center gap-2 pr-16">
                        <h3 className="text-lg font-semibold text-card-foreground truncate">{list.name}</h3>
                        {list.isPublic ? (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
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
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{list.description}</p>
                      )}
                      <div className="mt-4 flex items-center overflow-hidden">
                        {list.movies.length === 0 ? (
                          <div className="flex h-[100px] w-full items-center justify-center rounded-md bg-muted">
                            <Film className="h-8 w-8 text-muted-foreground" />
                          </div>
                        ) : (
                          <>
                            {list.movies.slice(0, 7).map((m) => {
                              const url = getPosterUrl(m.poster_path, "w185");
                              return url ? (
                                <img key={m.id} src={url} alt={m.title} className="h-[100px] w-[67px] shrink-0 -ml-8 first:ml-0 rounded-md object-cover border border-border" />
                              ) : (
                                <div key={m.id} className="flex h-[100px] w-[67px] shrink-0 -ml-8 first:ml-0 items-center justify-center rounded-md bg-muted border border-border">
                                  <Film className="h-4 w-4 text-muted-foreground" />
                                </div>
                              );
                            })}
                            {list.movies.length > 4 && (
                              <div className="flex h-[100px] w-[67px] shrink-0 -ml-8 items-center justify-center rounded-md bg-muted border border-border text-xs font-semibold">
                                +{list.movies.length - 4}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{list.movies.length} {list.movies.length === 1 ? "filme" : "filmes"}</span>
                        <span>{new Date(list.createdAt + "T00:00:00").toLocaleDateString("pt-BR")}</span>
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
                <p className="mt-4 text-lg font-medium text-muted-foreground">Nenhuma lista compartilhada</p>
                <p className="mt-1 text-sm text-muted-foreground">Compartilhe listas com seus amigos na página de detalhes da lista</p>
              </div>
            ) : filteredSharedLists.length === 0 ? (
              <div className="mt-12 flex flex-col items-center text-center">
                <Search className="h-12 w-12 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">Nenhuma lista compartilhada encontrada para "{search}"</p>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSharedLists.map((shared) => (
                  <div key={shared.id} className="group relative rounded-lg border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                    <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={(e) => { e.preventDefault(); openEdit(shared.list); }}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {shared.list.owner && (
                        <button
                          onClick={(e) => { e.preventDefault(); setDeleteId(shared.list.id); }}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <Link to={`/listas/${shared.list.id}`} className="block">
                      {shared.list.ownerUser && (
                        <div className="flex items-center gap-2 mb-3 px-2 py-1.5 rounded-md bg-muted/50">
                          <div className="h-6 w-6 rounded-full border-2 bg-muted flex items-center justify-center overflow-hidden shrink-0">
                            {shared.list.ownerUser.avatar ? (
                              <img src={getImageUrl(shared.list.ownerUser.avatar)} alt={shared.list.ownerUser.name} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-[10px] font-medium text-muted-foreground">
                                {shared.list.ownerUser.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground truncate">
                            Criada por <span className="font-medium text-foreground">{shared.list.ownerUser.profileName}</span>
                          </span>
                        </div>
                      )}
                      {shared.sharedTo && shared.sharedTo.length > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          {shared.sharedTo.slice(0, 5).map((user, index) => (
                            <div key={index} className="h-7 w-7 rounded-full border border-background overflow-hidden bg-muted flex items-center justify-center">
                              {user.avatar ? (
                                <img src={getImageUrl(user.avatar)} alt={user.name} className="h-full w-full object-cover" />
                              ) : (
                                <span className="text-[10px] font-medium text-muted-foreground">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                          ))}
                          {shared.sharedTo.length > 5 && (
                            <span className="text-xs text-muted-foreground ml-1">+{shared.sharedTo.length - 5}</span>
                          )}
                        </div>
                      )}
                      <h3 className="text-lg font-semibold text-card-foreground pr-8">{shared.list.name}</h3>
                      {shared.list.description && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{shared.list.description}</p>
                      )}
                      <div className="mt-4 flex gap-2">
                        {shared.list.movies.length === 0 ? (
                          <div className="flex h-[100px] w-full items-center justify-center rounded-md bg-muted">
                            <Film className="h-8 w-8 text-muted-foreground" />
                          </div>
                        ) : (
                          <>
                            {shared.list.movies.slice(0, 7).map((m) => {
                              const url = getPosterUrl(m.poster_path, "w185");
                              return url ? (
                                <img key={m.id} src={url} alt={m.title} className="h-[100px] w-[67px] shrink-0 -ml-8 first:ml-0 rounded-md object-cover border border-border" />
                              ) : (
                                <div key={m.id} className="flex h-[100px] w-[67px] shrink-0 -ml-8 first:ml-0 items-center justify-center rounded-md bg-muted border border-border">
                                  <Film className="h-4 w-4 text-muted-foreground" />
                                </div>
                              );
                            })}
                            {shared.list.movies.length > 4 && (
                              <div className="flex h-[100px] w-[67px] shrink-0 -ml-8 items-center justify-center rounded-md bg-muted border border-border text-xs font-semibold">
                                +{shared.list.movies.length - 4}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{shared.list.movies.length} {shared.list.movies.length === 1 ? "filme" : "filmes"}</span>
                        <span>{new Date(shared.list.createdAt + "T00:00:00").toLocaleDateString("pt-BR")}</span>
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
              <div className="space-y-1.5">
                <p className="text-sm text-muted-foreground">Visibilidade</p>
                <VisibilityToggle value={editIsPublic} onChange={setEditIsPublic} />
                <p className="text-xs text-muted-foreground">
                  {editIsPublic
                    ? "Qualquer pessoa pode visualizar esta lista."
                    : "Somente você e quem você compartilhar pode ver."}
                </p>
              </div>
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