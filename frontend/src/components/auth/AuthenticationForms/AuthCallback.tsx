import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Loader2 } from "lucide-react";
import axios from "axios";

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
        navigate("/login");
        setIsLoading(false);
      }
    };

    authenticate();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-20 h-20 animate-spin" />{" "}
        <h4 className="text-2xl">Authenticating</h4>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
