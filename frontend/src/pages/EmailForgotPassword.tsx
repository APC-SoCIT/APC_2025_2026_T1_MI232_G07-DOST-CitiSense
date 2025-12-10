import { GalleryVerticalEnd } from "lucide-react";
import { EmailForgotPasswordForm } from "../authentication/email-forgotpassword";

export default function EmailForgotPassword() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <EmailForgotPasswordForm route="/api/auth/token/" />
      </div>
    </div>
  );
}
