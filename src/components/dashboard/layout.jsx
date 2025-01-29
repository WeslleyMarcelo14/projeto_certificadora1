"use client";

import Footer from "@/components/dashboard/footer";
import Sidebar from "@/components/dashboard/sidebar";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";

const AdminPanelLayout = ({ children }) => {
  // Obtém o estado do sidebar do store
  const sidebar = useStore(useSidebar, (x) => x);

  // Se o sidebar ainda não carregou, não renderiza nada
  if (!sidebar) return null;

  const { getOpenState, settings } = sidebar;
  const isSidebarOpen = getOpenState();

  // Define a margem lateral dependendo do estado do sidebar
  const marginClass = !settings.disabled ? (isSidebarOpen ? "lg:ml-72" : "lg:ml-[90px]") : "";

  return (
    <>
      <Sidebar />
      <main className={cn("min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300", marginClass)}>{children}</main>
      <footer className={cn("transition-[margin-left] ease-in-out duration-300", marginClass)}>
        <Footer />
      </footer>
    </>
  );
};

export default AdminPanelLayout;
