"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Add this
import { motion } from "framer-motion";
import { Users } from "lucide-react";

type Grade =
  | "NURSERY"
  | "LKG"
  | "UKG"
  | "FIRST"
  | "SECOND"
  | "THIRD"
  | "FOURTH"
  | "FIFTH"
  | "SIXTH"
  | "SEVENTH"
  | "EIGHTH"
  | "NINTH"
  | "TENTH";

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  dob: string;
  grade: Grade;
  fatherName: string;
  motherName: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // ✅ Initialize router

  const grades: Grade[] = [
    "NURSERY", "LKG", "UKG", "FIRST", "SECOND", "THIRD",
    "FOURTH", "FIFTH", "SIXTH", "SEVENTH", "EIGHTH", "NINTH", "TENTH",
  ];

  useEffect(() => {
    async function loadStudents() {
      try {
        const res = await fetch("/api/admin/student", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  const getStudentsByClass = (grade: Grade) =>
    students.filter((s) => s.grade === grade);

  const getCount = (grade: Grade) => getStudentsByClass(grade).length;

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading students...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Classes Overview
      </h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {grades.map((grade) => (
          <motion.div
            key={grade}
            whileHover={{ scale: 1.05 }}
            // ✅ Navigate to class route
            onClick={() => router.push(`/admin/student/${grade}`)}
            className="bg-white shadow-md rounded-2xl p-6 cursor-pointer border border-gray-200 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-700">{grade}</h2>
              <Users className="text-blue-500" size={24} />
            </div>
            <p className="text-gray-600 mt-4">
              Total Students:{" "}
              <span className="font-semibold">{getCount(grade)}</span>
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
