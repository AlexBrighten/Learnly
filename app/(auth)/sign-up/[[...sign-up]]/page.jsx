import { SignUp } from "@clerk/nextjs";
import AuthRedirect from "@/components/user/AuthRedirect";

export default function Page() {
  return (
    <div className="h-screen flex justify-center items-center">
      <AuthRedirect>
        <SignUp />
      </AuthRedirect>
    </div>
  );
}
