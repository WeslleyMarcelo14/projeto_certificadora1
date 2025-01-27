import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import Button from "@/components/ui/button";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-brandPink">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-brandPink">Bem-vindo!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">Faça login para acessar sua conta.</p>
          <Button onClick={() => signIn("google")} className="w-full flex items-center justify-center gap-2 bg-brandPink text-white hover:bg-pink-300 hover:scale-105 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
              <path fill="#EA4335" d="M24 9.5c3.04 0 5.63 1.03 7.75 2.71l5.78-5.78C33.64 3.17 29.1 1.5 24 1.5 14.86 1.5 7.07 7.03 4.26 15.01l6.92 5.37C12.55 14.04 17.83 9.5 24 9.5z" />
              <path fill="#34A853" d="M46.5 24c0-1.64-.15-3.22-.43-4.74H24v9.02h12.7c-.55 2.97-2.2 5.47-4.7 7.15l7.27 5.64C43.18 37.48 46.5 31.11 46.5 24z" />
              <path fill="#4A90E2" d="M10.33 27.1c-.57-1.64-.9-3.4-.9-5.1s.33-3.46.9-5.1L3.41 11.63C1.76 15.18 1.5 19.02 1.5 24s.26 8.82 1.91 12.37l6.92-5.27z" />
              <path fill="#FBBC05" d="M24 46.5c5.1 0 9.64-1.67 13.28-4.54l-7.27-5.64C27.99 37.93 26.07 38.5 24 38.5c-6.17 0-11.45-4.54-13.13-10.68l-6.92 5.27C7.07 40.97 14.86 46.5 24 46.5z" />
            </svg>
            Entrar com Google
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
