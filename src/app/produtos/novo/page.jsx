"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import ContentLayout from "@/components/dashboard/content-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const NovoProdutoPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast({ description: "Por favor, informe o nome do produto." });

    setLoading(true);
    try {
      const res = await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao criar produto");
      }

      toast({ description: "Produto criado com sucesso!" });
      router.push("/produtos");
    } catch (err) {
      toast({ description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentLayout title="Novo Produto">
      <Card className="max-w-md mx-auto p-6 shadow-md border rounded-lg bg-white">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" className="mt-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Camiseta" required />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" className="mt-1" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Informações adicionais do produto" />
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

export default NovoProdutoPage;
