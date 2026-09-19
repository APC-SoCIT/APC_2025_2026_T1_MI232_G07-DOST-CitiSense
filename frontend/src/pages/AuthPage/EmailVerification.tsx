import { EmailVerificationSent } from "../../components/auth/AuthenticationForms/email-verification";
import DOSTLogo from "../../components/auth/DOST-IRAD";

export default function EmailVerification() {
  return (
    <div className="relative h-svh flex flex-col items-center justify-center p-6 md:p-10 bg-white">
      <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
        <DOSTLogo />
      </div>

      <div className="relative z-10 flex w-full max-w-sm flex-col gap-6">
        <EmailVerificationSent />
      </div>
    </div>
  );
}
