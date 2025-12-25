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
import api from "../api";
import { useParams } from "react-router-dom";
import axios from "axios";

//zod schema for login form validation
const forgotPasswordSchema = z
  .object({
    new_password1: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number"),

    new_password2: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number"),
  })
  .refine((data) => data.new_password1 === data.new_password2, {
    message: "Passwords must match",
    path: ["new_password2"],
  });

//follow the schema of zod
export type ForgotPasswordProps = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({ ...props }) {
  const [showPassword1, setShowPassword1] = React.useState(false);
  const [showPassword2, setShowPassword2] = React.useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
    trigger,
  } = useForm<ForgotPasswordProps>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const { uid, token } = useParams();
  const onSubmit = async (data: ForgotPasswordProps) => {
    try {
      // Get the user from the url; used to automatically login the user after a successfull password reset
      const params = new URLSearchParams(window.location.search);
      const user = params.get("user");
      if (!user) return;

      // Reference for the dynamic url route: https://stackoverflow.com/a/60998589
      const payload = {
        uid: uid,
        token: token,
        new_password1: data.new_password1,
        new_password2: data.new_password2,
      };

      await api.post(
        `api/auth/password/reset/confirm/${uid}/${token}/`,
        payload
      );

      // Wait for 2 seconds before redirecting
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        console.log(data);
        if (data.new_password1) {
          setError("new_password1", {
            message: data.new_password1,
          });
        }
        if (data.new_password2) {
          setError("new_password2", {
            message: data.new_password2,
          });
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center" {...props}>
      {/* DOST Institutional Header */}
      <div className="flex flex-col items-center gap-2 mb-2">
        <div className="flex items-center gap-3">
          <div className="bg-[#0038A8] p-2 rounded-lg shadow-md">
            <CircleAlert className="w-8 h-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-xl font-bold leading-tight text-[#0038A8]">
              DOST - IRAD
            </h1>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
              Sentiment Analysis Platform
            </p>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex min-h-[60vh] items-start justify-center pt-4 pb-2 bg-slate-50/50"
        )}
      >
        <Card className="w-full max-w-2xl shadow-xl border-t-4 border-t-[#0038a8] bg-white">
          <CardHeader className="space-y-2 pb-6 pt-8">
            <CardTitle className="text-2xl font-bold tracking-tight text-center text-[#1e293b]">
              Reset your password
            </CardTitle>
            <CardDescription className="text-center text-slate-500 text-base">
              Please enter your new password.
            </CardDescription>
            {isSubmitSuccessful && (
              <div className="text-green-700 bg-green-100 px-4 py-2 rounded text-center mt-2">
                Password reset successful! Redirecting you to login...
              </div>
            )}
          </CardHeader>
          <CardContent className="grid gap-3 px-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              <div className="grid gap-1">
                <Label
                  htmlFor="new_password1"
                  className="text-xs font-semibold text-slate-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="new_password1"
                    type={showPassword1 ? "text" : "password"}
                    {...register("new_password1")}
                    className={cn(
                      "h-10 pr-10 bg-slate-50 border-slate-200 text-sm",
                      errors.new_password1 &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword1((prev) => !prev)}
                  >
                    {showPassword1 ? (
                      <EyeIcon className="h-4 w-4" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p
                  className={cn(
                    "text-destructive text-xs font-medium flex items-center gap-1.5 min-h-[1.5em]",
                    !errors.new_password1 && "invisible"
                  )}
                >
                  <CircleAlert className="w-3.5 h-3.5" />
                  {errors.new_password1?.message || "placeholder"}
                </p>
              </div>
              <div className="grid gap-1">
                <Label
                  htmlFor="new_password2"
                  className="text-xs font-semibold text-slate-700"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="new_password2"
                    type={showPassword2 ? "text" : "password"}
                    {...register("new_password2")}
                    onBlur={() => trigger("new_password2")}
                    className={cn(
                      "h-10 pr-10 bg-slate-50 border-slate-200 text-sm",
                      errors.new_password2 &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword2((prev) => !prev)}
                  >
                    {showPassword2 ? (
                      <EyeIcon className="h-4 w-4" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p
                  className={cn(
                    "text-destructive text-xs font-medium flex items-center gap-1.5 min-h-[1.5em]",
                    !errors.new_password2 && "invisible"
                  )}
                >
                  <CircleAlert className="w-3.5 h-3.5" />
                  {errors.new_password2?.message || "placeholder"}
                </p>
              </div>
              <div className="col-span-1 md:col-span-2 mt-2">
                <Button
                  type="submit"
                  variant="bluedefault"
                  className="w-full h-11 bg-[#0038a8] hover:bg-[#002d86] text-white font-bold transition-colors"
                  disabled={isSubmitting}
                >
                  Reset password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
