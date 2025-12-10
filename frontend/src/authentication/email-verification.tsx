import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function EmailVerificationSent({ ...props }) {
  return (
    <div
      className="flex flex-col gap-6 scale-80 -mt-10 2xl:mt-5 2xl:scale-100"
      {...props}
    >
      <Card className="">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Verify your email</CardTitle>
          <CardDescription className="">
            We sent a verification email to <strong>{}</strong>. Please check
            your inbox and click the link to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center">
          <Button type="button" variant="default" className="w-full">
            Resend Email
          </Button>

          <div className="flex flex-row justify-center text-center items-center text-sm pt-4">
            <div className="pr-1">
              <ChevronLeft className="w-5 h-5" />
            </div>
            <a href="/login" className="underline underline-offset-4">
              Back to Login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
