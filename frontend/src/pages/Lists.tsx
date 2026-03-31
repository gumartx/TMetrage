import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Film, ListMusic, Pencil, Search } from "lucide-react";
import {
  getLists,
  createList,
  deleteList,
  updateList,
  type MovieList
} from "@/lib/movieLists";
import { getPosterUrl } from "@/lib/tmdb";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const Lists = () => {

  const [lists, setLists] = useState<MovieList[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  async function loadLists() {
    setLoading(true);
    const data = await getLists();
    setLists(data);
    setLoading(false);
  }

  useEffect(() => {
    loadLists();
  }, []);

  const filteredLists = useMemo(() => {
    return lists.filter((l) =>
      l.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [lists, search]);

  async function handleCreate() {

    if (!name.trim()) return;

    await createList(name, description);

    setName("");
    setDescription("");
    setOpen(false);

    loadLists();
  }

  async function handleDelete() {

    if (!deleteId) return;

    await deleteList(deleteId);

    setDeleteId(null);

    loadLists();
  }

  function openEdit(list: MovieList) {
    setEditId(list.id);
    setEditName(list.name);
    setEditDescription(list.description);
    setEditOpen(true);
  }

  async function handleEdit() {

    if (!editId) return;

    await updateList(editId, editName, editDescription);

    setEditOpen(false);

    loadLists();
  }

  return (
    <div className="min-h-screen bg-background">

      <Navbar />

      <main className="container py-10">

        <div className="flex items-center justify-between">

          <h1 className="text-2xl font-bold">Minhas Listas</h1>

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
                />

                <Textarea
                  placeholder="Descrição"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <Button
                  onClick={handleCreate}
                  className="w-full"
                  disabled={!name.trim()}
                >
                  Criar Lista
                </Button>

              </div>

            </DialogContent>

          </Dialog>

        </div>

        <div className="mt-6">

          <Input
            placeholder="Pesquisar listas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {loading && <p>Carregando...</p>}

          {!loading && filteredLists.map((list) => (

            <div
              key={list.id}
              className="group relative rounded-lg border bg-card p-5 transition-all hover:shadow-lg"
            >

              <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">

                <button
                  onClick={() => openEdit(list)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-accent"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setDeleteId(list.id)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

              </div>

              <Link to={`/listas/${list.id}`} className="block">

                <h3 className="text-lg font-semibold">
                  {list.name}
                </h3>

                {list.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
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

                      return (
                        <img
                          key={m.id}
                          src={url || ""}
                          alt={m.title}
                          className="h-[100px] w-[67px] rounded-md object-cover"
                        />
                      );
                    })

                  )}

                </div>

                <div className="mt-3 text-xs text-muted-foreground">

                  {list.movies.length} filmes

                </div>

              </Link>

            </div>

          ))}

        </div>

      </main>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>

        <AlertDialogContent>

          <AlertDialogHeader>

            <AlertDialogTitle>Excluir lista</AlertDialogTitle>

            <AlertDialogDescription>

              Tem certeza que deseja excluir?

            </AlertDialogDescription>

          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel>Cancelar</AlertDialogCancel>

            <AlertDialogAction onClick={handleDelete}>

              Excluir

            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>

      </AlertDialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>

        <DialogContent>

          <DialogHeader>

            <DialogTitle>Editar lista</DialogTitle>

          </DialogHeader>

          <div className="space-y-4 pt-2">

            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />

            <Button onClick={handleEdit} className="w-full">

              Salvar

            </Button>

          </div>

        </DialogContent>

      </Dialog>

    </div>
  );
};

export default Lists;