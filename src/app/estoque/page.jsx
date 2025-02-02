"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ContentLayout from "@/components/dashboard/content-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const EstoquePage = () => {
  const { toast } = useToast();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/estoque");
        if (!res.ok) throw new Error("Erro ao buscar doações");
        setDonations(await res.json());
      } catch (err) {
        toast({ description: err.message });
      }
      setLoading(false);
    };
    fetchDonations();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Excluir doação?")) return;
    try {
      const res = await fetch(`/api/estoque?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir registro");

      setDonations((prev) => prev.filter((item) => item.id !== id));
      toast({ description: "Doação excluída com sucesso." });
    } catch (err) {
      toast({ description: err.message });
    }
  };

  return (
    <ContentLayout title="Estoque">
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
            <BreadcrumbPage>Estoque</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-6 p-6 bg-white border rounded-lg shadow-sm">
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Gerenciamento de Estoque</h2>
              <p className="text-gray-600 mt-2">Adicione, edite e acompanhe doações.</p>
            </div>
            <Button asChild>
              <Link href="/estoque/novo">Nova Doação</Link>
            </Button>
          </div>

          {loading ? (
            <p className="text-gray-600">Carregando...</p>
          ) : donations.length === 0 ? (
            <p className="text-gray-600">Nenhuma doação registrada.</p>
          ) : (
            <Table>
              <TableCaption>Lista de doações registradas.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead>Registrado Por</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map(({ id, product, quantity, notes, user }) => (
                  <TableRow key={id}>
                    <TableCell className="font-medium">{id}</TableCell>
                    <TableCell>{product?.name || "--"}</TableCell>
                    <TableCell>{quantity}</TableCell>
                    <TableCell>{notes || "--"}</TableCell>
                    <TableCell>{user?.name || "N/A"}</TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/estoque/editar/${id}`}>Editar</Link>
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

export default EstoquePage;
