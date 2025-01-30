import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const authOptions = {
  adapter: PrismaAdapter(prisma), // O PrismaAdapter já cuida da criação de User e Account na database, não precisa fazer nada
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" }, // Já é o padrão do NextAuth, pode ser omitido
  pages: { signIn: "/auth/login" }, // Se quiser uma página customizada
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
