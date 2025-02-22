"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LayoutGrid, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const MenuItem = ({ href, icon, label }) => (
  <DropdownMenuItem asChild>
    <Link href={href} className="flex items-center">
      {icon}
      <span>{label}</span>
    </Link>
  </DropdownMenuItem>
);

const UserNav = () => {
  const { data: session } = useSession();
  const { name, email, image } = session?.user || {};

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="relative h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={image || ""} alt={name || "Avatar"} />
                  <AvatarFallback className="bg-transparent">{name ? name.charAt(0) : "?"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Perfil</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name || "Usuário"}</p>
            <p className="text-xs leading-none text-muted-foreground">{email || "email@example.com"}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <MenuItem href="/dashboard" icon={<LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />} label="Painel" />
          <MenuItem href="/perfil" icon={<User className="w-4 h-4 mr-3 text-muted-foreground" />} label="Perfil" />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/auth/login" })} className="cursor-pointer">
          <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
