// testInclusion.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testInclusion() {
  try {
    // Dados para incluir no banco
    const novoProduto = await prisma.produto.create({
      data: {
        nome: "Produto Teste",
        marca: "Marca Teste",
        descricao: "Descrição do Produto Teste",
        quantidade: 100,
      },
    });

    console.log('Produto inserido com sucesso:', novoProduto);
  } catch (error) {
    console.error('Erro ao inserir o produto:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testInclusion();
