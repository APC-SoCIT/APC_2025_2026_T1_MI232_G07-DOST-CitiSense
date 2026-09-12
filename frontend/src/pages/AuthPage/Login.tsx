import { CircleUserRound } from "lucide-react";
import { LoginForm1 } from "../../components/auth/AuthenticationForms/login-form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import DOSTLogo from "../../components/auth/DOST-IRAD";

export default function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-svh">
      <div className="hidden md:flex flex-col justify-center items-center text-primary-foreground w-80 p-8 bg-[#00aeef]">
        <span className="text-4xl font-bold text-center">
          Department of Science and Technology
        </span>
      </div>

      <div
        className="flex flex-1 flex-col items-center justify-center gap-6 p-6 md:p-10"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="flex w-full max-w-sm flex-col gap-6">
          <DOSTLogo />
          <LoginForm1 />
          <div className="md:hidden flex flex-col">
            <Button
              variant="outline"
              className="h-9 text-base flex items-center justify-center gap-2 bg-[#00aeef] text-white hover:bg-[#00aeef] border-[#00aeef]"
              onClick={() => navigate("/guest-dashboard")}
              type="button"
            >
              <CircleUserRound />
              Access as guest
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden md:flex fixed top-6 right-6 z-50">
        <Button
          variant="outline"
          className="h-9 text-base flex items-center justify-center gap-2 bg-[#00aeef] text-white hover:bg-[#00aeef] border-[#00aeef]"
          onClick={() => navigate("/guest-dashboard")}
          type="button"
        >
          <CircleUserRound />
          Access as guest
        </Button>
      </div>
    </div>
  );
}
