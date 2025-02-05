"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FiMail, FiUser, FiKey, FiShield, FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";

const UserType = {
  PENDING: "Visitante",
  COMMON: "Colaborador",
  ADMIN: "Administrador",
};

const getUserRole = (user) => {
  if (user?.isAdmin) return UserType.ADMIN;
  if (user?.isApproved) return UserType.COMMON;
  return UserType.PENDING;
};

const SettingsProfile = () => {
  const { data: session } = useSession();
  const user = session?.user || {};
  const userType = getUserRole(user);

  const userPermissions = {
    canManageTasks: userType !== UserType.PENDING,
    canManageStock: userType !== UserType.PENDING,
    canManageUsers: userType === UserType.ADMIN,
    canManageProducts: userType === UserType.ADMIN,
    canManageMessages: userType === UserType.ADMIN,
  };

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
        {/* Avatar e status */}
        <div className="flex flex-col items-center gap-4 w-full md:w-auto">
          <Avatar className="h-32 w-32 border-2 border-muted">
            <AvatarImage src={user.image || ""} alt={user.name || "Avatar"} className="object-cover" />
            <AvatarFallback className="bg-muted text-foreground text-3xl font-medium">{user.name ? user.name.charAt(0) : "?"}</AvatarFallback>
          </Avatar>

          <div
            className={`px-4 py-2 rounded-full flex items-center gap-2 ${
              userType === UserType.ADMIN ? "bg-purple-100 text-purple-800" : userType === UserType.COMMON ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
            }`}
          >
            {userType === UserType.ADMIN ? <FiShield className="h-4 w-4" /> : userType === UserType.COMMON ? <FiUser className="h-4 w-4" /> : <FiAlertCircle className="h-4 w-4" />}
            <span className="text-sm font-medium">{userType}</span>
          </div>
        </div>

        {/* Informações do usuário */}
        <div className="grid gap-6 w-full">
          <div className="space-y-4">
            {[
              { icon: <FiUser className="h-5 w-5 text-foreground" />, label: "Nome completo", value: user.name || "Usuário" },
              { icon: <FiMail className="h-5 w-5 text-foreground" />, label: "Endereço de e-mail", value: user.email || "email@example.com" },
              { icon: <FiKey className="h-5 w-5 text-foreground" />, label: "Identificação do usuário", value: user.id || "N/A", mono: true },
            ].map(({ icon, label, value, mono }, index) => (
              <div key={index}>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-muted">{icon}</div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className={`font-medium ${mono ? "font-mono text-sm" : ""}`}>{value}</p>
                  </div>
                </div>
                {index < 2 && <hr className="border-t border-muted" />}
              </div>
            ))}

            {/* Permissões do usuário */}
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
