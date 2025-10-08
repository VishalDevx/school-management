import { NextResponse } from "next/server";
import { studentByRollNumber } from "@/services/student";

export async function GET(
  req: Request,
  { params }: { params: { rollNumber: string } }
) {
  try {
    const { rollNumber } = params;

    if (!rollNumber) {
      return NextResponse.json({ error: "Missing rollNumber" }, { status: 400 });
    }

    const student = await studentByRollNumber(rollNumber);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}
