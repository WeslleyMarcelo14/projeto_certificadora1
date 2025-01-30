"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FiMail, FiUser, FiKey, FiShield, FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";

const UserType = {
  PENDING: "Aguardando Aprovação",
  COMMON: "Colaborador",
  ADMIN: "Administrador",
};

const SettingsProfile = () => {
  const { data: session } = useSession();
  const user = session?.user || {};
  user.isAdmin = false;
  user.isApproved = true;

  // Determina o tipo de usuário
  const userType = user.isAdmin ? UserType.ADMIN : user.isApproved ? UserType.COMMON : UserType.PENDING;

  // Permissões baseadas no tipo
  const userPermissions = {
    canManageTasks: userType !== UserType.PENDING,
    canManageStock: userType !== UserType.PENDING,
    canManageUsers: userType === UserType.ADMIN,
    canManageProducts: userType === UserType.ADMIN,
    canManageMessages: userType === UserType.ADMIN,
  };

  // Mapeamento de labels
  const permissionLabels = {
    canManageTasks: "Tarefas",
    canManageStock: "Estoque",
    canManageUsers: "Usuários",
    canManageProducts: "Produtos",
    canManageMessages: "Mensagens",
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardContent className="flex flex-col md:flex-row gap-8 pt-6">
        {/* Seção Avatar */}
        <div className="flex flex-col items-center gap-4 w-full md:w-auto">
          <Avatar className="h-32 w-32 border-2 border-muted">
            <AvatarImage src={user.image || ""} alt={user.name || "Avatar"} className="object-cover" />
            <AvatarFallback className="bg-muted text-foreground text-3xl font-medium">{user.name ? user.name.charAt(0) : "?"}</AvatarFallback>
          </Avatar>

          {/* Badge de Tipo de Usuário */}
          <div
            className={`px-4 py-2 rounded-full flex items-center gap-2 ${
              userType === UserType.ADMIN ? "bg-purple-100 text-purple-800" : userType === UserType.COMMON ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
            }`}
          >
            {userType === UserType.ADMIN ? <FiShield className="h-4 w-4" /> : userType === UserType.COMMON ? <FiUser className="h-4 w-4" /> : <FiAlertCircle className="h-4 w-4" />}
            <span className="text-sm font-medium">{userType}</span>
          </div>
        </div>

        {/* Seção Informações */}
        <div className="grid gap-6 w-full">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-muted">
                <FiUser className="h-5 w-5 text-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nome completo</p>
                <p className="font-medium">{user.name || "THALLYS SILVA DOS SANTOS CORREIA"}</p>
              </div>
            </div>

            <hr className="border-t border-muted" />

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-muted">
                <FiMail className="h-5 w-5 text-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Endereço de e-mail</p>
                <p className="font-medium">{user.email || "thallys@alunos.utfpr.edu.br"}</p>
              </div>
            </div>

            <hr className="border-t border-muted" />

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-muted">
                <FiKey className="h-5 w-5 text-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Identificação do usuário</p>
                <p className="font-mono font-medium text-sm">{user.id || "N/A"}</p>
              </div>
            </div>

            <hr className="border-t border-muted" />

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Acessos Permitidos</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(userPermissions).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    {value ? (
                      <>
                        <FiCheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">{permissionLabels[key]}</span>
                      </>
                    ) : (
                      <>
                        <FiXCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-muted-foreground line-through">{permissionLabels[key]}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsProfile;
