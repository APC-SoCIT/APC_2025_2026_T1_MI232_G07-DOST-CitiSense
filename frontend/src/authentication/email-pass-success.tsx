import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { EmailActionStatusCard } from "./SuccessForm";

export function EmailForgotPasswordSuccessForm({ ...props }) {
  const { forgotPassword, forgotEmail } = useAuth();
  const [seconds, setSeconds] = useState(0);
  console.log(forgotEmail);

  // Reference to the countdown timer: https://stackoverflow.com/a/74918136
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
    <EmailActionStatusCard
      title="Email Sent"
      description={`We sent a verification link to ${forgotEmail}.
            Please check your inbox and click the link to reset your password.`}
      linkHref="/email/forgotpassword"
      linkLabel="Wrong email?"
      seconds={seconds}
      handleResend={handleTimer}
    />
  );
}
