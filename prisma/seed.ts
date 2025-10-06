import db from "@/db";
import bcrypt from "bcrypt";

async function main() {
  // Create a staff
  const staffPassword = await bcrypt.hash("staff1234", 10);
  await db.staff.create({
    data: {
      name: "John Doe",
      email: "staff@example.com",
      password: staffPassword,
      subject: "Math",
      qualification: "MSc",
    },
  });

  // Create a student
  await db.student.create({
    data: {
      name: "Jane Smith",
      fatherName: "Robert Smith",
      motherName: "Laura Smith",
      dob: new Date("2010-05-12"),
      class: "FIFTH",
      gender: "Female",
      address: "123 Street, City",
      rollNo: "STU001",
    },
  });

  // Optionally, create admin
  const adminPassword = await bcrypt.hash("admin1234", 10);
  await db.admin.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
    },
  });
}

main()
  .then(() => {
    console.log("Seed completed");
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await db.$disconnect();
  });
