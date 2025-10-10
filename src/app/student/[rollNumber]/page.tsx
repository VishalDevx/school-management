import Protected from "@/components/Protecter";
import StudentProfilePage from "@/components/StudentProfile";


export default function StudentPage() {
  return (
    <Protected role="STUDENT">
      <StudentProfilePage />
    </Protected>
  );
}
