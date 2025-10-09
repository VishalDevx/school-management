import { getStaffByEmail } from "@/services/staff";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}:{params:{email:string}}) {
    
    try {
        const {email} = params;
       
           if (!email) {
             return NextResponse.json({ error: "Missing rollNumber" }, { status: 400 });
           }

           const staff = await getStaffByEmail(email)
             if (!staff) {
                 return NextResponse.json({ error: "Student not found" }, { status: 404 });
               }
                return NextResponse.json(staff, { status: 200 });
           
    } catch (error) {
        console.error("Error fetching staff:", error);
    return NextResponse.json(
      { error: "Failed to fetch staff" },
      { status: 500 }
    );
    }
}