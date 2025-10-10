"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Mail,
  UserCircle,
  School,
  Phone,
  GraduationCap,
  MapPin,
  BookOpen,
} from "lucide-react";

import { StaffCreateInput } from "@/services/staff";

 function StaffProfile() {
  const router = useRouter();
  const { email } = useParams() as { email: string };
  const [staff, setStaff] = useState<StaffCreateInput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStaff() {
      try {
        const res = await fetch(`/api/admin/staff/${email}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Staff not found");

        const data: StaffCreateInput = await res.json();
        setStaff(data);
      } catch (error) {
        console.error(error);
        setStaff(null);
      } finally {
        setLoading(false);
      }
    }

    fetchStaff();
  }, [email]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );

  if (!staff)
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-500">
        <p>No staff found with email: {email}</p>
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 p-8"
    >
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-blue-600 hover:underline mb-8"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
        <div className="flex flex-col items-center sm:items-start">
          <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-100 border-4 border-blue-100 shadow-inner">
            {staff.profilePic ? (
              <img
                src={staff.profilePic}
                alt={staff.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircle className="w-full h-full text-gray-300 p-8" />
            )}
          </div>

          <div className="mt-4 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-800">{staff.name}</h1>
            <p className="text-gray-500">{staff.subject}</p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InfoItem
            icon={<Mail className="text-blue-500" size={20} />}
            label="Email"
            value={staff.email}
          />
          <InfoItem
            icon={<Phone className="text-blue-500" size={20} />}
            label="Phone"
            value={staff.phoneNumber}
          />
          <InfoItem
            icon={<Calendar className="text-blue-500" size={20} />}
            label="Date of Birth"
            value={new Date(staff.dob).toLocaleDateString()}
          />
          <InfoItem
            icon={<School className="text-blue-500" size={20} />}
            label="Class Teacher"
            value={staff.classTeacherGrade ?? "-"}
          />
        </div>
      </div>

      {/* Details Section */}
      <div className="mt-10 space-y-10">
        {/* Academic Info */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Academic Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoItem
              icon={<GraduationCap className="text-blue-500" size={20} />}
              label="Qualification"
              value={staff.qualification}
            />
            <InfoItem
              icon={<BookOpen className="text-blue-500" size={20} />}
              label="Subject"
              value={staff.subject}
            />
            <InfoItem
              icon={<School className="text-blue-500" size={20} />}
              label="University"
              value={staff.university}
            />
          </div>
        </section>

        {/* Personal Info */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoItem
              icon={<MapPin className="text-blue-500" size={20} />}
              label="Address"
              value={staff.address}
            />
            <InfoItem
              icon={<UserCircle className="text-blue-500" size={20} />}
              label="Gender"
              value={staff.gender}
            />
          </div>
        </section>
      </div>
    </motion.div>
  );
}

function InfoItem({
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
      {icon}
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value || "-"}</p>
      </div>
    </div>
  );
}

export default StaffProfile