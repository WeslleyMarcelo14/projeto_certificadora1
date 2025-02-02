import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async () => {
  try {
    const usersCount = await prisma.user.count();
    const pendingUsersCount = await prisma.user.count({ where: { isApproved: false } });
    const productsCount = await prisma.product.count();
    const donationsCount = await prisma.donation.count();

    // Estoque total somando todas as quantidades das doações
    const totalStock = (await prisma.donation.findMany({ select: { quantity: true } })).reduce((acc, { quantity }) => acc + quantity, 0);

    // Últimas 5 doações
    const latestDonations = await prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, quantity: true, createdAt: true, product: { select: { name: true } } },
    });

    const formattedDonations = latestDonations.map(({ id, quantity, createdAt, product }) => ({
      id,
      quantity,
      createdAt,
      productName: product.name,
    }));

    // Ranking dos 5 produtos mais doados
    const productsGroup = await prisma.donation.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    const productsRanking = await Promise.all(
      productsGroup.map(async ({ productId, _sum }) => {
        const product = await prisma.product.findUnique({
          where: { id: productId },
          select: { name: true },
        });
        return { productId, productName: product?.name || "Desconhecido", totalDonated: _sum.quantity };
      })
    );

    // Última atualização no sistema
    const [userLatest, productLatest, donationLatest] = await Promise.all([
      prisma.user.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
      prisma.product.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
      prisma.donation.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
    ]);

    const lastUpdate = new Date(Math.max(userLatest?.updatedAt?.getTime() || 0, productLatest?.updatedAt?.getTime() || 0, donationLatest?.updatedAt?.getTime() || 0));

    const approvalRate = usersCount > 0 ? (((usersCount - pendingUsersCount) / usersCount) * 100).toFixed(1) : "0";

    return NextResponse.json({
      usersCount,
      pendingUsersCount,
      approvalRate,
      productsCount,
      donationsCount,
      totalStock,
      latestDonations: formattedDonations,
      productsRanking,
      lastUpdate,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
