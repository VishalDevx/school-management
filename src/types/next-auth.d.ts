import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "STAFF" | "STUDENT";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    role: "ADMIN" | "STAFF" | "STUDENT";
  }

  interface JWT {
    id: string;
    role: "ADMIN" | "STAFF" | "STUDENT";
  }
}
