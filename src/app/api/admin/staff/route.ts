import { NextRequest, NextResponse } from "next/server";

import { getAllStaff } from "@/services/staff";

export async function GET() {
  try {
    const staff = await getAllStaff();
    return NextResponse.json(staff);
  } catch (error) {
    console.error("Error fetching all students:", error);
    return NextResponse.json(
      { error: "Failed to fetch all students" },
      { status: 500 }
    );
  }
}
export async function POST(req:NextRequest) {
  
  
}
