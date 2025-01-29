"use client";

import { SessionProvider } from "next-auth/react";

const NextAuthProvider = ({ children }) => <SessionProvider>{children}</SessionProvider>;

export default NextAuthProvider;
