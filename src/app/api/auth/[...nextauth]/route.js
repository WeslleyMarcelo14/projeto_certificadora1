import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/login" },
  callbacks: {
    async jwt({ token, user }) {
      // No primeiro login, atribuímos o ID ao token
      if (user) {
        token.id = user.id;
      }

      // Se o token já possui um ID, buscamos os dados atualizados do usuário
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { isAdmin: true, isApproved: true },
        });

        if (dbUser) {
          // Se você tem uma lógica para forçar o admin, ela pode ser mantida aqui
          if (process.env.FORCE_ADMIN === "true" && !dbUser.isAdmin) {
            await prisma.user.update({
              where: { id: token.id },
              data: { isAdmin: true, isApproved: true },
            });
            token.isAdmin = true;
            token.isApproved = true;
          } else {
            token.isAdmin = dbUser.isAdmin;
            token.isApproved = dbUser.isApproved;
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.isAdmin = token.isAdmin;
      session.user.isApproved = token.isApproved;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
