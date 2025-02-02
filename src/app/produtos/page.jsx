"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ContentLayout from "@/components/dashboard/content-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ProdutosPage = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/produtos");
        if (!res.ok) throw new Error("Erro ao buscar produtos");
        setProducts(await res.json());
      } catch (err) {
        toast({ description: err.message });
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Excluir produto?")) return;
    try {
      const res = await fetch(`/api/produtos?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir produto");

      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast({ description: "Produto excluído com sucesso." });
    } catch (err) {
      toast({ description: err.message });
    }
  };

  const formatDate = (isoString) =>
    isoString
      ? new Intl.DateTimeFormat("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        }).format(new Date(isoString))
      : "--";

  return (
    <ContentLayout title="Produtos">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Início</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Painel</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Produtos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-6 p-6">
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Gerenciamento de Produtos</h2>
              <p className="text-gray-600 mt-2">Adicione, edite e exclua produtos do sistema.</p>
            </div>
            <Button asChild>
              <Link href="/produtos/novo">Novo Produto</Link>
            </Button>
          </div>

          {loading ? (
            <p className="text-gray-600">Carregando...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-600">Nenhum produto cadastrado.</p>
          ) : (
            <Table>
              <TableCaption>Lista de produtos cadastrados.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead>Última Atualização</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(({ id, name, description, createdAt, updatedAt }) => (
                  <TableRow key={id}>
                    <TableCell className="font-medium">{id}</TableCell>
                    <TableCell>{name}</TableCell>
                    <TableCell>{description || "--"}</TableCell>
                    <TableCell>{formatDate(createdAt)}</TableCell>
                    <TableCell>{formatDate(updatedAt)}</TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/produtos/editar/${id}`}>Editar</Link>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(id)}>
                        Deletar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default ProdutosPage;
