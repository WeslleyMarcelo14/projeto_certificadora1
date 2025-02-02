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
      if (user) {
        token.id = user.id;

        // Agora que o PrismaAdapter já criou o usuário, podemos buscá-lo e atualizá-lo
        let dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { isAdmin: true, isApproved: true },
        });

        if (!dbUser) {
          return token; // Se não existir, apenas retorna o token sem erro
        }

        if (process.env.FORCE_ADMIN === "true" && !dbUser.isAdmin) {
          // Atualiza o usuário para admin apenas se ainda não for
          dbUser = await prisma.user.update({
            where: { id: user.id },
            data: { isAdmin: true, isApproved: true },
          });
        }

        token.isAdmin = dbUser.isAdmin;
        token.isApproved = dbUser.isApproved;
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
