// src/app/api/produtos/route.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const { nome, marca, descricao, quantidade } = await req.json();

  try {
    // Cria um novo produto no banco de dados
    const novoProduto = await prisma.produto.create({
      data: {
        nome,
        marca,
        descricao,
        quantidade,
      },
    });

    return new Response(JSON.stringify(novoProduto), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao adicionar produto' }), {
      status: 500,
    });
  }
}
