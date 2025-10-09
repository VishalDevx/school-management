"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";
import AddStaffForm from "@/components/form/AddStaffForm";

interface Staff {
  id: string;
  name: string;
  gender: "MALE" | "FEMALE" | "OTHERS";
  dob: string;
  phoneNumber: string;
  email: string;
  address: string;
  subject: string;
  qualification?: string;
  university?: string;
  classTeacherGrade?: string; // optional
}

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const router = useRouter();

  // --- Fetch staff ---
  useEffect(() => {
    async function loadStaff() {
      try {
        const res = await fetch("/api/admin/staff", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch staff");
        const data = await res.json();
        setStaffList(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadStaff();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading staff...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Staff Overview</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Staff
        </button>
      </div>

      {/* Staff Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {staffList.map((staff) => (
          <motion.div
            key={staff.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push(`/admin/staff/${staff.email}`)}
            className="bg-white shadow-md rounded-2xl p-6 cursor-pointer border border-gray-200 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-700">{staff.name}</h2>
              <Users className="text-blue-500" size={24} />
            </div>
            <p className="text-gray-600 mt-4">
              Subject: <span className="font-semibold">{staff.subject}</span>
            </p>
            {staff.classTeacherGrade && (
              <p className="text-gray-600 mt-1">
                Class Teacher of: <span className="font-semibold">{staff.classTeacherGrade}</span>
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Add Staff Modal */}
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
                <h2 className="text-xl font-bold">Add New Staff</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700 font-bold"
                >
                  X
                </button>
              </div>
              <AddStaffForm
                onSuccess={() => {
                  setShowAddForm(false);
                  // reload staff after adding
                  fetch("/api/admin/staff/add", { cache: "no-store" })
                    .then((res) => res.json())
                    .then((data) => setStaffList(data));
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
