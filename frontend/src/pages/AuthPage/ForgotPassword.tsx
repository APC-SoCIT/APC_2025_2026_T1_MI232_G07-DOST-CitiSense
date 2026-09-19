import { ForgotPasswordForm } from "../../components/auth/AuthenticationForms/forgotpassword-form";
import DOSTLogo from "../../components/auth/DOST-IRAD";

export default function ForgotPassword() {
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
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
