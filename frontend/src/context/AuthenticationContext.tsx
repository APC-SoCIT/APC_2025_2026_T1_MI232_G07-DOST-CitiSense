import React, { createContext, useEffect, useState } from "react";
import api from "../api";
import { SignInProps } from "../authentication/login-form";

export type User = {
  id: number;
  username: string;
  email: string;
  picture?: string;
  groups: string[];
  first_name?: string;
  last_name?: string;
};

type AuthContextProps = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
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
  const [socialAuthError, setSocialAuthError] = useState<string>(""); //for the error message of the when social login attempt failed

  //auth endpoints to skip auth checks
  const authEndpoint =
    window.location.href.includes("/login") ||
    window.location.href.includes("/register");

  //fetch the user details on mount and for automatically refreshing the access token of the user
  useEffect(() => {
    //check for the auth status; if there is no details, the refresh the access token.

    //skip auth checks for auth endpoints
    if (authEndpoint) {
      setIsLoading(false);
      return;
    }
    const checkAuthStatus = async () => {
      try {
        const userDetails = await api.get("/api/auth/user/");
        setUser(userDetails.data);
      } catch (error) {
        setUser(null);
        console.log("failed to verify and refresh token");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
    console.log("This is run");
    //set interval for automatically refreshing user every 9 minutes before the token expires;
    //this is for when a user is not actively accessing api endpoints
    const interval = setInterval(checkAuthStatus, 540000);

    //clear the interval to prevent it from running after a component unmounts
    return () => clearInterval(interval);
  }, []);

  const Login = async (data: SignInProps) => {
    setSocialAuthError(""); //clear the current social error; if user goes to login after a failed social login attempt
    try {
      //post the token to the token user data submitted from the login form to get access and refresh tokens
      await api.post("/api/auth/login/", data);
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
      await api.post("/api/auth/google/", { code });
      console.log("This is the code", { code });
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

  const Logout = async () => {
    await api.post("/api/auth/logout/");
    setUser(null);
    setSocialAuthError("");
  };

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        Login,
        SocialLogin,
        Logout,
        socialAuthError,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationContext;
