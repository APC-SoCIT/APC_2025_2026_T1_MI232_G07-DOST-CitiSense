import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";

export function EmailForgotPasswordSuccessForm({ ...props }) {
  const { forgotPassword, forgotEmail } = useAuth();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  const handleTimer = () => {
    forgotPassword(forgotEmail);
    setSeconds(60);
  };

  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-[60vh] bg-slate-50/50 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-[#0038a8] bg-white">
        <CardHeader className="space-y-2 pb-6 pt-8">
          <CardTitle className="text-2xl font-bold tracking-tight text-center text-[#1e293b]">
            Email Sent
          </CardTitle>
          <CardDescription className="text-center text-slate-500 text-base">
            {`We sent a verification link to ${forgotEmail}. Please check your inbox and click the link to reset your password.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center px-6">
          <Button
            type="button"
            variant="bluedefault"
            className="w-full h-11 bg-[#0038a8] hover:bg-[#002d86] text-white font-bold transition-colors"
            onClick={handleTimer}
            disabled={seconds > 0}
          >
            {seconds > 0 ? `Resend in ${seconds}` : "Resend email"}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 pb-6">
          <div className="text-center text-sm text-slate-600">
            <a
              href="/email/forgotpassword"
              className="font-semibold text-[#0038A8] underline underline-offset-4 hover:text-blue-800"
            >
              Wrong email?
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
