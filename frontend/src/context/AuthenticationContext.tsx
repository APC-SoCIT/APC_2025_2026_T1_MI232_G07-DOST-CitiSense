import React, { createContext, useEffect, useState } from "react";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { SignInProps } from "../authentication/login-form";

type User = {
  id: number;
  username: string;
  email: string;
  picture?: string;
  groups: string[];
};

type AuthContextProps = {
  user: User | null;
  Login: (data: SignInProps) => Promise<void>;
  SocialLogin: (code: string) => Promise<void>;
  Logout: () => void;
  isLoading: boolean;
  socialAuthError: string;
};

//create a context where components can use it to render
export const AuthenticationContext = createContext<AuthContextProps | null>(
  null
);

export const AuthenticationProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); //store the current logged in user
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [socialAuthError, setSocialAuthError] = useState<string>("");

  //fetch the user details on mount
  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      // if no token setAuthorize to false
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get("/api/auth/user/");
        console.log(res);
        setUser(res.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    getUser();
  }, []);

  const Login = async (data: SignInProps) => {
    setSocialAuthError(""); //clear the current social error; if user goes to login after a failed social login attempt
    try {
      //post the token to the token user data submitted from the login form to get access and refresh tokens
      const res = await api.post("/api/auth/token/", data);
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

      //get the current logged in users' details from the endpoint
      const userDetails = await api.get("/api/auth/user/");
      setUser(userDetails.data);
    } catch (error) {
      setUser(null);
      console.log(error);
      throw new Error(); //give the error to the login form
    } finally {
      setIsLoading(false);
    }
  };

  const SocialLogin = async (code: string) => {
    try {
      //post the code from the url parameters given by google to the /api/auth/google endpoint to get the access and refresh tokens
      const response = await api.post("/api/auth/google/", { code });
      console.log("This is the code", { code });
      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh);

      //get the current logged in users' details from the endpoint
      const userDetails = await api.get("/api/auth/user/");
      setUser(userDetails.data);
    } catch (error) {
      setSocialAuthError("Failed to login with Google");
      throw new Error(); //give the erorr to the social form
    } finally {
      setIsLoading(false);
    }
  };

  const Logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthenticationContext.Provider
      value={{ user, isLoading, Login, SocialLogin, Logout, socialAuthError }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationContext;
