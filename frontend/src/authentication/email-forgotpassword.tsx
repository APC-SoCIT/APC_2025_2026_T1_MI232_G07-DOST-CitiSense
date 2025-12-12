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
      className="flex flex-col gap-6 scale-80 -mt-10 2xl:mt-5 2xl:scale-100"
      {...props}
    >
      {errors.root?.message && (
        <CardDescription className="text-left bg-red-100 text-red px-4 py-3 rounded-lg text-red-600">
          {errors.root.message}
        </CardDescription>
      )}
      <Card className="">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot your password?</CardTitle>
          <CardDescription className="">
            Please enter your email so that we can send you the password reset
            link.
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <form onSubmit={handleSubmit(ForgotPasswordSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label className="" htmlFor="email">
                    Email
                  </Label>
                  <Input className="" {...register("email")} type="email" />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center gap-1 -mt-4">
                    <CircleAlert className="w-4 h-4" /> {errors.email.message}
                  </p>
                )}
                <Button
                  type="submit"
                  variant="default"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Send Email
                </Button>
              </div>
            </div>
            <div className="flex flex-row justify-center text-center items-center text-sm pt-10">
              <a
                href="/login"
                className="flex flex-row items-center justify-center underline underline-offset-4"
              >
                {" "}
                <ChevronLeft className="w-5 h-5" />
                Back to Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
