import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { EmailActionStatusCard } from "./SuccessForm";
import api from "../../../api";
import axios from "axios";

export function EmailVerificationSent() {
  const [seconds, setSeconds] = useState(0);
  const { registerEmail } = useAuth();

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

  const handleTimer = async () => {
    try {
      await api.post("/api/auth/email/verification/resend/", {
        email: registerEmail,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      }
      console.log(error);
    }

    setSeconds(60);
  };
  return (
    <EmailActionStatusCard
      title="Verify your email"
      description={`We sent a verification email to ${registerEmail}.
            Please check your inbox and click the link to verify your account.`}
      handleResend={handleTimer}
      linkHref="/register"
      linkLabel="Back to Register"
      seconds={seconds}
    />
  );
}
