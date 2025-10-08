"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, School, UserCircle, Users2 } from "lucide-react";

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
  const { grade, rollNumber } = useParams() as { grade: string; rollNumber: string };
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const res = await fetch(`/api/admin/student/${grade}/${rollNumber}`, { cache: "no-store" });
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
  }, [grade, rollNumber]);

  if (loading) return <div className="h-screen flex items-center justify-center text-gray-500">Loading profile...</div>;

  if (!student)
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-500">
        <p>No student found with roll number: {rollNumber} in class {grade}</p>
        <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Go Back
        </button>
      </div>
    );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <button onClick={() => router.back()} className="self-start mb-6 flex items-center gap-2 text-blue-600 hover:underline">
        <ArrowLeft size={18} /> Back
      </button>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 border border-gray-100 flex flex-col sm:flex-row gap-8">
        <div className="flex flex-col items-center sm:w-1/3">
          <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 border-4 border-blue-100 shadow-inner">
            {student.photoUrl ? <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" /> : <UserCircle className="w-full h-full text-gray-300 p-8" />}
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">{student.name}</h2>
          <p className="text-gray-500">Roll No: {student.rollNumber}</p>
        </div>

        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoItem icon={<School className="text-blue-500" size={20} />} label="Class" value={student.grade} />
            <InfoItem icon={<Calendar className="text-blue-500" size={20} />} label="DOB" value={student.dob} />
            <InfoItem icon={<Users2 className="text-blue-500" size={20} />} label="Father's Name" value={student.fatherName} />
            <InfoItem icon={<Users2 className="text-blue-500" size={20} />} label="Mother's Name" value={student.motherName} />
            {student.gender && <InfoItem icon={<User className="text-blue-500" size={20} />} label="Gender" value={student.gender} />}
            {student.address && <InfoItem icon={<User className="text-blue-500" size={20} />} label="Address" value={student.address} />}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
      {icon}
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value || "-"}</p>
      </div>
    </div>
  );
}
