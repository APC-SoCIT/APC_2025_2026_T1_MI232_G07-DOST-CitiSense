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
              Forgot your password?
            </CardTitle>
            <CardDescription className="text-center text-slate-500 text-base">
              Please enter your email so that we can send you the password reset
              link.
            </CardDescription>
            {errors.root?.message && (
              <div className="text-red-700 bg-red-100 px-4 py-2 rounded text-center mt-2">
                {errors.root.message}
              </div>
            )}
          </CardHeader>
          <CardContent className="grid gap-3 px-6">
            <form
              onSubmit={handleSubmit(ForgotPasswordSubmit)}
              className="grid grid-cols-1 gap-3"
            >
              <div className="grid gap-1">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold text-slate-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
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
              <div className="col-span-1 mt-2">
                <Button
                  type="submit"
                  variant="bluedefault"
                  className="w-full h-11 bg-[#0038a8] hover:bg-[#002d86] text-white font-bold transition-colors"
                  disabled={isSubmitting}
                >
                  Send Email
                </Button>
              </div>
              <div className="col-span-1 mt-2 text-center text-sm text-slate-600">
                <a
                  href="/login"
                  className="flex flex-row items-center justify-center font-semibold text-[#0038A8] underline underline-offset-4 hover:text-blue-800"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back to Login
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
