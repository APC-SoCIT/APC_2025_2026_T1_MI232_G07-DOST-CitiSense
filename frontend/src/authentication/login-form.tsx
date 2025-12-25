import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EyeIcon,
  EyeOffIcon,
  Loader2,
  Mail,
  Lock,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuth from "../hooks/useAuth";
import axios from "axios";

const signInSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export type SignInProps = z.infer<typeof signInSchema>;

export function LoginForm1({ ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { Login, socialAuthError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignInProps>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInProps) => {
    try {
      await Login(data);
      navigate("/", { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      }
      setError("root", {
        message: "Invalid credentials. Please try again.",
      });
    }
  };

  const handleGoogle = async () => {
    window.location.replace(
      `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${
        import.meta.env.VITE_GOOGLE_CALLBACK_URL
      }&prompt=consent&response_type=code&client_id=${
        import.meta.env.VITE_GOOGLE_CLIENT_ID
      }&scope=openid%20email%20profile&access_type=offline`
    );
  };

  const displayError = socialAuthError || errors.root?.message;

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

      <Card className="w-full max-w-md border-t-4 border-t-[#0038A8] shadow-2xl bg-white/95 backdrop-blur-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">
            Welcome back
          </CardTitle>
          <CardDescription className="text-balance text-slate-500">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          {displayError && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="font-medium">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="email"
                  className="font-semibold text-slate-700 ml-1"
                >
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-[#0038A8]" />
                  <Input
                    id="email"
                    className={cn(
                      "pl-10 h-11 bg-slate-50/50 border-slate-200 focus-visible:ring-[#0038A8] transition-all",
                      errors.email &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register("email")}
                    placeholder="name@example.com"
                    type="email"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between ml-1">
                  <Label
                    htmlFor="password"
                    className="font-semibold text-slate-700"
                  >
                    Password
                  </Label>
                  <a
                    href="/email/forgotpassword"
                    className="text-xs font-medium text-[#0038A8] hover:underline underline-offset-4"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-[#0038A8]" />
                  <Input
                    id="password"
                    className={cn(
                      "pl-10 pr-10 h-11 bg-slate-50/50 border-slate-200 focus-visible:ring-[#0038A8] transition-all",
                      errors.password &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeIcon className="w-4 h-4" />
                    ) : (
                      <EyeOffIcon className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* UPDATED SIGN IN BUTTON */}
              <Button
                type="submit"
                variant="bluedefault"
                className="w-full h-11 active:scale-[0.98] transition-all font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-11 border-slate-200 bg-white hover:bg-slate-50 transition-all active:scale-[0.98] font-semibold"
            onClick={() => handleGoogle()}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 488 512">
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              />
            </svg>
            Google
          </Button>

          <div className="text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-[#0038A8] underline underline-offset-4 hover:text-blue-800"
            >
              Create an account
            </a>
          </div>
        </CardContent>
      </Card>

      <div className="px-8 text-center text-xs text-slate-400 leading-relaxed max-w-sm">
        By clicking continue, you agree to our{" "}
        <a
          href="#"
          className="underline underline-offset-4 hover:text-[#0038A8] transition-colors"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="underline underline-offset-4 hover:text-[#0038A8] transition-colors"
        >
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
