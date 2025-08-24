import React, { useEffect, useState } from "react";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { SocialLogin } = useAuth();

  useEffect(() => {
    const authenticate = async () => {
      try {
        //get the current code from the url
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        //if there is no code parameter in the url, then navigate to /login
        if (!code) {
          navigate("/login");
          return;
        }

        //trigger the social login function from the context
        await SocialLogin(code);

        //on success navigate to the home
        navigate("/");
      } catch (error) {
        console.log(error.response?.data);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    authenticate();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return null;
};

export default AuthCallback;
