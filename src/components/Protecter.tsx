"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Protected({ children, role }: { children: React.ReactNode; role: "STUDENT" | "STAFF" | "ADMIN" }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/"); // redirect to login
    } else if (status === "authenticated" && session?.user?.role !== role) {
      router.replace("/n"); // redirect if wrong role
    }
  }, [status, session, router, role]);

  if (status === "loading") return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (status === "authenticated" && session?.user?.role === role) return <>{children}</>;

  return null; // nothing until redirect
}
