"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, School, Users2, Home, UserCircle } from "lucide-react";

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  dob: string;
  grade: string;
  fatherName: string;
  motherName: string;
  address?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  photoUrl?: string;
}

export default function StudentProfilePage() {
  const router = useRouter();
  const { rollNumber } = useParams() as { rollNumber: string };
  const { data: session, status } = useSession();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in or not a student
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated" && session?.user?.role !== "STUDENT") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (!rollNumber || status !== "authenticated") return;

    async function fetchStudent() {
      try {
        const res = await fetch(`/api/admin/student/${rollNumber}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Student not found");

        const data: Student = await res.json();
        setStudent(data);
      } catch (error) {
        console.error(error);
        setStudent(null);
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [rollNumber, status]);

  if (loading)
    return <div className="h-screen flex items-center justify-center text-gray-500">Loading profile...</div>;

  if (!student)
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-500">
        <p>No student found with roll number: <strong>{rollNumber}</strong></p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-gray-50 p-10"
    >
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:underline"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center gap-10 mb-10">
        <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-blue-100 bg-gray-100">
          {student.photoUrl ? (
            <img
              src={student.photoUrl}
              alt={student.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserCircle className="w-full h-full text-gray-300 p-10" />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{student.name}</h1>
          <p className="text-gray-500 text-sm">Roll No: {student.rollNumber}</p>
          <p className="text-blue-600 font-medium mt-1">Class: {student.grade}</p>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-6 border-b pb-2">
          Student Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
          <InfoRow icon={<Calendar size={18} />} label="Date of Birth" value={student.dob} />
          <InfoRow icon={<User size={18} />} label="Gender" value={student.gender} />
          <InfoRow icon={<Users2 size={18} />} label="Father's Name" value={student.fatherName} />
          <InfoRow icon={<Users2 size={18} />} label="Mother's Name" value={student.motherName} />
          <InfoRow icon={<Home size={18} />} label="Address" value={student.address} />
          <InfoRow icon={<School size={18} />} label="Class" value={student.grade} />
        </div>
      </div>
    </motion.div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value || "-"}</p>
      </div>
    </div>
  );
}
