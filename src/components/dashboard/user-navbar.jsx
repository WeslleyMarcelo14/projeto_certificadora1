"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LayoutGrid, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const UserNav = () => {
  const { data: session } = useSession();
  const user = session?.user || {};

  return (
    <DropdownMenu>
      {/* Avatar com Tooltip */}
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image || ""} alt={user.name || "Avatar"} />
                  <AvatarFallback className="bg-transparent">{user.name ? user.name.charAt(0) : "?"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Perfil</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Conteúdo do menu suspenso */}
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {/* Informações do usuário */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || "Usuário"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email || "email@example.com"}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Links de navegação */}
        <DropdownMenuGroup>
          <MenuItem href="/dashboard" icon={<LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />} label="Painel" />
          <MenuItem href="/perfil" icon={<User className="w-4 h-4 mr-3 text-muted-foreground" />} label="Perfil" />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {/* Botão de logout */}
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/auth/login" })} className="hover:cursor-pointer">
          <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Componente reutilizável para itens do menu
const MenuItem = ({ href, icon, label }) => (
  <DropdownMenuItem asChild>
    <Link href={href} className="flex items-center">
      {icon}
      {label}
    </Link>
  </DropdownMenuItem>
);

export default UserNav;
