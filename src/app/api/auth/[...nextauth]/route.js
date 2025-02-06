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
  session: {
    strategy: "jwt",
    maxAge: 60 * 5, // 5 minutos
  },
  pages: { signIn: "/auth/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;

        if (process.env.FORCE_ADMIN === "true" && !user.isAdmin) {
          await prisma.user.update({
            where: { id: user.id },
            data: { isAdmin: true, isApproved: true },
          });
          token.isAdmin = true;
          token.isApproved = true;
        } else {
          token.isAdmin = user.isAdmin;
          token.isApproved = user.isApproved;
        }
      } else if (token.id) {
        // Atualiza o token a cada requisição, garantindo que qualquer mudança no banco seja refletida
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { isAdmin: true, isApproved: true },
        });

        if (dbUser) {
          token.isAdmin = dbUser.isAdmin;
          token.isApproved = dbUser.isApproved;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        // Busca diretamente no banco para garantir dados sempre atualizados
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { isAdmin: true, isApproved: true },
        });

        session.user = {
          ...session.user,
          id: token.id,
          isAdmin: dbUser ? dbUser.isAdmin : false, // Se não encontrar, assume que não é admin
          isApproved: dbUser ? dbUser.isApproved : false,
        };
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
