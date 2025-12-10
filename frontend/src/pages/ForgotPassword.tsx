import { GalleryVerticalEnd } from "lucide-react";
import { ForgotPasswordForm } from "../authentication/forgotpassword-form";

export default function ForgotPassword() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <ForgotPasswordForm route="/api/auth/token/" />
      </div>
    </div>
  );
}
