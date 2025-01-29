"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const InitialPage = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
    else if (status === "unauthenticated") router.replace("/auth/login");
  }, [status, router]); // Redirecionamento baseado no status da sessão

  return <div className="flex items-center justify-center h-screen">Carregando...</div>;
};

export default InitialPage;
