import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import axios from "axios";
import { Loader2 } from "lucide-react";

const EmailVerificationCallback = () => {
  const { key } = useParams();
  const [redirectTimer, setRedirectTimer] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const redirectCountdown = setInterval(() => {
      setRedirectTimer((prev) => {
        // If the current timer is less than or equal to 1, then clear the interval and navigate to login
        if (prev <= 1) {
          clearInterval(redirectCountdown);
          navigate("/login");
          return 0;
        }
        // Else; subtract by 1 the current prev value.
        return prev - 1;
      });
    }, 1000);

    const onSubmit = async () => {
      try {
        await api.post("/api/auth/email/verification/", { key });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error);
          navigate("/register");
        }
      }
    };

    onSubmit();

    return () => clearInterval(redirectCountdown);
  }, [key, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-20 h-20 animate-spin [animation-duration:2s]" />{" "}
      <h4 className="text-2xl">Redirecting you to login in {redirectTimer}</h4>
    </div>
  );
};

export default EmailVerificationCallback;
