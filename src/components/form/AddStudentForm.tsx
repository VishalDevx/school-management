"use client";

import { useState } from "react";
import { Student } from "@/services/student";
import { Grade, Gender } from "@prisma/client";

type FormData = Omit<Student, "id" | "createdAt" | "dob"> & { dob: string };

interface AddStudentFormProps {
  onSuccess?: () => void;
}

export default function AddStudentForm({ onSuccess }: AddStudentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    fatherName: "",
    motherName: "",
    dob: "",
    grade: "NURSERY",
    gender: "MALE",
    address: "",
    rollNumber: "",
    bloodGroup: null,
    mobileNumber: null,
    profilePic: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const gradeOptions: Grade[] = [
    "NURSERY","LKG","UKG","FIRST","SECOND","THIRD",
    "FOURTH","FIFTH","SIXTH","SEVENTH","EIGHTH","NINTH","TENTH",
  ];

  const genderOptions: Gender[] = ["MALE","FEMALE","OTHERS"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === "" && (name === "bloodGroup" || name === "mobileNumber" || name === "profilePic")
        ? null
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload: Omit<Student, "id" | "createdAt"> = {
        ...formData,
        dob: new Date(formData.dob), // convert string to Date for backend
      };

      const res = await fetch("/api/admin/student/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage("✅ Student added successfully!");
        setFormData({
          name: "",
          fatherName: "",
          motherName: "",
          dob: "",
          grade: "NURSERY",
          gender: "MALE",
          address: "",
          rollNumber: "",
          bloodGroup: null,
          mobileNumber: null,
          profilePic: null,
        });
        onSuccess?.(); // call parent callback if provided
      } else {
        const errorData = await res.json();
        setMessage(`❌ Failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl p-8 rounded-3xl shadow-xl overflow-y-auto max-h-[90vh]">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Add New Student</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/** Student Name */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Student Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter student name"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>

          {/** Father's Name */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Father's Name</label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              placeholder="Enter father's name"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>

          {/** Mother's Name */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Mother's Name</label>
            <input
              type="text"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              placeholder="Enter mother's name"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>

          {/** DOB */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>

          {/** Grade */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Class / Grade</label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
            >
              {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/** Gender */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
            >
              {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/** Address */}
          <div className="md:col-span-2">
            <label className="block text-gray-600 font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>

          {/** Roll Number */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Roll Number</label>
            <input
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder="Enter roll number"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>

          {/** Blood Group */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Blood Group</label>
            <input
              type="text"
              name="bloodGroup"
              value={formData.bloodGroup || ""}
              onChange={handleChange}
              placeholder="Enter blood group"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>

          {/** Mobile Number */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber || ""}
              onChange={handleChange}
              placeholder="Enter mobile number"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>

          {/** Profile Picture */}
          <div className="md:col-span-2">
            <label className="block text-gray-600 font-medium mb-1">Profile Picture URL</label>
            <input
              type="text"
              name="profilePic"
              value={formData.profilePic || ""}
              onChange={handleChange}
              placeholder="Enter profile picture URL"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>

          {/** Submit Button */}
          <div className="md:col-span-2 text-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Student"}
            </button>
          </div>
        </form>

        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </div>
    </div>
  );
}
