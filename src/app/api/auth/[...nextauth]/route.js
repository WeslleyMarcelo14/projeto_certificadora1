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
    maxAge: 60 * 5,
  },
  pages: { signIn: "/auth/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { isAdmin: true, isApproved: true },
        });

        if (dbUser) {
          // força o usuário a ser admin
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
      // sempre que o token for atualizado, atualiza a sessão
      if (token?.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { isAdmin: true, isApproved: true },
        });

        session.user = {
          ...session.user,
          id: token.id,
          isAdmin: dbUser ? dbUser.isAdmin : token.isAdmin,
          isApproved: dbUser ? dbUser.isApproved : token.isApproved,
        };
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
