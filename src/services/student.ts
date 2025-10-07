import db from "@/db";
import { Prisma, Gender, Grade } from "@prisma/client"; // ✅ Only use @prisma/client enums


// ---------- INTERFACE ----------
export interface Student {
  id: number;
  name: string;
  fatherName: string;
  motherName: string;
  gender: Gender;          // enum from Prisma
  grade: Grade;            // enum from Prisma
  dob: Date;               // stored as Date in Prisma
  address: string;
  profilePic?: string | null;     // ✅ allow null (Prisma returns null)
  rollNumber: string;
  bloodGroup?: string | null;     // ✅ allow null
  mobileNumber?: string | null;   // ✅ allow null
  createdAt: Date;

  // Relations — optional since not always fetched
  studentFees?: unknown[];      // StudentFee[]
  feeHistory?: unknown[];       // FeeHistory[]
  payments?: unknown[];         // Payment[]
  receipts?: unknown[];         // PaymentReceipt[]
  results?: unknown[];          // Result[]
}

// ---------- CREATE STUDENT ----------
export const createStudent = async (
  data: Prisma.StudentCreateInput
): Promise<Student> => {
  try {
    const newStudent = await db.student.create({ data });
    return newStudent;
  } catch (error) {
    console.error("Error creating student:", error);
    throw new Error("Failed to create student");
  }
};

//----------GET ALL STUDENTS----------------

export const allStudent = async (): Promise<Student[]> => {
  try {
    const students = await db.student.findMany();
    return students; // returns an array of students
  } catch (error) {
    console.error("Error in fetching the students:", error);
    throw new Error("Failed to fetch all students");
  }
};
// ---------- GET STUDENT BY ROLL NUMBER ----------
export const studentByRollNumber = async (
  rollNumber: string
): Promise<Student | null> => {
  try {
    const student = await db.student.findUnique({
      where: { rollNumber },
    });
    return student;
  } catch (error) {
    console.error("Error fetching student by roll number:", error);
    throw new Error("Failed to fetch student by roll number");
  }
};

// ---------- UPDATE STUDENT ----------
export const updateStudent = async (
  rollNumber: string,
  data: Prisma.StudentUpdateInput
): Promise<Student> => {
  try {
    const student = await db.student.update({
      where: { rollNumber },
      data,
    });
    return student;
  } catch (error) {
    console.error("Error updating student:", error);
    throw new Error("Failed to update student");
  }
};
