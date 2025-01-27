"use client";

import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <main className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Olá, {session?.user?.name}!</h1>
        <img src={session?.user?.image || ""} alt="Profile" className="w-24 h-24 rounded-full mx-auto mt-4" />
        <p className="text-gray-600 mt-2">Bem-vindo à sua Dashboard.</p>
        <button onClick={() => signOut()} className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Sair
        </button>
      </div>
    </main>
  );
}
