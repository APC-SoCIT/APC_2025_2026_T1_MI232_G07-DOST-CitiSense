import { Button } from "../../ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Link, useNavigate } from "react-router-dom";
import { CircleAlert, EyeIcon, EyeOffIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import TermsAndConditionsPopup from "./TermsAndConditionsPopup";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Checkbox } from "@/components/ui/checkbox";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

//zod schema for the form validation
const signUpSchema = z
  .object({
    username: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.email({
      pattern: new RegExp(import.meta.env.VITE_EMAIL_REGEX, "i"),
      message: "Input an email with the correct domain name.",
    }),

    password1: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number"),

    password2: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number"),
  })
  //checks if password1 and password2 matches
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords must match",
    path: ["password2"],
  });

//follow the schema of the zod
export type SignUpFieldProps = z.infer<typeof signUpSchema>;

export function RegisterForm({ ...props }) {
  // State to control if the user has agreed to the terms
  const [agreed, setAgreed] = useState(false);
  //for showing password
  const [showPassword1, setShowPassword1] = React.useState(false);
  const [showPassword2, setShowPassword2] = React.useState(false);
  const [showTooltip1, setShowTooltip1] = useState(false);
  const [showTooltip2, setShowTooltip2] = useState(false);

  const navigate = useNavigate();
  const { Register } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    trigger,
    watch,
  } = useForm<SignUpFieldProps>({
    //hook up the zod schema to react hook form, outsource validation to zod
    resolver: zodResolver(signUpSchema),
  });

  const password = watch("password1");
  const passwordHas8Characters = password?.length >= 8;
  const passwordHasANumber = /[0-9]/.test(password);
  const passwordHasAnUpperCase = /[A-Z]/.test(password);

  const onSubmit = async (data: SignUpFieldProps) => {
    try {
      await Register(data);
      await navigate("/email/verification");
    } catch (error) {
      // Handle specific Axios error
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        if (error.response?.data?.username) {
          setError("username", { message: error.response.data.username });
        }
        if (error.response?.data.email) {
          setError("email", { message: error.response.data.email });
        }
        if (error.response?.data.password1) {
          setError("password1", {
            message: error.response?.data.password1,
          });
        }
        if (error.response?.data.password2) {
          setError("password2", {
            message: error.response?.data.password2,
          });
        }
      }
    }
  };

  return (
    <>
      {/* Show Terms and Conditions popup before registration form */}
      <TermsAndConditionsPopup
        open={!agreed}
        onClose={() => {
          // Redirect to login when cancel is clicked
          navigate("/login");
        }}
        onAgree={() => setAgreed(true)}
      />
      {agreed && (
        <div
          className="flex flex-col items-center justify-center min-h-[80vh] gap-4"
          {...props}
        >
          <Card className="w-full max-w-3xl p-0 shadow-lg border border-border">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl mt-4">
                Register an account
              </CardTitle>
              <CardDescription className="">
                Enter your credentials to register an account
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                  <div className="flex gap-4">
                    <div className="flex-1 grid gap-2">
                      <Label htmlFor="first_name" className={undefined}>
                        First Name
                      </Label>
                      <Input
                        {...register("first_name")}
                        id="first_name"
                        type="text"
                        className="h-9 px-3 text-base"
                      />
                      {errors.first_name && (
                        <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                          <CircleAlert className="w-4 h-4" />{" "}
                          {errors.first_name.message}
                        </p>
                      )}
                    </div>
                    <div className="flex-1 grid gap-2">
                      <Label htmlFor="last_name" className={undefined}>
                        Last Name
                      </Label>
                      <Input
                        {...register("last_name")}
                        id="last_name"
                        type="text"
                        className="h-9 px-3 text-base"
                      />
                      {errors.last_name && (
                        <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                          <CircleAlert className="w-4 h-4" />{" "}
                          {errors.last_name.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username" className={undefined}>
                      Username
                    </Label>
                    <Input
                      {...register("username")}
                      id="username"
                      type="text"
                      className="h-9 px-3 text-base"
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                        <CircleAlert className="w-4 h-4" />{" "}
                        {errors.username.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className={undefined}>
                      Email
                    </Label>
                    <Input
                      {...register("email")}
                      type="email"
                      className="h-9 px-3 text-base"
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <CircleAlert className="w-4 h-4" />{" "}
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password1" className={undefined}>
                        Password
                      </Label>
                    </div>

                    <TooltipProvider>
                      <Tooltip open={showTooltip1}>
                        <TooltipTrigger asChild>
                          <div
                            onFocus={() => setShowTooltip1(true)}
                            onMouseLeave={() => setShowTooltip1(false)}
                            onMouseEnter={() => setShowTooltip1(true)}
                          >
                            {" "}
                            <div className="relative h-12 flex items-center">
                              <Input
                                {...register("password1")}
                                type={showPassword1 ? "text" : "password"}
                                className="h-9 px-3 text-base pr-10"
                                onBlur={() => trigger("password2")}
                                placeholder=""
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-0 h-6 w-6 hover:bg-transparent"
                                onClick={() =>
                                  setShowPassword1((prev) => !prev)
                                }
                                tabIndex={-1}
                              >
                                {showPassword1 ? (
                                  <EyeIcon className="w-4 h-4" />
                                ) : (
                                  <EyeOffIcon className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          sideOffset={8}
                          className="bg-white text-black border shadow-lg rounded-md p-3 w-64"
                        >
                          {" "}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Checkbox checked={passwordHas8Characters} />
                              <span>At least 8 characters</span>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <Checkbox checked={passwordHasANumber} />
                              <span>Must include a number</span>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <Checkbox checked={passwordHasAnUpperCase} />
                              <span>Must include a capital letter</span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {errors.password1 && (
                      <p className="text-red-500 text-sm flex items-center gap-1 ">
                        <CircleAlert className="w-4 h-4" />{" "}
                        {errors.password1.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password2" className={undefined}>
                        Confirm Password
                      </Label>
                    </div>

                    <TooltipProvider>
                      <Tooltip open={showTooltip2}>
                        <TooltipTrigger asChild>
                          <div
                            onFocus={() => setShowTooltip2(true)}
                            onMouseLeave={() => setShowTooltip2(false)}
                            onMouseEnter={() => setShowTooltip2(true)}
                          >
                            <div className="relative h-12 flex items-center">
                              <Input
                                {...register("password2")}
                                type={showPassword2 ? "text" : "password"}
                                className="h-9 px-3 text-base pr-10"
                                onBlur={() => trigger("password2")}
                                placeholder=""
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-0 h-6 w-6 hover:bg-transparent"
                                onClick={() =>
                                  setShowPassword2((prev) => !prev)
                                }
                                tabIndex={-1}
                              >
                                {showPassword2 ? (
                                  <EyeIcon className="w-4 h-4" />
                                ) : (
                                  <EyeOffIcon className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          sideOffset={8}
                          className="bg-white text-black border shadow-lg rounded-md p-3 w-64"
                        >
                          {" "}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Checkbox checked={passwordHas8Characters} />
                              <span>At least 8 characters</span>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <Checkbox checked={passwordHasANumber} />
                              <span>Must include a number</span>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <Checkbox checked={passwordHasAnUpperCase} />
                              <span>Must include a capital letter</span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {errors.password2 && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <CircleAlert className="w-4 h-4" />{" "}
                        {errors.password2.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="default"
                    className="w-full h-9 text-base bg-[#3949ab] hover:bg-[#5c6bc0] focus:bg-[#3949ab] text-white border-none"
                    disabled={isSubmitting}
                  >
                    Register
                  </Button>
                  <div className="text-center text-xs mb-4">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="underline underline-offset-4 text-blue-700"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
