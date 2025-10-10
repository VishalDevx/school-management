import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ rollNumber: string }> } // 👈 params is a Promise now
) {
  const params = await context.params; // ✅ must await
  const session = await getServerSession(authOptions);

  // ✅ Check login
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Restrict access
  if (session.user.role === "STUDENT" && session.user.id !== params.rollNumber) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ✅ Fetch student
  const student = await db.student.findUnique({
    where: { rollNumber: params.rollNumber },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  return NextResponse.json(student);
}
