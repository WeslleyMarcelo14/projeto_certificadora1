import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const donation = await prisma.donation.findUnique({
      where: { id },
      include: { product: true, user: true },
    });

    if (!donation) {
      return NextResponse.json({ error: "Doação não encontrada" }, { status: 404 });
    }

    return NextResponse.json(donation);
  }

  const donations = await prisma.donation.findMany({
    include: { product: true, user: true },
  });

  return NextResponse.json(donations);
};

export const POST = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    if (!session.user.isApproved) {
      return NextResponse.json({ error: "Usuário não autorizado" }, { status: 403 });
    }

    const { productId, quantity, notes = "" } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "productId é obrigatório" }, { status: 400 });
    }
    if (!quantity || quantity <= 0) {
      return NextResponse.json({ error: "quantity deve ser maior que 0" }, { status: 400 });
    }

    const productExists = await prisma.product.findUnique({ where: { id: productId } });
    if (!productExists) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 400 });
    }

    const donation = await prisma.donation.create({
      data: {
        productId,
        userId: session.user.id,
        quantity,
        notes,
      },
    });

    return NextResponse.json(donation, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
};

export const PUT = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { id, productId, quantity, notes = "" } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID da doação é obrigatório" }, { status: 400 });
    }
    if (!productId) {
      return NextResponse.json({ error: "productId é obrigatório" }, { status: 400 });
    }
    if (!quantity || quantity <= 0) {
      return NextResponse.json({ error: "quantity deve ser maior que 0" }, { status: 400 });
    }

    const donationExists = await prisma.donation.findUnique({ where: { id } });
    if (!donationExists) {
      return NextResponse.json({ error: "Doação não encontrada" }, { status: 404 });
    }

    const updatedDonation = await prisma.donation.update({
      where: { id },
      data: { productId, quantity, notes },
    });

    return NextResponse.json(updatedDonation);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
};

export const DELETE = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID da doação é obrigatório" }, { status: 400 });
    }

    const donation = await prisma.donation.findUnique({ where: { id } });
    if (!donation) {
      return NextResponse.json({ error: "Doação não encontrada" }, { status: 404 });
    }

    if (donation.userId !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    await prisma.donation.delete({ where: { id } });

    return NextResponse.json({ message: "Doação excluída com sucesso" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
};
