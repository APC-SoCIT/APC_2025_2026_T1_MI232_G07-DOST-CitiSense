import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleAlert, EyeIcon, EyeOffIcon } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../../api";
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
        payload,
      );

      // Wait for 2 seconds before redirecting
      setTimeout(() => {
        navigate("/login", { replace: true });
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
    <div
      className="flex flex-col gap-6 scale-80 -mt-10 2xl:mt-5 2xl:scale-100"
      {...props}
    >
      {isSubmitSuccessful && (
        <CardDescription className="text-left bg-green-100 text-red px-4 py-3 rounded-lg text-black-600">
          Password reset successfull! Redirecting you to login...
        </CardDescription>
      )}
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
                      {...register("new_password1")}
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
                    {errors.new_password1 && (
                      <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                        <CircleAlert className="w-4 h-4" />{" "}
                        {errors.new_password1.message}
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
                      {...register("new_password2")}
                      type={showPassword2 ? "text" : "password"}
                      onBlur={() => trigger("new_password2")}
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
                    {errors.new_password2 && (
                      <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                        <CircleAlert className="w-4 h-4" />{" "}
                        {errors.new_password2.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="default"
                  className="w-full h-9 text-base bg-[#3949ab] hover:bg-[#5c6bc0] focus:bg-[#3949ab] text-white border-none"
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
