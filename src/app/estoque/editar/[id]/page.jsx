"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ContentLayout from "@/components/dashboard/content-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const EditarDoacaoPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();

  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/produtos");
        if (!res.ok) throw new Error("Erro ao buscar produtos");
        setProducts(await res.json());
      } catch (err) {
        toast({ description: err.message });
      }
    };
    fetchProducts();
  }, [toast]);

  useEffect(() => {
    if (!id) return;

    const fetchDonation = async () => {
      try {
        const res = await fetch(`/api/estoque?id=${id}`);
        if (!res.ok) throw new Error("Erro ao carregar doação");
        const { productId, quantity, notes } = await res.json();
        setProductId(productId);
        setQuantity(quantity);
        setNotes(notes || "");
      } catch (err) {
        toast({ description: err.message });
      }
    };
    fetchDonation();
  }, [id, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId) return toast({ description: "Selecione um produto." });
    if (quantity <= 0) return toast({ description: "A quantidade deve ser maior que 0." });

    setLoading(true);
    try {
      const res = await fetch("/api/estoque", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, productId, quantity: Number(quantity), notes }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Erro ao atualizar doação");
      }

      toast({ description: "Doação atualizada com sucesso!" });
      router.push("/estoque");
    } catch (err) {
      toast({ description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentLayout title="Editar Doação">
      <Card className="max-w-md mx-auto p-6 shadow-md border rounded-lg bg-white">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="select-product">Produto</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger id="select-product" className="w-full mt-1">
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(({ id, name }) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Quantidade</Label>
              <Input id="quantity" type="number" min={1} className="mt-1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <Input id="notes" type="text" className="mt-1" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <div className="flex space-x-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/estoque">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default EditarDoacaoPage;
