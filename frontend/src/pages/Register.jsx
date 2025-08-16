import { GalleryVerticalEnd } from "lucide-react";
import { RegisterForm } from "../components/register-form";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_5fr]">
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/blue1.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/login" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            QuadThink
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm route="/api/auth/register/" />
          </div>
        </div>
      </div>
    </div>
  );
}

// import RegisterForm from "../components/RegisterForm";

// function Register() {
//     return(
//         <main className="flex flex-col items-center">
//             <div className="mt-5 justify-center">
//                 <RegisterForm route="/api/auth/register/"/>
//             </div>
//         </main>
//     )

// }

// export default Register;
