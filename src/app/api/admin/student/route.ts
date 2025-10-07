import { NextResponse } from "next/server";
import { allStudent } from "@/services/student"; // your service

export async function GET() {
  try {
    const students = await allStudent();
    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching all students:", error);
    return NextResponse.json(
      { error: "Failed to fetch all students" },
      { status: 500 }
    );
  }
}
