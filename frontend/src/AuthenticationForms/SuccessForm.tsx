import { ChevronLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";

type EmailActionStatusCardProps = {
  title: string;
  description: string;
  linkHref: string;
  linkLabel: string;
  seconds: number;
  handleResend: () => void;
};

export function EmailActionStatusCard({
  title,
  description,
  linkHref,
  linkLabel,
  handleResend,
  seconds,
  ...props
}: EmailActionStatusCardProps) {
  return (
    <div
      className="flex flex-col gap-6 scale-80 -mt-10 2xl:mt-5 2xl:scale-100"
      {...props}
    >
      <Card className="">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center">
          <Button
            type="button"
            variant="default"
            className="w-full"
            onClick={handleResend}
            disabled={seconds > 0}
          >
            {seconds > 0 ? `Resend in ${seconds}` : "Resend email"}
          </Button>

          <div className="flex flex-row justify-center text-center items-center text-sm pt-4">
            <div className="pr-1"></div>
            <a
              href={linkHref}
              className="flex flex-row justify-center items-center underline underline-offset-4"
            >
              <ChevronLeft className="w-5 h-5" />
              {linkLabel}
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
