import { GalleryVerticalEnd } from "lucide-react";
import { EmailForgotPasswordForm } from "../authentication/email-forgotpassword";

export default function EmailForgotPassword() {
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
          background: "linear-gradient(20deg, #b4d4ebff 0%, #6b8cceff 100%)",
        }}
      >
        <div className="flex w-full max-w-sm flex-col gap-6">
          <EmailForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
