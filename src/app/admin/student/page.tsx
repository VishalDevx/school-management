"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Users } from "lucide-react";

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
  rollNo: string;
  dob: string;
  grade: Grade;
  fatherName: string;
  motherName: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState<Grade | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const grades: Grade[] = [
    "NURSERY", "LKG", "UKG", "FIRST", "SECOND", "THIRD",
    "FOURTH", "FIFTH", "SIXTH", "SEVENTH", "EIGHTH", "NINTH", "TENTH",
  ];

  // --- Fetch all students from your Next.js API route ---
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

  // --- Helpers ---
  const getStudentsByClass = (grade: Grade) =>
    students.filter((s) => s.grade === grade);

  const getCount = (grade: Grade) => getStudentsByClass(grade).length;

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading students...
      </div>
    );

  // ------------------ STUDENT PROFILE ------------------
  if (selectedStudent) {
    return (
      <div className="p-8 min-h-screen bg-gray-50">
        <button
          onClick={() => setSelectedStudent(null)}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} /> Back to {selectedClass}
        </button>

        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {selectedStudent.name}'s Profile
          </h2>

          <div className="space-y-3 text-gray-700">
            <p>
              <span className="font-semibold">Roll No:</span>{" "}
              {selectedStudent.rollNo}
            </p>
            <p>
              <span className="font-semibold">Class:</span>{" "}
              {selectedStudent.grade}
            </p>
            <p>
              <span className="font-semibold">Date of Birth:</span>{" "}
              {selectedStudent.dob}
            </p>
            <p>
              <span className="font-semibold">Father’s Name:</span>{" "}
              {selectedStudent.fatherName}
            </p>
            <p>
              <span className="font-semibold">Mother’s Name:</span>{" "}
              {selectedStudent.motherName}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ------------------ STUDENT LIST FOR SELECTED CLASS ------------------
  if (selectedClass) {
    const classStudents = getStudentsByClass(selectedClass);

    return (
      <div className="p-8 min-h-screen bg-gray-50">
        <button
          onClick={() => setSelectedClass(null)}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} /> Back to Classes
        </button>

        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          {selectedClass} Students
        </h1>

        <div className="bg-white shadow-lg rounded-2xl p-6 overflow-x-auto">
          {classStudents.length === 0 ? (
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
                {classStudents.map((s, i) => (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedStudent(s)}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="py-2">{i + 1}</td>
                    <td className="py-2 font-medium text-gray-800">{s.name}</td>
                    <td className="py-2">{s.rollNo}</td>
                    <td className="py-2">{s.dob}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  // ------------------ CLASS GRID ------------------
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
            onClick={() => setSelectedClass(grade)}
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
