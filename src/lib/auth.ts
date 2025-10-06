// import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import db from '@/db';
// import bcrypt from 'bcrypt';
// import { SignJWT, importJWK, JWTPayload } from 'jose';
// import { randomUUID } from 'crypto';
// import { AuthSession, AuthToken, AuthUser, Role } from './types';
// import { JWT } from 'next-auth/jwt';

// // Helper to generate JWT token using 'jose'
// async function generateJWT(payload: JWTPayload): Promise<string> {
//   const secret = process.env.JWT_SECRET || 'secret';
//   const jwk = { k: secret, alg: 'HS256', kty: 'oct' };
//   const importedKey = await importJWK(jwk, 'HS256');
//   return new SignJWT({ ...payload, iat: Math.floor(Date.now() / 1000), jti: randomUUID() })
//     .setProtectedHeader({ alg: 'HS256' })
//     .setExpirationTime('365d')
//     .sign(importedKey);
// }

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         identifier: { label: 'Email / Roll No', type: 'text', placeholder: 'Email or Roll No' },
//         password: { label: 'Password / DOB', type: 'password', placeholder: 'Password or DOB (YYYY-MM-DD)' },
//       },
//       async authorize(credentials): Promise<AuthUser | null> {
//         if (!credentials) return null;
//         const { identifier, password } = credentials;

//         // ---------- ADMIN LOGIN ----------
//         if (identifier === process.env.ADMIN_EMAIL) {
//           const admin = await db.admin.findUnique({ where: { email: identifier } });
//           if (!admin) return null;
//           const token = await generateJWT({ id: admin.id, role: 'admin' as Role });
//           return { id: admin.id, name: admin.name, email: admin.email, role: 'admin', token };
//         }

//         // ---------- STAFF LOGIN ----------
//         const staff = await db.staff.findUnique({ where: { email: identifier } });
//         if (staff && staff.password && (await bcrypt.compare(password, staff.password))) {
//           const token = await generateJWT({ id: staff.id, role: 'staff' as Role });
//           return { id: staff.id, name: staff.name, email: staff.email, role: 'staff', token };
//         }

//         // ---------- STUDENT LOGIN ----------
//         const student = await db.student.findFirst({ where: { rollNo: identifier } });
//         if (student && student.dob.toISOString().split('T')[0] === password) {
//           const token = await generateJWT({ id: student.id, role: 'student' as Role });
//           return { id: student.id, name: student.name, role: 'student', token };
//         }

//         return null;
//       },
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: { signIn: '/signin' },
//   callbacks: {
//     // SESSION CALLBACK: typed properly
//     async session({ session, token }: { session: any; token: JWT & Partial<AuthToken> }): Promise<AuthSession> {
//       if (session.user) {
//         const user = session.user as AuthSession['user'];
//         if (token.uid) user.id = token.uid;
//         if (token.role) user.role = token.role;
//         if (token.jwtToken) user.jwtToken = token.jwtToken;
//       }
//       return session as AuthSession;
//     },

//     // JWT CALLBACK: typed properly
//     async jwt({ token, user }: { token: JWT & Partial<AuthToken>; user?: AuthUser }): Promise<JWT & Partial<AuthToken>> {
//       if (user) {
//         token.uid = user.id;
//         token.role = user.role;
//         token.jwtToken = user.token;
//       }
//       return token;
//     },
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
