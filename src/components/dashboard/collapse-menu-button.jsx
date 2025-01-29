"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Dot } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

const CollapseMenuButton = ({ icon: Icon, label, active, submenus, isOpen }) => {
  const pathname = usePathname();
  const isSubmenuActive = submenus.some(({ href, active }) => (active !== undefined ? active : href === pathname));
  const [isCollapsed, setIsCollapsed] = useState(isSubmenuActive);

  return isOpen ? (
    <CollapsibleMenu icon={Icon} label={label} submenus={submenus} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isSubmenuActive={isSubmenuActive} pathname={pathname} />
  ) : (
    <DropdownMenuComponent icon={Icon} label={label} submenus={submenus} isSubmenuActive={isSubmenuActive} pathname={pathname} />
  );
};

// Componente para menus colapsáveis quando o menu está aberto
const CollapsibleMenu = ({ icon: Icon, label, submenus, isCollapsed, setIsCollapsed, isSubmenuActive, pathname }) => (
  <Collapsible open={isCollapsed} onOpenChange={setIsCollapsed} className="w-full">
    <CollapsibleTrigger className="mb-1" asChild>
      <Button variant={isSubmenuActive ? "secondary" : "ghost"} className="w-full h-10 justify-start">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Icon size={18} className="mr-4" />
            <p className="max-w-[150px] truncate">{label}</p>
          </div>
          <ChevronDown size={18} className="transition-transform duration-200" />
        </div>
      </Button>
    </CollapsibleTrigger>
    <CollapsibleContent className="overflow-hidden">
      {submenus.map(({ href, label, active }, index) => (
        <MenuItem key={index} href={href} label={label} active={active ?? pathname === href} />
      ))}
    </CollapsibleContent>
  </Collapsible>
);

// Componente para menus suspensos quando o menu está fechado
const DropdownMenuComponent = ({ icon: Icon, label, submenus, isSubmenuActive, pathname }) => (
  <DropdownMenu>
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant={isSubmenuActive ? "secondary" : "ghost"} className="w-full h-10 mb-1">
              <div className="flex items-center w-full justify-between">
                <Icon size={18} className="mr-4" />
                <p className="max-w-[200px] truncate">{label}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="right" align="start" alignOffset={2}>
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <DropdownMenuContent side="right" sideOffset={25} align="start">
      <DropdownMenuLabel className="max-w-[190px] truncate">{label}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {submenus.map(({ href, label, active }, index) => (
        <DropdownMenuItem key={index} asChild>
          <Link href={href} className={`cursor-pointer ${(active ?? pathname === href) && "bg-secondary"}`}>
            <p className="max-w-[180px] truncate">{label}</p>
          </Link>
        </DropdownMenuItem>
      ))}
      <DropdownMenuArrow className="fill-border" />
    </DropdownMenuContent>
  </DropdownMenu>
);

// Componente reutilizável para itens de menu colapsáveis
const MenuItem = ({ href, label, active }) => (
  <Button variant={active ? "secondary" : "ghost"} className="w-full h-10 justify-start mb-1" asChild>
    <Link href={href}>
      <Dot size={18} className="mr-4 ml-2" />
      <p className="max-w-[170px] truncate">{label}</p>
    </Link>
  </Button>
);

export default CollapseMenuButton;
