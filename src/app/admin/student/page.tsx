"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";
import AddStudentForm from "@/components/form/AddStudentForm";

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

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const router = useRouter();

  const grades: Grade[] = [
    "NURSERY","LKG","UKG","FIRST","SECOND","THIRD",
    "FOURTH","FIFTH","SIXTH","SEVENTH","EIGHTH","NINTH","TENTH",
  ];

  // --- Fetch students ---
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
    <div className="min-h-screen bg-gray-50 p-8 relative">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Classes Overview</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Student
        </button>
      </div>

      {/* Class Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {grades.map((grade) => (
          <motion.div
            key={grade}
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push(`/admin/student/${grade}`)}
            className="bg-white shadow-md rounded-2xl p-6 cursor-pointer border border-gray-200 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-700">{grade}</h2>
              <Users className="text-blue-500" size={24} />
            </div>
            <p className="text-gray-600 mt-4">
              Total Students: <span className="font-semibold">{getCount(grade)}</span>
            </p>
          </motion.div>
        ))}
      </div>

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add New Student</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700 font-bold"
                >
                  X
                </button>
              </div>
              <AddStudentForm
                onSuccess={() => {
                  setShowAddForm(false);
                  // reload students after adding
                  fetch("/api/admin/student", { cache: "no-store" })
                    .then((res) => res.json())
                    .then((data) => setStudents(data));
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
