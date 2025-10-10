"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [role, setRole] = useState<"admin" | "staff" | "student">("student");
  const [form, setForm] = useState({ email: "", password: "", rollNumber: "", dob: "" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const credentials =
      role === "admin"
        ? { email: form.email, password: form.password }
        : role === "staff"
        ? { email: form.email, password: form.password }
        : { rollNumber: form.rollNumber, dob: form.dob };

    const res = await signIn(role, {
      ...credentials,
      redirect: false,
    });

    if (res?.ok) {
      router.push(
        role === "admin" ? "/admin" :
        role === "staff" ? "/staff/${email}" :
        "/student/${rollNumber}"
      );
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center text-black bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-96 space-y-6">
        <h2 className="text-xl font-semibold text-center text-gray-800">Login</h2>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as any)}
          className="w-full border rounded-lg p-2"
        >
          <option value="student">Student</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        {role === "student" ? (
          <>
            <input
              placeholder="Roll Number"
              className="w-full border rounded-lg p-2"
              value={form.rollNumber}
              onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
            />
            <input
              placeholder="Date of Birth (YYYY-MM-DD)"
              className="w-full border rounded-lg p-2"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />
          </>
        ) : (
          <>
            <input
              placeholder="Email"
              className="w-full border rounded-lg p-2"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              placeholder="Password"
              type="password"
              className="w-full border rounded-lg p-2"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
