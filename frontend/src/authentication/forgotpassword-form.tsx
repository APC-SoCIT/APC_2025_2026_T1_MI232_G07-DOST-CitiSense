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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleAlert, EyeIcon, EyeOffIcon } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuth from "../hooks/useAuth";
import { AuthRouteProps } from "./auth.types";

//zod schema for login form validation
const forgotPasswordSchema = z
  .object({
    password1: z.string().min(8, "Password must be at least 8 characters"),
    password2: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords must match",
    path: ["password2"],
  });

//follow the schema of zod
export type ForgotPasswordProps = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({ route, ...props }: AuthRouteProps) {
  const [showPassword1, setShowPassword1] = React.useState(false);
  const [showPassword2, setShowPassword2] = React.useState(false);
  const navigate = useNavigate();
  const { Login, socialAuthError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ForgotPasswordProps>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordProps) => {
    try {
      //   await Login(data); //call the usecontext function
      navigate("/", { replace: true });
      console.log("hello world");
    } catch (error) {
      setError("root", { message: "Invalid credentials. Please try again." });
    }
  };

  return (
    <div
      className="flex flex-col gap-6 scale-80 -mt-10 2xl:mt-5 2xl:scale-100"
      {...props}
    >
      <Card className="">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription className="">
            Please enter your new password.
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label className="" htmlFor="password">
                      Password
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      className=""
                      {...register("password1")}
                      type={showPassword1 ? "text" : "password"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 py-5 hover:bg-transparent"
                      onClick={() => setShowPassword1((prev) => !prev)}
                    >
                      {showPassword1 ? (
                        <EyeIcon className="w-4 h-4" />
                      ) : (
                        <EyeOffIcon className="w-4 h-4" />
                      )}
                    </Button>
                    {errors.password1 && (
                      <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                        <CircleAlert className="w-4 h-4" />{" "}
                        {errors.password1.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label className="" htmlFor="password">
                      Re-enter password
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      className=""
                      {...register("password2")}
                      type={showPassword2 ? "text" : "password"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 py-5 hover:bg-transparent"
                      onClick={() => setShowPassword2((prev) => !prev)}
                    >
                      {showPassword2 ? (
                        <EyeIcon className="w-4 h-4" />
                      ) : (
                        <EyeOffIcon className="w-4 h-4" />
                      )}
                    </Button>
                    {errors.password2 && (
                      <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                        <CircleAlert className="w-4 h-4" />{" "}
                        {errors.password2.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="default"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Reset password
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
