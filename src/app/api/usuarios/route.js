import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        isApproved: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const PUT = async (req) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  try {
    const { id, isAdmin, isApproved } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 });
    }
    if (id === session.user.id) {
      return NextResponse.json({ error: "Não é permitido alterar seu próprio cargo" }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isAdmin: !!isAdmin, isApproved: !!isApproved },
      select: { id: true, name: true, email: true, isAdmin: true, isApproved: true },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
