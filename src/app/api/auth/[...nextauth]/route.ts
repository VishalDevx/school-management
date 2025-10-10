import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import db from "@/db";

export const authOptions: NextAuthOptions = {
  providers: [
    // 🔹 ADMIN
    CredentialsProvider({
      id: "admin",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;

        if (
          email === process.env.ADMIN_EMAIL &&
          password === process.env.ADMIN_PASSWORD
        ) {
          return { id: "admin-1", name: "Admin", email, role: "ADMIN" };
        }
        return null;
      },
    }),

    // 🔹 STAFF
    CredentialsProvider({
      id: "staff",
      name: "Staff Login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;

        const staff = await db.staff.findUnique({ where: { email } });
        if (!staff) return null;

        const isValid = await compare(password, staff.password);
        if (!isValid) return null;

        return { id: String(staff.id), name: staff.name, email, role: "STAFF" };
      },
    }),

    // 🔹 STUDENT
    CredentialsProvider({
      id: "student",
      name: "Student Login",
      credentials: {
        rollNumber: { label: "Roll Number", type: "text" },
        dob: { label: "Date of Birth", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { rollNumber, dob } = credentials;

        // Find student by roll number
        const student = await db.student.findUnique({ where: { rollNumber } });
        if (!student) {
          console.error("❌ No student found with roll number:", rollNumber);
          return null;
        }

        // ✅ Normalize both sides of DOB to YYYY-MM-DD
        const formattedInputDOB = new Date(dob).toISOString().split("T")[0];
        const formattedDBDOB = new Date(student.dob).toISOString().split("T")[0];

        if (formattedInputDOB !== formattedDBDOB) {
          console.error(
            "❌ DOB mismatch:",
            formattedInputDOB,
            "vs",
            formattedDBDOB
          );
          return null;
        }

        // ✅ Return minimal safe user object
        return {
          id: String(student.id),
          name: student.name,
          rollNumber: student.rollNumber,
          role: "STUDENT",
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as "ADMIN" | "STAFF" | "STUDENT";
        token.rollNumber = (user as any).rollNumber;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "STAFF" | "STUDENT";
        (session.user as any).rollNumber = token.rollNumber;
      }
      return session;
    },
  },

  pages: { signIn: "/" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
