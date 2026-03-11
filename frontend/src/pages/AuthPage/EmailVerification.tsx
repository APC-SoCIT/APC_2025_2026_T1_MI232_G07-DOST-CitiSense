import { ShieldCheck, Database } from "lucide-react";
import { EmailVerificationSent } from "../../components/auth/AuthenticationForms/email-verification";

export default function EmailVerification() {
  return (
    <div className="relative h-svh flex flex-col items-center justify-center p-6 md:p-10 bg-[#f8fafc]">
      {/* DOST IRAD TECHNICAL BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* SVG Technical Grid/Circuit Pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%230038A8' stroke-width='0.5'%3E%3Cpath d='M10 10h60v60H10z'/%3E%3Cpath d='M0 40h80M40 0v80'/%3E%3Ccircle cx='40' cy='40' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full bg-[#0038A8]/5 blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] rounded-full bg-sky-500/5 blur-[120px] translate-y-1/2 -translate-x-1/4" />
      </div>

      {/* TOP LEFT BRANDING */}
      <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
        <div className="bg-[#0038A8] text-white p-2 rounded-lg shadow-md">
          <ShieldCheck className="size-5" />
        </div>
        <div className="flex flex-col border-l border-slate-300 pl-3">
          <span className="text-sm font-bold text-slate-900 tracking-tighter leading-none">
            DOST-IRAD
          </span>
          <span className="text-[10px] font-medium text-[#0038A8] uppercase tracking-widest">
            QuadThink
          </span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex w-full max-w-sm flex-col gap-6">
        {/* The EmailVerificationSent Component */}
        <EmailVerificationSent />
      </div>
    </div>
  );
}
