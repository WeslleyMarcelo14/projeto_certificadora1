// /app/api/tarefas/route.js

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: Listar tarefas
export const GET = async (req) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    let tasks;
    if (session.user.isAdmin) {
      tasks = await prisma.tarefa.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          creator: { select: { name: true } },
          assignee: { select: { name: true } },
        },
      });
    } else if (session.user.isApproved) {
      tasks = await prisma.tarefa.findMany({
        where: { assignedTo: session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
          creator: { select: { name: true } },
          assignee: { select: { name: true } },
        },
      });
    } else {
      return NextResponse.json({ error: "Você não está autorizado a visualizar tarefas enquanto não for aprovado." }, { status: 403 });
    }
    return NextResponse.json(tasks);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

// POST: Criar nova tarefa
export const POST = async (req) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const { title, description, assignedTo, priority } = await req.json();

    if (!title?.trim()) {
      return NextResponse.json({ error: "Título é obrigatório." }, { status: 400 });
    }

    const validPriorities = ["URGENTE", "IMPORTANTE", "NORMAL"];
    const taskPriority = validPriorities.includes(priority) ? priority : "NORMAL";

    let taskAssignedTo = session.user.id;
    if (session.user.isAdmin) {
      if (assignedTo && typeof assignedTo === "string") {
        taskAssignedTo = assignedTo;
      }
    } else if (session.user.isApproved) {
      taskAssignedTo = session.user.id;
    } else {
      return NextResponse.json({ error: "Você não está autorizado a criar tarefas enquanto não for aprovado." }, { status: 403 });
    }

    const task = await prisma.tarefa.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        createdBy: session.user.id,
        assignedTo: taskAssignedTo,
        priority: taskPriority,
      },
      include: {
        creator: { select: { name: true } },
        assignee: { select: { name: true } },
      },
    });
    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

// PATCH: Atualizar tarefa (editar ou marcar como completa)
// A ID da tarefa deve ser enviada via query (ex.: /api/tarefas?id=...)
export const PATCH = async (req) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID da tarefa é obrigatório." }, { status: 400 });
    }

    const { title, description, completed, priority } = await req.json();

    // Verifica se a tarefa existe
    const task = await prisma.tarefa.findUnique({ where: { id } });
    if (!task) {
      return NextResponse.json({ error: "Tarefa não encontrada." }, { status: 404 });
    }

    // Permissões: Admin pode atualizar qualquer tarefa; Colaborador somente se a tarefa for atribuída a ele.
    if (!session.user.isAdmin && session.user.isApproved) {
      if (task.assignedTo !== session.user.id) {
        return NextResponse.json({ error: "Você não pode editar esta tarefa." }, { status: 403 });
      }
    } else if (!session.user.isAdmin && !session.user.isApproved) {
      return NextResponse.json({ error: "Você não está autorizado a editar tarefas enquanto não for aprovado." }, { status: 403 });
    }

    const updatedData = {};
    if (title !== undefined) {
      if (!title.trim()) {
        return NextResponse.json({ error: "Título não pode ser vazio." }, { status: 400 });
      }
      updatedData.title = title.trim();
    }
    if (description !== undefined) {
      updatedData.description = description?.trim() || null;
    }
    if (completed !== undefined) {
      updatedData.completed = completed;
    }
    if (priority !== undefined) {
      const validPriorities = ["URGENTE", "IMPORTANTE", "NORMAL"];
      if (!validPriorities.includes(priority)) {
        return NextResponse.json({ error: "Prioridade inválida." }, { status: 400 });
      }
      updatedData.priority = priority;
    }

    const updatedTask = await prisma.tarefa.update({
      where: { id },
      data: updatedData,
      include: {
        creator: { select: { name: true } },
        assignee: { select: { name: true } },
      },
    });
    return NextResponse.json(updatedTask);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

// DELETE: Remover tarefa
// A ID da tarefa deve ser enviada via query (ex.: /api/tarefas?id=...)
export const DELETE = async (req) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID da tarefa é obrigatório." }, { status: 400 });
    }

    // Verifica se a tarefa existe para checar as permissões
    const task = await prisma.tarefa.findUnique({ where: { id } });
    if (!task) {
      return NextResponse.json({ error: "Tarefa não encontrada." }, { status: 404 });
    }

    // Permissões: Admin pode remover qualquer tarefa; Colaborador somente pode remover as tarefas que ele mesmo criou.
    if (!session.user.isAdmin && session.user.isApproved) {
      if (task.createdBy !== session.user.id) {
        return NextResponse.json({ error: "Você não pode remover esta tarefa." }, { status: 403 });
      }
    } else if (!session.user.isAdmin && !session.user.isApproved) {
      return NextResponse.json({ error: "Você não está autorizado a remover tarefas enquanto não for aprovado." }, { status: 403 });
    }

    await prisma.tarefa.delete({ where: { id } });
    return NextResponse.json({ message: "Tarefa removida com sucesso." });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
