import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }
    return NextResponse.json(product);
  }

  return NextResponse.json(await prisma.product.findMany());
};

export const POST = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    if (!session.user.isAdmin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { name, description = "" } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Campo 'name' é obrigatório" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: { name: name.trim(), description },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
};

export const DELETE = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    if (!session.user.isAdmin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID do produto é obrigatório" }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "Produto deletado com sucesso" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
};

export const PUT = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    if (!session.user.isAdmin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { id, name, description = "" } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID do produto é obrigatório" }, { status: 400 });
    }
    if (!name?.trim()) {
      return NextResponse.json({ error: "Campo 'name' é obrigatório" }, { status: 400 });
    }

    const productExists = await prisma.product.findUnique({ where: { id } });
    if (!productExists) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name: name.trim(), description },
    });

    return NextResponse.json(updatedProduct);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
};
