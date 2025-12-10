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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, CircleAlert } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuth from "../hooks/useAuth";
import { AuthRouteProps } from "./auth.types";
import axios from "axios";

//zod schema for email verification for the forgot password form validation
const emailForgotPasswordSchema = z.object({
  email: z.email().min(1),
});

//follow the schema of zod
export type EmailForgotPasswordProps = z.infer<
  typeof emailForgotPasswordSchema
>;

export function EmailForgotPasswordForm({ route, ...props }: AuthRouteProps) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<EmailForgotPasswordProps>({
    resolver: zodResolver(emailForgotPasswordSchema),
  });

  const onSubmit = async (email: EmailForgotPasswordProps) => {
    try {
      // await EmailForgotPassword(email); //call the usecontext function
      navigate("/", { replace: true });
      console.log("hello world");
    } catch (error) {
      // Handle specific Axios error
      if (axios.isAxiosError(error)) {
        setError("email", { message: error.response?.data.email });
      }
    }
  };

  return (
    <div
      className="flex flex-col gap-6 scale-80 -mt-10 2xl:mt-5 2xl:scale-100"
      {...props}
    >
      <Card className="">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot your password?</CardTitle>
          <CardDescription className="">
            Please enter your email so that we can send you the password reset
            link.
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label className="" htmlFor="email">
                    Email
                  </Label>
                  <Input className="" {...register("email")} type="email" />
                </div>
                <Button
                  type="submit"
                  variant="default"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Send Email
                </Button>
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                    <CircleAlert className="w-4 h-4" /> {errors.email.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-row justify-center text-center items-center text-sm pt-10">
              <div className="pr-1">
                {" "}
                <ChevronLeft className="w-5 h-5" />
              </div>

              <a href="/login" className="underline underline-offset-4">
                Back to Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
