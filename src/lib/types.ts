import { Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// Roles in the system
export type Role = 'admin' | 'staff' | 'student';

// User object returned from NextAuth authorize
export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  role: Role;
  token: string;
}

// Extended NextAuth Session
export interface AuthSession extends Session {
  user: {
    id: string;
    name: string;
    email?: string;
    role: Role;
    jwtToken: string;
  };
}

// Extended JWT token
export interface AuthToken extends JWT {
  uid: string;
  role: Role;
  jwtToken: string;
}
