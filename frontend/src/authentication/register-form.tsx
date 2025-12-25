import React from "react";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import {
  CircleAlert,
  EyeIcon,
  EyeOffIcon,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const signUpSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password1: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number"),
    password2: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords must match",
    path: ["password2"],
  });

export type SignUpFieldProps = z.infer<typeof signUpSchema>;

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword1, setShowPassword1] = React.useState(false);
  const [showPassword2, setShowPassword2] = React.useState(false);
  const navigate = useNavigate();
  const { Register } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    trigger,
  } = useForm<SignUpFieldProps>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFieldProps) => {
    try {
      await Register(data);
      navigate("/email/verification");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverErrors = error.response?.data;
        if (serverErrors && typeof serverErrors === "object") {
          Object.keys(serverErrors).forEach((key) => {
            setError(key as keyof SignUpFieldProps, {
              message: serverErrors[key],
            });
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
            <ShieldCheck className="w-8 h-8 text-white" />
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
          "flex min-h-[60vh] items-start justify-center pt-4 pb-2 bg-slate-50/50",
          className
        )}
      >
        <Card className="w-full max-w-2xl shadow-xl border-t-4 border-t-[#0038a8] bg-white">
          <CardHeader className="space-y-2 pb-6 pt-8">
            <CardTitle className="text-2xl font-bold tracking-tight text-center text-[#1e293b]">
              Create an iRAD Account
            </CardTitle>
            <CardDescription className="text-center text-slate-500 text-base">
              Join the Integrated Research and Development ecosystem
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-3 px-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              <div className="grid gap-1">
                <Label
                  htmlFor="username"
                  className="text-xs font-semibold text-slate-700"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  {...register("username")}
                  className={cn(
                    "h-10 bg-slate-50 border-slate-200 focus:ring-[#0038a8] text-sm",
                    errors.username &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                />
                <p
                  className={cn(
                    "text-destructive text-xs font-medium flex items-center gap-1.5 min-h-[1.5em]",
                    !errors.username && "invisible"
                  )}
                >
                  <CircleAlert className="w-3.5 h-3.5" />
                  {errors.username?.message || "placeholder"}
                </p>
              </div>

              <div className="grid gap-1">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold text-slate-700"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@agency.gov.ph"
                  {...register("email")}
                  className={cn(
                    "h-10 bg-slate-50 border-slate-200 text-sm",
                    errors.email &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                />
                <p
                  className={cn(
                    "text-destructive text-xs font-medium flex items-center gap-1.5 min-h-[1.5em]",
                    !errors.email && "invisible"
                  )}
                >
                  <CircleAlert className="w-3.5 h-3.5" />
                  {errors.email?.message || "placeholder"}
                </p>
              </div>

              <div className="grid gap-1">
                <Label
                  htmlFor="password1"
                  className="text-xs font-semibold text-slate-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password1"
                    type={showPassword1 ? "text" : "password"}
                    {...register("password1")}
                    onBlur={() => trigger("password2")}
                    className={cn(
                      "h-10 pr-10 bg-slate-50 border-slate-200 text-sm",
                      errors.password1 &&
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
                    !errors.password1 && "invisible"
                  )}
                >
                  <CircleAlert className="w-3.5 h-3.5" />
                  {errors.password1?.message || "placeholder"}
                </p>
              </div>

              <div className="grid gap-1">
                <Label
                  htmlFor="password2"
                  className="text-xs font-semibold text-slate-700"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="password2"
                    type={showPassword2 ? "text" : "password"}
                    {...register("password2")}
                    onBlur={() => trigger("password2")}
                    className={cn(
                      "h-10 pr-10 bg-slate-50 border-slate-200 text-sm",
                      errors.password2 &&
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
                    !errors.password2 && "invisible"
                  )}
                >
                  <CircleAlert className="w-3.5 h-3.5" />
                  {errors.password2?.message || "placeholder"}
                </p>
              </div>

              <div className="col-span-1 md:col-span-2 mt-2">
                <Button
                  type="submit"
                  variant="bluedefault"
                  className="w-full h-11 bg-[#0038a8] hover:bg-[#002d86] text-white font-bold transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Register Account"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 pb-6">
            <div className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#0038A8] underline underline-offset-4 hover:text-blue-800"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
