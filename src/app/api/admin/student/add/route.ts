import { NextRequest, NextResponse } from 'next/server';
import { createStudent } from '@/services/student';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const student = await createStudent(data);
    return NextResponse.json(student, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}
