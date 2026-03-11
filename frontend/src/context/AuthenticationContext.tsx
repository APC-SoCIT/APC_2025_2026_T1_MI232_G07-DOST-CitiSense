import React, {
  createContext,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import api from "../api";
import type { SignInProps } from "../AuthenticationForms/login-form";
import type { EmailForgotPasswordProps } from "../AuthenticationForms/email-forgotpassword";
import type { SignUpFieldProps } from "../AuthenticationForms/register-form";

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
  forgotPassword: (email: string) => Promise<void>;
  forgotEmail: string;
  Register: (data: SignUpFieldProps) => Promise<void>;
  registerEmail: string;
};

type AuthProviderProps = {
  children: ReactNode;
};
//create a context where components can use it to render
export const AuthenticationContext = createContext<AuthContextProps | null>(
  null,
);

export const AuthenticationProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null); //store the current logged in user
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [socialAuthError, setSocialAuthError] = useState<string>(""); //for the error message of the when social login attempt failed
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [registerEmail, setRegisterEmail] = useState<string>("");

  //fetch the user details on mount and for automatically refreshing the access token of the user
  useEffect(() => {
    // Some endpoints to skip auth checks
    const authEndpoint =
      window.location.href.startsWith("/login") ||
      window.location.href.startsWith("/register") ||
      window.location.href.startsWith("/password") ||
      window.location.href.startsWith("/email") ||
      window.location.href.startsWith("/guest-dashboard");

    // //skip auth checks for auth endpoints
    if (authEndpoint) {
      setIsLoading(false);
      return;
    }

    //check for the auth status; if there are no details, the refresh the access token.
    const checkAuthStatus = async () => {
      try {
        const userDetails = await api.get("/api/auth/user/");
        setUser(userDetails.data);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
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
      throw error; //give the error to the login form
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
      setIsLoading(false);
    } catch (error) {
      setSocialAuthError("Failed to login with Google");
      throw error; //give the error to the social form
    } finally {
      setIsLoading(false);
    }
  };

  const Logout = async () => {
    await api.post("/api/auth/logout/");
    setUser(null);
    setSocialAuthError("");
  };

  const forgotPassword = async (email: string) => {
    try {
      await api.post("api/auth/password/reset/", { email });
      setForgotEmail(email);
    } catch (error) {
      throw error;
    }
  };

  const Register = async (data: SignUpFieldProps) => {
    try {
      await api.post("/api/auth/register/", data);
      setRegisterEmail(data.email);
    } catch (error) {
      console.log(error);
      throw error;
    }
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
        forgotPassword,
        forgotEmail,
        Register,
        registerEmail,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationContext;
