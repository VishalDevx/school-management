import { NextRequest, NextResponse } from "next/server";
import { createStaff } from "@/services/staff";
import { Gender, Grade } from "@prisma/client"; // enums

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ✅ Convert dob to Date before sending to service
    const staffData = {
      name: body.name,
      gender: body.gender as Gender,
      dob: new Date(body.dob), // <-- ensure Date type
      phoneNumber: body.phoneNumber,
      email: body.email,
      password: body.password,
      address: body.address,
      profilePic: body.profilePic ?? null,
      qualification: body.qualification ?? null,
      subject: body.subject,
      university: body.university ?? null,
      classTeacherGrade: body.classTeacherGrade as Grade | undefined,
    };

    const newStaff = await createStaff(staffData);

    return NextResponse.json({ success: true, staff: newStaff });
  } catch (error) {
    console.error("Error creating staff:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create staff" },
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
