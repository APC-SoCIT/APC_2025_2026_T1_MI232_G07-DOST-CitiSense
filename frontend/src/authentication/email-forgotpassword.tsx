import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ChevronLeft, CircleAlert } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import api from "../api";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

//zod schema for email verification for the forgot password form validation
const emailForgotPasswordSchema = z.object({
  email: z.email().min(1, "Please enter an email"),
});

//follow the schema of zod
export type EmailForgotPasswordProps = z.infer<
  typeof emailForgotPasswordSchema
>;

export function EmailForgotPasswordForm({ ...props }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<EmailForgotPasswordProps>({
    resolver: zodResolver(emailForgotPasswordSchema),
  });
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const ForgotPasswordSubmit = async (data: EmailForgotPasswordProps) => {
    try {
      await forgotPassword(data.email); //call the usecontext function
      console.log("email is sent");
      navigate("/email/forgotpassword/success");
    } catch (error) {
      // Handle specific Axios error
      if (axios.isAxiosError(error)) {
        setError("root", {
          message: error.response?.data.email || "Something went wrong.",
        });
      }
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[80vh] gap-4"
      {...props}
    >
      <Card className="w-full max-w-xl p-0 shadow-lg border border-border">
        <CardHeader className="text-center pb-2">
          {errors.root?.message && (
            <CardDescription className="text-left bg-red-100 text-red px-3 py-2 mb-3 rounded-lg text-red-600">
              {errors.root.message}
            </CardDescription>
          )}
          <CardTitle className="text-2xl mb-1 mt-4">
            Forgot your password?
          </CardTitle>
          <CardDescription className="">
            Please enter your email so that we can send you the password reset
            link.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit(ForgotPasswordSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className={undefined}>
                    Email
                  </Label>
                  <Input
                    {...register("email")}
                    type="email"
                    className="h-9 px-3 text-base"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center gap-1 -mt-4">
                    <CircleAlert className="w-4 h-4" /> {errors.email.message}
                  </p>
                )}
                <Button
                  type="submit"
                  variant="default"
                  className="w-full h-9 text-base bg-[#3949ab] hover:bg-[#5c6bc0] focus:bg-[#3949ab] text-white border-none"
                  disabled={isSubmitting}
                >
                  Send Email
                </Button>
              </div>
              <div className="flex flex-row justify-center text-center items-center text-sm mt-2">
                <a
                  href="/login"
                  className="flex flex-row items-center gap-1 justify-center underline underline-offset-4 mb-4"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Back to Login</span>
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
