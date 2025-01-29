"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const InitialPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
    if (status === "unauthenticated") router.replace("/auth/login");
  }, [status, router]); // Monitora mudanças no status da sessão

  return <div className="flex items-center justify-center h-screen">Carregando...</div>;
};

export default InitialPage;
