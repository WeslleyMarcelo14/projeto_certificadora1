import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    jwt: async ({ token, account, profile }) => {
      if (account && profile) {
        Object.assign(token, {
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
        });
      }
      return token;
    },
    session: async ({ session, token }) => {
      Object.assign(session.user, {
        email: token.email,
        name: token.name,
        image: token.picture,
      });
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
