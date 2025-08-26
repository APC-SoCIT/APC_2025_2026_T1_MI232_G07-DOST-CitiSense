import React from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { MoveLeft } from "lucide-react";

export function UnauthorizedPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "flex flex-col -mt-10 items-center justify-center min-h-screen p-4",
        className
      )}
      {...props}
    >
      <Card className="overflow-hidden p-0 max-w-4xl w-full min-h-[400px] border-gray-400">
        <CardContent className="grid p-0 md:grid-cols-2 min-h-[500px]">
          <div className="bg-muted relative hidden md:block">
            <img
              src="410.jpeg"
              alt="Unauthorized"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>

          <div className="flex flex-col items-center justify-center p-6 md:p-8 text-center gap-6">
            <h1 className="text-7xl font-bold">401</h1>
            <h2 className="text-3xl font-semibold text-gray-700">
              Unauthorized Access
            </h2>
            <p className="text-gray-500">
              You do not have permission to view this page.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="mt-4"
            >
              <MoveLeft /> Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
