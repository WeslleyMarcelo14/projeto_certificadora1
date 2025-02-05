import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        text: true,
        createdAt: true,
        admin: { select: { name: true } },
      },
    });

    return NextResponse.json(notices);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

export const POST = async (req) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    if (!session.user.isAdmin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { text } = await req.json();

    if (!text?.trim() || text.trim().length > 220) {
      return NextResponse.json({ error: "Aviso inválido ou muito longo (máx. 220 caracteres)" }, { status: 400 });
    }

    const notice = await prisma.notice.create({
      data: {
        text: text.trim(),
        adminId: session.user.id,
      },
      select: {
        id: true,
        text: true,
        createdAt: true,
        admin: { select: { name: true } },
      },
    });

    return NextResponse.json(notice, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

export const DELETE = async (req) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    if (!session.user.isAdmin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID do aviso é obrigatório" }, { status: 400 });
    }

    await prisma.notice.delete({ where: { id } });

    return NextResponse.json({ message: "Aviso removido com sucesso" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
