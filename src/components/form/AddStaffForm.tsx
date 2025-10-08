"use client";

import { useState } from "react";
import { Grade, Gender } from "@prisma/client";
import { StaffCreateInput } from "@/services/staff";

type FormData = Omit<StaffCreateInput, "id" | "createdAt" | "dob"> & { dob: string };

interface AddStaffFormProps {
  onSuccess?: () => void;
}

export default function AddStaffForm({ onSuccess }: AddStaffFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    gender: Gender.MALE, // ✅ Use enum value
    dob: "",
    phoneNumber: "",
    email: "",
    password: "",
    address: "",
    profilePic: "",
    qualification: "",
    subject: "",
    university: "",
    classTeacherGrade: undefined, // ✅ undefined for optional Grade
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add staff");
      }

      if (onSuccess) onSuccess();

      // Reset form safely
      setFormData({
        name: "",
        gender: Gender.MALE,
        dob: "",
        phoneNumber: "",
        email: "",
        password: "",
        address: "",
        profilePic: "",
        qualification: "",
        subject: "",
        university: "",
        classTeacherGrade: undefined,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-xl shadow-md">
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Name" value={formData.name} onChange={(v) => handleChange("name", v)} />
        <Select
          label="Gender"
          value={formData.gender}
          options={Object.values(Gender)}
          onChange={(v) => handleChange("gender", v as Gender)}
        />
        <Input label="Date of Birth" type="date" value={formData.dob} onChange={(v) => handleChange("dob", v)} />
        <Input label="Phone Number" value={formData.phoneNumber} onChange={(v) => handleChange("phoneNumber", v)} />
        <Input label="Email" type="email" value={formData.email} onChange={(v) => handleChange("email", v)} />
        <Input label="Password" type="password" value={formData.password} onChange={(v) => handleChange("password", v)} />
        <Input label="Address" value={formData.address} onChange={(v) => handleChange("address", v)} />
        <Input label="Profile Picture URL" value={formData.profilePic || ""} onChange={(v) => handleChange("profilePic", v)} />
        <Input label="Qualification" value={formData.qualification || ""} onChange={(v) => handleChange("qualification", v)} />
        <Input label="Subject" value={formData.subject} onChange={(v) => handleChange("subject", v)} />
        <Input label="University" value={formData.university || ""} onChange={(v) => handleChange("university", v)} />
        <Select
          label="Class Teacher Grade"
          value={formData.classTeacherGrade ?? ""}
          options={["", ...Object.values(Grade)]}
          onChange={(v) => handleChange("classTeacherGrade", v === "" ? undefined : (v as Grade))}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? "Adding..." : "Add Staff"}
      </button>
    </form>
  );
}

// --- Helper Components ---
interface InputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
}

function Input({ label, value, onChange, type = "text" }: InputProps) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-200"
      />
    </div>
  );
}

interface SelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}

function Select({ label, value, options, onChange }: SelectProps) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-200"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt || "None"}
          </option>
        ))}
      </select>
    </div>
  );
}
