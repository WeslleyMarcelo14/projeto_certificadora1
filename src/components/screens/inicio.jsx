"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import KpiCard from "@/components/dashboard/KpiCard";
import { FiUsers, FiUserX, FiBox, FiHeart, FiClipboard, FiBell } from "react-icons/fi";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Função para formatar datas no padrão "dd/MM/yyyy HH:mm"
const formatDate = (isoString) => {
  if (!isoString) return "--";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(isoString));
};

const Dashboard = () => {
  const { data: session } = useSession();
  const user = session?.user || {};
  const { toast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar dados da dashboard via API (/api/inicio)
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/inicio");
        if (!res.ok) throw new Error("Erro ao carregar dados da dashboard");
        const json = await res.json();
        setData(json);
      } catch (err) {
        toast({ description: err.message });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [toast]);

  // Data atual formatada para o cabeçalho
  const currentDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Componente para adicionar aviso via Dialog
  const AddNoticeDialog = ({ onNoticeCreated }) => {
    const [noticeText, setNoticeText] = useState("");
    const [loadingDialog, setLoadingDialog] = useState(false);
    const maxNoticeLength = 220;

    async function handleSubmitNotice() {
      if (!noticeText.trim()) {
        toast({ description: "O aviso não pode estar vazio." });
        return;
      }
      setLoadingDialog(true);
      try {
        const res = await fetch("/api/avisos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: noticeText.trim() }),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "Erro ao criar aviso");
        }
        const newNotice = await res.json();
        onNoticeCreated(newNotice);
        setNoticeText("");
        toast({ description: "Aviso criado com sucesso." });
      } catch (err) {
        toast({ description: err.message });
      } finally {
        setLoadingDialog(false);
      }
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Adicionar Aviso
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Criar Aviso</DialogTitle>
            <DialogDescription>Digite o aviso (máx. 200 caracteres). Apenas administradores podem criar avisos.</DialogDescription>
          </DialogHeader>
          <Textarea placeholder="Digite o aviso..." value={noticeText} maxLength={maxNoticeLength} rows={6} onChange={(e) => setNoticeText(e.target.value)} className="mt-4 resize-none" />
          <DialogFooter>
            <Button onClick={handleSubmitNotice} disabled={loadingDialog}>
              {loadingDialog ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const NoticeBoard = () => {
    const [notices, setNotices] = useState([]);
    const [loadingNotices, setLoadingNotices] = useState(false);

    // Carregar avisos da API (/api/avisos)
    useEffect(() => {
      async function loadNotices() {
        setLoadingNotices(true);
        try {
          const res = await fetch("/api/avisos");
          if (!res.ok) throw new Error("Erro ao carregar avisos");
          const json = await res.json();
          setNotices(json);
        } catch (err) {
          toast({ description: err.message });
        } finally {
          setLoadingNotices(false);
        }
      }
      loadNotices();
    }, [toast]);

    async function handleDeleteNotice(id) {
      try {
        const res = await fetch(`/api/avisos?id=${id}`, { method: "DELETE" });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "Erro ao remover aviso");
        }
        setNotices((prev) => prev.filter((notice) => notice.id !== id));
        toast({ description: "Aviso removido com sucesso." });
      } catch (err) {
        toast({ description: err.message });
      }
    }

    const addNewNotice = (notice) => {
      setNotices((prev) => [notice, ...prev]);
    };

    return (
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-base font-medium">Quadro de Mensagens</CardTitle>
          {user?.isAdmin && <AddNoticeDialog onNoticeCreated={addNewNotice} />}
        </CardHeader>
        <CardContent className="space-y-4 relative">
          {loadingNotices ? (
            <p className="text-base text-muted-foreground">Carregando avisos...</p>
          ) : notices.length === 0 ? (
            <p className="text-base text-muted-foreground">Nenhum aviso cadastrado.</p>
          ) : (
            <ul className="space-y-2">
              {notices.map((notice) => (
                <li key={notice.id} className="flex flex-col p-3 border rounded-lg bg-white">
                  {/* Utilizando Alert para exibir o aviso com quebra de linha */}
                  <Alert className="mb-1">
                    <AlertDescription className="whitespace-normal break-words">{notice.text}</AlertDescription>
                  </Alert>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{notice.admin.name || "Administrador"}</span>
                    <span>{formatDate(notice.createdAt)}</span>
                  </div>
                  {user?.isAdmin && (
                    <div className="flex justify-end mt-2">
                      <Button variant="destructive" size="xs" className="rounded-md px-3 py-1" onClick={() => handleDeleteNotice(notice.id)}>
                        Remover
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col p-6 md:p-8">
      {/* Cabeçalho com Boas-Vindas */}
      <div className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image || ""} alt={user.name || "Avatar"} />
            <AvatarFallback>{user.name ? user.name.charAt(0) : "?"}</AvatarFallback>
          </Avatar>
          <div>
            <Alert className="w-full">
              <AlertTitle>Bem-vindo, {user.name || "Usuário"}!</AlertTitle>
              <AlertDescription>Essa é a sua dashboard. Confira os indicadores e avisos abaixo.</AlertDescription>
            </Alert>
          </div>
        </div>
        <span className="text-base text-muted-foreground ml-5">{currentDate}</span>
      </div>

      {loading ? (
        <p className="text-base text-gray-600 mt-4">Carregando dados...</p>
      ) : (
        <>
          {/* Grid de KPI Cards */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-6">
            <KpiCard titulo="Usuários Totais" valor={data.usersCount} descricao="Total de usuários cadastrados" icon={FiUsers} />
            <KpiCard titulo="Usuários Visitantes" valor={data.pendingUsersCount} descricao="Usuários aguardando aprovação (visitantes)" icon={FiUserX} />
            <KpiCard titulo="Produtos" valor={data.productsCount} descricao="Produtos cadastrados" icon={FiBox} />
            <KpiCard titulo="Doações" valor={data.donationsCount} descricao="Doações registradas" icon={FiHeart} />
            <KpiCard titulo="Estoque Total" valor={data.totalStock} descricao="Unidades doadas" icon={FiClipboard} />
          </div>

          {/* Grid: Quadro de Avisos e Coluna Lateral */}
          <div className="grid gap-4 mt-6 grid-cols-1 md:grid-cols-2">
            {/* Coluna Esquerda: Quadro de Avisos */}
            <div>
              <NoticeBoard />
            </div>
            {/* Coluna Direita: Últimas Doações e Ranking de Produtos */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Últimas Doações</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.latestDonations.length > 0 ? (
                    <ul className="space-y-2 text-base text-muted-foreground">
                      {data.latestDonations.map((donation) => (
                        <li key={donation.id} className="flex justify-between">
                          <span>
                            {donation.productName} ({donation.quantity})
                          </span>
                          <span>{new Date(donation.createdAt).toLocaleDateString()}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-base text-muted-foreground">Nenhuma doação recente.</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Ranking de Produtos Mais Doados</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.productsRanking.length > 0 ? (
                    <ol className="list-decimal list-inside text-base text-muted-foreground">
                      {data.productsRanking.map((prod) => (
                        <li key={prod.productId}>
                          {prod.productName} - {prod.totalDonated} unidades
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-base text-muted-foreground">Nenhum produto doado.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
