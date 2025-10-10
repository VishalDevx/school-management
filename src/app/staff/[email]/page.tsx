import Protected from "@/components/Protecter";
import StaffProfile from "@/components/StaffProfile";

export default function StaffProfilePage(){
   <Protected role="STAFF">
        <StaffProfile />
      </Protected>
}