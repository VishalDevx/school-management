"use client";

import { useEffect, useState } from "react";
import { Student } from "@/services/student";
import { Grade } from "@prisma/client";

interface StudentsByClassProps {
  grade: Grade;
}

export default function StudentsByClass({ grade }: StudentsByClassProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/student`);
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [grade]);

  return (
    <div>
      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students found in {grade}</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Roll No</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Father</th>
              <th className="border px-4 py-2">Mother</th>
              <th className="border px-4 py-2">DOB</th>
              <th className="border px-4 py-2">Gender</th>
              <th className="border px-4 py-2">Mobile</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td className="border px-4 py-2">{s.rollNumber}</td>
                <td className="border px-4 py-2">{s.name}</td>
                <td className="border px-4 py-2">{s.fatherName}</td>
                <td className="border px-4 py-2">{s.motherName}</td>
                <td className="border px-4 py-2">{new Date(s.dob).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{s.gender}</td>
                <td className="border px-4 py-2">{s.mobileNumber || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
