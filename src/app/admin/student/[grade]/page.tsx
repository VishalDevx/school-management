"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type Grade =
  | "NURSERY" | "LKG" | "UKG" | "FIRST" | "SECOND" | "THIRD"
  | "FOURTH" | "FIFTH" | "SIXTH" | "SEVENTH" | "EIGHTH"
  | "NINTH" | "TENTH";

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  dob: string;
  grade: Grade;
  fatherName: string;
  motherName: string;
}

export default function ClassStudentsPage() {
  const router = useRouter();
  const { grade } = useParams() as { grade: Grade };
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudents() {
      try {
        const res = await fetch("/api/admin/student", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
        setStudents(data.filter((s: Student) => s.grade === grade));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, [grade]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading students...
      </div>
    );

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:underline"
      >
        <ArrowLeft size={18} /> Back to Classes
      </button>

      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        {grade} Students
      </h1>

      <div className="bg-white shadow-lg rounded-2xl p-6 overflow-x-auto">
        {students.length === 0 ? (
          <p className="text-center text-gray-500 py-6">
            No students in this class yet.
          </p>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-gray-700">
                <th className="text-left py-2">#</th>
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Roll No</th>
                <th className="text-left py-2">DOB</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr
                  key={s.id}
                  onClick={() => router.push(`/admin/student/${s.grade}/${s.rollNumber}`)} // ✅ Route by rollNumber
                  className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="py-2 font-medium text-gray-800">{i + 1}</td>
                  <td className="py-2 font-medium text-gray-800">{s.name}</td>
                  <td className="py-2 font-medium text-gray-800">{s.rollNumber}</td>
                  <td className="py-2 font-medium text-gray-800">{s.dob}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
