"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ContentLayout from "@/components/dashboard/content-layout";
import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FiShield, FiUser, FiAlertCircle } from "react-icons/fi";

const UserType = {
  PENDING: "Aguardando Aprovação",
  COMMON: "Colaborador",
  ADMIN: "Administrador",
};

const getUserRole = ({ isAdmin, isApproved }) => (isAdmin ? UserType.ADMIN : isApproved ? UserType.COMMON : UserType.PENDING);

const RoleBadge = ({ role }) => {
  const badgeStyles = {
    [UserType.ADMIN]: "bg-purple-100 text-purple-800",
    [UserType.COMMON]: "bg-blue-100 text-blue-800",
    [UserType.PENDING]: "bg-orange-100 text-orange-800",
  };

  const icons = {
    [UserType.ADMIN]: <FiShield className="h-4 w-4" />,
    [UserType.COMMON]: <FiUser className="h-4 w-4" />,
    [UserType.PENDING]: <FiAlertCircle className="h-4 w-4" />,
  };

  return (
    <div className={`px-3 py-1 rounded-full flex justify-center items-center gap-2 ${badgeStyles[role]}`}>
      {icons[role]}
      <span className="text-xs font-medium">{role}</span>
    </div>
  );
};

const formatDate = (isoString) => (isoString ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(isoString)) : "--");

const RoleSelect = ({ user, onChange }) => (
  <Select value={getUserRole(user)} onValueChange={onChange}>
    <SelectTrigger className="w-[180px] border rounded-md px-3 py-1 text-sm">
      <SelectValue placeholder="Selecione" />
    </SelectTrigger>
    <SelectContent>
      {Object.values(UserType).map((role) => (
        <SelectItem key={role} value={role}>
          {role}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

const UsuariosPage = () => {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "loading" || !session?.user?.isAdmin) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/usuarios");
        if (!res.ok) throw new Error((await res.json()).error || "Erro ao buscar usuários.");
        setUsers(await res.json());
      } catch (err) {
        console.error(err);
        toast({ description: err.message });
      }
      setLoading(false);
    };

    fetchUsers();
  }, [session, status]);

  const handleRoleChange = async (userId, newRole) => {
    const isAdmin = newRole === UserType.ADMIN;
    const isApproved = newRole !== UserType.PENDING;

    try {
      const res = await fetch("/api/usuarios", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, isAdmin, isApproved }),
      });

      if (!res.ok) throw new Error((await res.json()).error || `Erro ${res.status}: Falha na requisição.`);

      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, isAdmin, isApproved } : user)));
      toast({ description: "Cargo atualizado com sucesso." });
    } catch (err) {
      console.error(err);
      toast({ description: err.message });
    }
  };

  if (status === "loading") return <p>Carregando sessão...</p>;

  if (!session?.user?.isAdmin) {
    return (
      <ContentLayout title="Usuários">
        <Card className="mt-6 p-6 bg-white rounded-lg shadow border">
          <p className="text-center text-gray-600 mt-2">Você não tem permissão para acessar esta página.</p>
        </Card>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Usuários">
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
            <BreadcrumbPage>Usuários</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-6 p-6">
        <CardContent>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Gerenciamento de Usuários</h2>
            <p className="text-gray-600 mt-2">Adicione, edite e acompanhe usuários.</p>
          </div>
          {loading ? (
            <p className="text-gray-600">Carregando usuários...</p>
          ) : users.length === 0 ? (
            <p className="text-gray-600">Nenhum usuário cadastrado.</p>
          ) : (
            <Table>
              <TableCaption>Lista de usuários cadastrados.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Data de Registro</TableHead>
                  <TableHead className="text-center">Cargo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(({ id, name, email, createdAt }) => (
                  <TableRow key={id}>
                    <TableCell className="font-medium">{id}</TableCell>
                    <TableCell>{name || "—"}</TableCell>
                    <TableCell>{email}</TableCell>
                    <TableCell>{formatDate(createdAt)}</TableCell>
                    <TableCell className="text-center">
                      {id === session.user.id ? (
                        <RoleBadge role={getUserRole(users.find((u) => u.id === id))} />
                      ) : (
                        <RoleSelect user={users.find((u) => u.id === id)} onChange={(val) => handleRoleChange(id, val)} />
                      )}
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

export default UsuariosPage;
