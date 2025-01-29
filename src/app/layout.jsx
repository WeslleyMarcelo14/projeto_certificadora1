"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import NextAuthProvider from "./providers";
import DashboardLayout from "@/components/dashboard/layout";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({ children }) => (
  <html lang="pt-BR">
    <body className={inter.className}>
      <NextAuthProvider>
        <ContentWithSession>{children}</ContentWithSession>
      </NextAuthProvider>
    </body>
  </html>
);

const ContentWithSession = ({ children }) => {
  const pathname = usePathname();
  const { status } = useSession();
  const isAuthPage = pathname.startsWith("/auth/login");

  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen text-lg font-semibold">Carregando...</div>;
  }

  return isAuthPage ? children : <DashboardLayout>{children}</DashboardLayout>;
};

export default RootLayout;
