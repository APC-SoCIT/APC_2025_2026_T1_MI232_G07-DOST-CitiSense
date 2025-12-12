import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Loader } from "lucide-react";
import axios from "axios";
import { duration } from "html2canvas-pro/dist/types/css/property-descriptors/duration";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { SocialLogin } = useAuth();

  useEffect(() => {
    const authenticate = async () => {
      //get the current code from the url
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      //if there is no code parameter in the url, then navigate to /login
      if (!code) {
        navigate("/login");
        return;
      }

      let attempts = 0;
      const maxAttempts = 3;

      // Reference: https://www.reddit.com/r/learnjavascript/comments/1f4zunn/await_new_promiseresolve_settimeoutresolve_1000/
      // To delay each retry attempt by 1.5 seconds
      const delay = (durationMs: number) => {
        return new Promise((resolve) => setTimeout(resolve, durationMs));
      };

      while (attempts < maxAttempts) {
        try {
          //trigger the social login function from the context
          await SocialLogin(code);

          //on success navigate to the home
          navigate("/");
          return;
        } catch (error) {
          // Handle specific Axios error
          if (axios.isAxiosError(error)) {
            console.log(error.response?.data);
          }
          console.log("This is run", attempts);
          attempts++;

          // Delay each retry by 1.5 seconds
          await delay(1500);
        }
      }
      navigate("/login");
      setIsLoading(false);
    };

    authenticate();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader className="w-20 h-20 animate-spin" />{" "}
        <h4 className="text-2xl">Authenticating</h4>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
