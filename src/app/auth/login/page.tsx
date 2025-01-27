"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <main className="h-screen flex items-center justify-center bg-softPink p-10">
      <div className="grid w-full h-full grid-cols-1 md:grid-cols-2 bg-lightPink">
        {/* Seção Esquerda */}
        <div className="flex flex-col items-center justify-center bg-mediumPink text-softPink p-6">
          <h1 className="text-5xl font-bold mb-8">Projeto Bons Fluidos</h1>
          <p className="text-lg text-white mb-6 text-center">Bem-vindo ao painel de gerenciamento de doações do projeto Bons Fluidos.</p>
          <p className="text-md text-white mb-6 text-center">
            Faça login usando sua conta <strong>@alunos.utfpr.edu.br</strong>. Este acesso é exclusivo para estudantes da UTFPR.
          </p>
          <Button onClick={() => signIn("google")}>
            <FcGoogle size={25} className="mr-2" />
            Faça login com Google
          </Button>
          <a href="https://www.instagram.com/bonsfluidosutfpr/" target="_blank" rel="noopener noreferrer" className="mt-6 text-sm text-lightPink hover:text-white transition-all">
            Acesse o nosso instagram: @bonsfluidosutfpr
          </a>
        </div>

        {/* Seção Direita */}
        <div className="relative hidden md:block">
          <Image className="object-cover" fill={true} src="/bg.jpg" alt="Imagem de fundo relacionada ao projeto" />
        </div>
      </div>
    </main>
  );
}
