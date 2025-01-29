"use client";

import Menu from "@/components/dashboard/menu";
import SidebarToggle from "@/components/dashboard/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { PanelsTopLeft } from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;

  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;
  const isSidebarOpen = getOpenState();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        isSidebarOpen ? "w-72" : "w-[90px]",
        settings.disabled && "hidden"
      )}
    >
      {/* Botão para alternar o estado do Sidebar */}
      <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />

      {/* Conteúdo do Sidebar */}
      <div onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800">
        {/* Botão de navegação para o Dashboard */}
        <Button className={cn("transition-transform ease-in-out duration-300 mb-1", isSidebarOpen ? "translate-x-0" : "translate-x-1")} variant="link" asChild>
          <Link href="/dashboard" className="flex items-center gap-2">
            <PanelsTopLeft className="w-6 h-6 mr-1" />
            <h1
              className={cn(
                "font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
                isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-96 opacity-0 hidden"
              )}
            >
              Brand
            </h1>
          </Link>
        </Button>

        {/* Menu de navegação dentro do Sidebar */}
        <Menu isOpen={isSidebarOpen} />
      </div>
    </aside>
  );
};

export default Sidebar;
