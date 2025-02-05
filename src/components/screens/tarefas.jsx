"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";

// =============================================================================
// PRIORITY COMBOBOX – Permite alterar a prioridade via popover com cores
// =============================================================================
const prioridades = [
  { value: "URGENTE", label: "Urgente", icon: AlertTriangle, color: "bg-red-500" },
  { value: "IMPORTANTE", label: "Importante", icon: Info, color: "bg-amber-500" },
  { value: "NORMAL", label: "Normal", icon: CheckCircle2, color: "bg-blue-500" },
];

const PriorityCombobox = ({ currentPriority, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selecionada, setSelecionada] = useState(prioridades.find((p) => p.value === currentPriority) || prioridades[2]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-[120px] justify-start">
          {selecionada ? (
            <>
              <span className={cn("mr-2 h-4 w-4 rounded-full", selecionada.color)} />
              {selecionada.label}
            </>
          ) : (
            <>+ Set priority</>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" side="right" align="start">
        <Command>
          <CommandInput placeholder="Alterar prioridade..." />
          <CommandList>
            <CommandEmpty>Nenhum resultado.</CommandEmpty>
            <CommandGroup>
              {prioridades.map((p) => (
                <CommandItem
                  key={p.value}
                  value={p.value}
                  onSelect={(value) => {
                    const novaPrioridade = prioridades.find((prio) => prio.value === value) || prioridades[2];
                    setSelecionada(novaPrioridade);
                    setIsOpen(false);
                    onChange(novaPrioridade.value);
                  }}
                >
                  <p.icon className={cn("mr-2 h-4 w-4", p.value === selecionada?.value ? "opacity-100" : "opacity-40")} />
                  <span>{p.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// Componente principal
export default function Tarefas() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para o dialog de "Adicionar Tarefa"
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("NORMAL");

  // Só administradores: busca e seleção de colaborador
  const [assignedToQuery, setAssignedToQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Estados para o dialog de "Editar Tarefa"
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Função para excluir tarefa
  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch(`/api/tarefas?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao remover tarefa.");
      }
      setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
      toast({ description: "Tarefa removida com sucesso." });
    } catch (error) {
      toast({ description: error.message });
    }
  };

  // Dialog de confirmação para exclusão de tarefa
  const DeleteTaskDialog = ({ tarefa }) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirma Exclusão</AlertDialogTitle>
          <AlertDialogDescription>Tem certeza que deseja excluir esta tarefa? Esta ação não poderá ser desfeita.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDeleteTask(tarefa.id)}>Excluir</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  // Carrega as tarefas pela API ao montar o componente
  useEffect(() => {
    loadTarefas();
  }, []);

  const loadTarefas = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tarefas");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao carregar tarefas.");
      }
      const data = await res.json();
      setTarefas(data);
    } catch (error) {
      toast({ description: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Busca colaboradores ao digitar no campo de busca
  useEffect(() => {
    const fetchUsers = async () => {
      if (assignedToQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(assignedToQuery)}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Erro ao buscar usuários.");
        }
        const data = await res.json();
        setSearchResults(data);
      } catch (error) {
        toast({ description: error.message });
      }
    };
    fetchUsers();
  }, [assignedToQuery, toast]);

  // Abre o diálogo de edição de tarefa
  const openEditDialog = (tarefa) => {
    setEditingTask(tarefa);
    setEditTitle(tarefa.title);
    setEditDescription(tarefa.description || "");
    setEditDialogOpen(true);
  };

  // Salva as alterações de título e descrição da tarefa pela API
  const handleSaveEditDialog = async () => {
    if (!editTitle.trim()) {
      toast({ description: "O título não pode ser vazio." });
      return;
    }
    try {
      const res = await fetch(`/api/tarefas?id=${editingTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim(),
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao atualizar tarefa.");
      }
      const updatedTask = await res.json();
      setTarefas(tarefas.map((t) => (t.id === editingTask.id ? updatedTask : t)));
      toast({ description: "Tarefa atualizada com sucesso." });
      setEditDialogOpen(false);
    } catch (error) {
      toast({ description: error.message });
    }
  };

  // Adiciona uma nova tarefa pela API
  const handleAddTask = async () => {
    if (!newTitle.trim()) {
      toast({ description: "O título é obrigatório." });
      return;
    }
    const payload = {
      title: newTitle.trim(),
      description: newDescription.trim(),
      priority: newPriority,
    };
    if (session.user.isAdmin) {
      if (selectedUser && selectedUser.id) {
        payload.assignedTo = selectedUser.id;
      } else {
        toast({ description: "Selecione um colaborador válido." });
        return;
      }
    }
    try {
      const res = await fetch("/api/tarefas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao adicionar tarefa.");
      }
      const tarefa = await res.json();
      setTarefas([tarefa, ...tarefas]);
      toast({ description: "Tarefa adicionada com sucesso." });
      setDialogOpen(false);
      setNewTitle("");
      setNewDescription("");
      setNewPriority("NORMAL");
      setAssignedToQuery("");
      setSearchResults([]);
      setSelectedUser(null);
    } catch (error) {
      toast({ description: error.message });
    }
  };

  // Atualiza o status de conclusão da tarefa pela API
  const handleToggleComplete = async (tarefa) => {
    try {
      const res = await fetch(`/api/tarefas?id=${tarefa.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !tarefa.completed }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao atualizar tarefa.");
      }
      const updatedTask = await res.json();
      setTarefas(tarefas.map((t) => (t.id === tarefa.id ? updatedTask : t)));
      toast({ description: "Tarefa atualizada com sucesso." });
    } catch (error) {
      toast({ description: error.message });
    }
  };

  // Atualiza a prioridade da tarefa pela API
  const handlePriorityChange = async (tarefa, novaPrioridade) => {
    try {
      const res = await fetch(`/api/tarefas?id=${tarefa.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: novaPrioridade }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao atualizar prioridade.");
      }
      const updatedTask = await res.json();
      setTarefas(tarefas.map((t) => (t.id === tarefa.id ? updatedTask : t)));
      toast({ description: "Prioridade atualizada." });
    } catch (error) {
      toast({ description: error.message });
    }
  };

  // Configuração da tabela com TanStack React Table
  const columns = useMemo(() => {
    return [
      {
        id: "completed",
        header: "Concluída",
        cell: ({ row }) => {
          const tarefa = row.original;
          return <Checkbox checked={tarefa.completed} onCheckedChange={() => handleToggleComplete(tarefa)} aria-label="Marcar tarefa como concluída" />;
        },
      },
      {
        accessorKey: "title",
        header: "Título",
        cell: ({ row }) => {
          const tarefa = row.original;
          return (
            <div onClick={() => openEditDialog(tarefa)} className={cn("cursor-pointer max-w-[200px] break-words", tarefa.completed && "line-through")}>
              {row.getValue("title")}
            </div>
          );
        },
      },
      {
        accessorKey: "description",
        header: "Descrição",
        cell: ({ row }) => {
          const tarefa = row.original;
          return (
            <div onClick={() => openEditDialog(tarefa)} className="cursor-pointer break-words w-[300px]">
              {row.getValue("description")}
            </div>
          );
        },
      },
      {
        accessorKey: "creator.name",
        header: "Criado por",
        cell: ({ row }) => row.original.creator?.name || "Desconhecido",
      },
      {
        accessorKey: "assignee.name",
        header: "Atribuído para",
        cell: ({ row }) => row.original.assignee?.name || "Desconhecido",
      },
      {
        id: "priority",
        header: "Prioridade",
        cell: ({ row }) => {
          const tarefa = row.original;
          return <PriorityCombobox currentPriority={tarefa.priority} onChange={(novaPrioridade) => handlePriorityChange(tarefa, novaPrioridade)} />;
        },
      },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => {
          const tarefa = row.original;
          return <DeleteTaskDialog tarefa={tarefa} />;
        },
      },
    ];
  }, [tarefas]);

  const table = useReactTable({
    data: tarefas,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!session) {
    return <p>Carregando sessão...</p>;
  }

  if (!session.user.isAdmin && !session.user.isApproved) {
    return <Alert variant="destructive">Você não pode gerenciar tarefas enquanto não for aprovado como colaborador.</Alert>;
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho com botão para abrir o diálogo de "Adicionar Tarefa" */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tarefas</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Adicionar Tarefa</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Tarefa</DialogTitle>
              <DialogDescription>Preencha os dados da nova tarefa.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="title">Título</Label>
                {/* Usamos Textarea para permitir quebra de linha no título */}
                <Textarea id="title" value={newTitle} maxLength={100} rows={3} placeholder="Título (até 3 linhas)" onChange={(e) => setNewTitle(e.target.value)} className="resize-none" />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newDescription}
                  maxLength={296}
                  rows={7}
                  placeholder="Descrição detalhada"
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="resize-none"
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="priority">Prioridade</Label>
                <select id="priority" value={newPriority} onChange={(e) => setNewPriority(e.target.value)} className="border rounded p-2">
                  <option value="URGENTE">Urgente</option>
                  <option value="IMPORTANTE">Importante</option>
                  <option value="NORMAL">Normal</option>
                </select>
              </div>
              {session.user.isAdmin && (
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="collaborator">Buscar Colaborador (Nome ou E-mail)</Label>
                  <Input
                    id="collaborator"
                    placeholder="Digite para buscar..."
                    value={assignedToQuery}
                    onChange={(e) => {
                      setAssignedToQuery(e.target.value);
                      setSelectedUser(null);
                    }}
                  />
                  {searchResults.length > 0 && (
                    <ul className="border border-gray-200 mt-1 max-h-40 overflow-y-auto">
                      {searchResults.map((user) => (
                        <li
                          key={user.id}
                          className="p-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            setSelectedUser(user);
                            setAssignedToQuery(`${user.name} (${user.email})`);
                            setSearchResults([]);
                          }}
                        >
                          {user.name} ({user.email})
                        </li>
                      ))}
                    </ul>
                  )}
                  {selectedUser && <p className="mt-1 text-sm text-green-600">Colaborador selecionado: {selectedUser.name}</p>}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleAddTask}>Salvar Tarefa</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela de Tarefas */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhuma tarefa encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de edição de Tarefa (Título e Descrição) */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Tarefa</DialogTitle>
            <DialogDescription>Altere o título e a descrição da tarefa.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-title">Título</Label>
              <Textarea id="edit-title" value={editTitle} maxLength={100} rows={3} placeholder="Título (até 3 linhas)" onChange={(e) => setEditTitle(e.target.value)} className="resize-none" />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                maxLength={296}
                rows={7}
                placeholder="Descrição detalhada"
                onChange={(e) => setEditDescription(e.target.value)}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEditDialog}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
