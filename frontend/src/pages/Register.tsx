import { GalleryVerticalEnd } from "lucide-react";
import { RegisterForm } from "../authentication/register-form";
import { Link } from "react-router-dom";

export default function RegisterPage() {
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
          <div className="flex items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            QuadThink
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
