import React from "react";
import AddStudentForm from "@/components/form/AddStudentForm";

const AddStudentPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Add New Student</h1>
      <AddStudentForm />
    </div>
  );
};

export default AddStudentPage;