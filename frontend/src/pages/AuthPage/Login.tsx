import { CircleUserRound, ShieldCheck } from "lucide-react";
import { LoginForm1 } from "../../components/auth/AuthenticationForms/login-form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-svh">
      {/* Side Panel */}
      <div className="hidden md:flex flex-col justify-center items-center text-primary-foreground w-80 p-8 bg-[#3949ab]">
        <span className="text-4xl font-bold text-center">
          Department of Science and Technology
        </span>
      </div>
      {/* Main Content */}
      <div
        className="flex flex-1 flex-col items-center justify-center gap-6 p-6 md:p-10"
        style={{
          background: "linear-gradient(20deg, #c4d9e8ff 0%, #6b8cceff 100%)",
        }}
      >
        <div className="flex w-full max-w-sm flex-col gap-6">
          {/* BRANDING */}
          <div className="flex items-center gap-2 my-5 self-center font-medium">
            <div className="bg-[#0038A8] text-white p-2 rounded-lg shadow-md">
              <ShieldCheck className="size-5" />
            </div>

            <div className="flex flex-col border-l border-slate-300 pl-3">
              <span className="text-sm font-bold text-slate-900 tracking-tighter leading-none">
                DOST-IRAD
              </span>
              <span className="text-[11px] font-medium text-[#0038A8] uppercase tracking-widest">
                QuadThink
              </span>
            </div>
          </div>
          <LoginForm1 />{" "}
          <div className="md:hidden flex flex-col">
            <Button
              variant="outline"
              className="h-9 text-base flex items-center justify-center gap-2"
              onClick={() => navigate("/guest-dashboard")}
              type="button"
            >
              <CircleUserRound />
              Access as guest{" "}
            </Button>{" "}
          </div>
        </div>
      </div>
      <div className="hidden md:flex fixed top-6 right-6 z-50">
        {" "}
        <Button
          variant="outline"
          className="h-9 text-base flex items-center justify-center gap-2"
          onClick={() => navigate("/guest-dashboard")}
          type="button"
        >
          <CircleUserRound />
          Access as guest{" "}
        </Button>{" "}
      </div>
    </div>
  );
}
