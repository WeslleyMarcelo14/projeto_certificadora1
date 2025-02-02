"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ContentLayout from "@/components/dashboard/content-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const EditarProdutoPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/produtos?id=${id}`);
        if (!res.ok) throw new Error("Erro ao carregar produto");
        const { name, description } = await res.json();
        setName(name);
        setDescription(description || "");
      } catch (err) {
        toast({ description: err.message });
      }
    };
    fetchProduct();
  }, [id, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast({ description: "O nome do produto é obrigatório." });

    setLoading(true);
    try {
      const res = await fetch("/api/produtos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, description }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Erro ao atualizar produto");
      }

      toast({ description: "Produto atualizado com sucesso!" });
      router.push("/produtos");
    } catch (err) {
      toast({ description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentLayout title="Editar Produto">
      <Card className="max-w-md mx-auto p-6 shadow-md border rounded-lg bg-white">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" className="mt-1" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" className="mt-1" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="flex space-x-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/produtos">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default EditarProdutoPage;
