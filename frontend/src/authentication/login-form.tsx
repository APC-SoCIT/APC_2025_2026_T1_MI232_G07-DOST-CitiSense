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
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuth from "../hooks/useAuth";
import axios from "axios";

//zod schema for login form validation
const signInSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

//follow the schema of zod
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
      await Login(data); //call the usecontext function
      navigate("/", { replace: true });
      console.log("hello world");
      console.log(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      }
      setError("root", {
        message: "Invalid credentials. Please try again.",
      });
    }
  };

  //navigate the user to the google endpoint to get the access token
  const handleGoogle = async () => {
    window.location.replace(
      `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${
        import.meta.env.VITE_GOOGLE_CALLBACK_URL
      }&prompt=consent&response_type=code&client_id=${
        import.meta.env.VITE_GOOGLE_CLIENT_ID
      }&scope=openid%20email%20profile&access_type=offline`
    );
  };

  //used for displaying the error in the card div; either the social auth error, or the normal username and password login
  const displayError = socialAuthError || errors.root?.message;

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[80vh] gap-4"
      {...props}
    >
      <Card className="w-full max-w-xl p-0 shadow-lg border border-border">
        <CardHeader className="text-center pb-2">
          {displayError && (
            <CardDescription className="text-left bg-red-100 text-red px-3 py-2 mb-3 rounded-lg text-red-600">
              {displayError}
            </CardDescription>
          )}
          <CardTitle className="text-2xl mb-1 mt-4">Welcome back</CardTitle>
          <CardDescription className="mb-1">
            Login with your own account
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className={undefined}>
                    Email
                  </Label>
                  <Input
                    {...register("email")}
                    type="text"
                    className="h-9 px-3 text-base"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password" className={undefined}>
                      Password
                    </Label>
                    <a
                      href="/email/forgotpassword"
                      className="ml-auto text-xs underline-offset-4 hover:underline text-blue-700"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      className="h-9 px-3 text-base pr-10"
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-0 h-6 w-6 hover:bg-transparent"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeIcon className="w-4 h-4" />
                      ) : (
                        <EyeOffIcon className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  variant="default"
                  className="w-full h-9 text-base bg-[#3949ab] hover:bg-[#5c6bc0] focus:bg-[#3949ab] text-white border-none"
                  disabled={isSubmitting}
                >
                  Login
                </Button>
              </div>
              <div className="after:border-border relative text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full h-9 text-base flex items-center justify-center gap-2"
                  onClick={() => handleGoogle()}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 mr-1"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </div>
              <div className="text-center text-xs mb-4">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="underline underline-offset-4 text-blue-700"
                >
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-gray-600 *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 mt-2">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
