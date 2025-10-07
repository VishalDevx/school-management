import { NextRequest, NextResponse } from "next/server";
import { createStudent } from "@/services/student";
import { Prisma, Gender, Grade } from "@prisma/client"; // ✅ Import Prisma types & enums

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ✅ Type-safe input construction
    const data: Prisma.StudentCreateInput = {
      name: body.name,
      fatherName: body.fatherName,
      motherName: body.motherName,
      gender: body.gender as Gender, // Prisma enums: "MALE", "FEMALE", etc.
      grade: body.grade as Grade,
      dob: new Date(body.dob),
      address: body.address,
      rollNumber: body.rollNumber,
      profilePic: body.profilePic ?? null,
      bloodGroup: body.bloodGroup ?? null,
      mobileNumber: body.mobileNumber ?? null,
    };

    const newStudent = await createStudent(data);

    return NextResponse.json({ success: true, student: newStudent });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create student" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, message: "GET method not allowed" },
    { status: 405 }
  );
}
