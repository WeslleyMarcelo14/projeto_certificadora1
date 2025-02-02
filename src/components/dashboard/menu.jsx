"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LogOut, Ellipsis } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/menu-list";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import CollapseMenuButton from "@/components/dashboard/collapse-menu-button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

const Menu = ({ isOpen }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { isAdmin, isApproved } = session?.user || {};

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-8 h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-132px)] lg:min-h-[calc(100vh-104px)] items-start space-y-1 px-2">
          {getMenuList(isAdmin, isApproved).map(({ groupLabel, menus }, index) => (
            <li key={index} className={cn("w-full", groupLabel && "pt-5")}>
              {groupLabel && <MenuGroupLabel groupLabel={groupLabel} isOpen={isOpen} />}
              <MenuItems menus={menus} pathname={pathname} isOpen={isOpen} />
            </li>
          ))}
          <LogoutButton isOpen={isOpen} />
        </ul>
      </nav>
    </ScrollArea>
  );
};

const MenuGroupLabel = ({ groupLabel, isOpen }) =>
  isOpen ? (
    <p className="text-base font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">{groupLabel}</p>
  ) : (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger className="w-full flex justify-center items-center">
          <Ellipsis className="h-5 w-5" />
        </TooltipTrigger>
        <TooltipContent side="right">{groupLabel}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

const MenuItems = ({ menus, pathname, isOpen }) =>
  menus.map(({ href, label, icon: Icon, active, submenus }, idx) => (
    <div key={idx} className="w-full">
      {!submenus?.length ? (
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button variant={active ?? pathname.startsWith(href) ? "secondary" : "ghost"} className="w-full justify-start h-10 mb-1" asChild>
                <Link href={href}>
                  <span className={cn(isOpen && "mr-4")}>
                    <Icon size={18} />
                  </span>
                  <p className={cn("max-w-[200px] truncate", isOpen ? "translate-x-0 opacity-100" : "-translate-x-96 opacity-0")}>{label}</p>
                </Link>
              </Button>
            </TooltipTrigger>
            {!isOpen && <TooltipContent side="right">{label}</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      ) : (
        <CollapseMenuButton icon={Icon} label={label} active={active ?? pathname.startsWith(href)} submenus={submenus} isOpen={isOpen} />
      )}
    </div>
  ));

const LogoutButton = ({ isOpen }) => {
  const handleLogout = async () => await signOut({ callbackUrl: "/auth/login" });

  return (
    <li className="w-full grow flex items-end">
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button onClick={handleLogout} variant="outline" className="w-full justify-center h-10 mt-5">
              <span className={cn(isOpen && "mr-4")}>
                <LogOut size={18} />
              </span>
              <p className={cn("whitespace-nowrap", isOpen ? "opacity-100" : "opacity-0 hidden")}>Sair</p>
            </Button>
          </TooltipTrigger>
          {!isOpen && <TooltipContent side="right">Sair</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    </li>
  );
};

export default Menu;
