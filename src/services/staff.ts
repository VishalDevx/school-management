import db from "@/db";
import { Grade, Gender } from "@prisma/client";

export interface StaffCreateInput {
  name: string;
  gender: Gender; // match Prisma enum
  dob: Date;
  phoneNumber: string;
  email: string;
  password: string;
  address: string;
  profilePic?: string;
  qualification?: string;
  subject: string;
  university?: string;
  classTeacherGrade?: Grade;
}

// Create Staff
export const createStaff = async (data: StaffCreateInput) => {
  const { classTeacherGrade, ...staffData } = data;

  const staff = await db.staff.create({
    data: staffData,
  });

  if (classTeacherGrade) {
    await db.classTeacher.create({
      data: {
        staffId: staff.id,
        grade: classTeacherGrade,
      },
    });
  }

  return staff;
};

// Update Staff
export const updateStaff = async (staffId: number, data: Partial<StaffCreateInput>) => {
  const { classTeacherGrade, ...staffData } = data;

  const staff = await db.staff.update({
    where: { id: staffId },
    data: staffData,
  });

  if (classTeacherGrade) {
    const existing = await db.classTeacher.findUnique({ where: { staffId } });
    if (existing) {
      await db.classTeacher.update({ where: { staffId }, data: { grade: classTeacherGrade } });
    } else {
      await db.classTeacher.create({ data: { staffId, grade: classTeacherGrade } });
    }
  }

  return staff;
};

// Get Staff with optional Class Teacher
export const getStaffByEmail = async (email:string) => {
  return db.staff.findUnique({
    where: { email },
    include: { classTeacher: true },
  });
};

// Get all staff
export const getAllStaff = async () => {
  return db.staff.findMany({ include: { classTeacher: true } });
};
