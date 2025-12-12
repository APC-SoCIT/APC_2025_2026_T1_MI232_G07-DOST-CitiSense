import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { CircleAlert, EyeIcon, EyeOffIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

//zod schema for the form validation
const signUpSchema = z
  .object({
    username: z.string(),
    email: z.email(),
    password1: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number"),

    password2: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number"),
  })
  //checks if password1 and password2 matches
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords must match",
    path: ["password2"],
  });

//follow the schema of the zod
export type SignUpFieldProps = z.infer<typeof signUpSchema>;

export function RegisterForm({ ...props }) {
  //for showing password
  const [showPassword1, setShowPassword1] = React.useState(false);
  const [showPassword2, setShowPassword2] = React.useState(false);
  const [formError, setFormError] = React.useState("");
  const navigate = useNavigate();
  const { Register } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    trigger,
  } = useForm<SignUpFieldProps>({
    //hook up the zod schema to react hook form, outsource validation to zod
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFieldProps) => {
    try {
      await Register(data);
      await navigate("/email/verification");
    } catch (error) {
      // Handle specific Axios error
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        if (error.response?.data?.username) {
          setError("username", { message: error.response.data.username });
        }
        if (error.response?.data.email) {
          setError("email", { message: error.response.data.email });
        }
        if (error.response?.data.password1) {
          setError("password1", {
            message: error.response?.data.password1,
          });
        }
        if (error.response?.data.password2) {
          setError("password2", {
            message: error.response?.data.password2,
          });
        }

        if (error.response?.data.non_field_errors[0]) {
          setFormError(error.response.data.non_field_errors[0]);
        }
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6")}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Register an account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your credentials to register an account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label className="" htmlFor="username">
            Username
          </Label>
          <div>
            <Input
              className=""
              {...register("username")}
              id="username"
              type="text"
            />
            {errors.username && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                <CircleAlert className="w-4 h-4" /> {errors.username.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid gap-3">
          <Label className="" htmlFor="email">
            Email
          </Label>
          <div>
            <Input
              className=""
              {...register("email")}
              type="email"
              placeholder="m@example.com"
            />

            {errors.email && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                <CircleAlert className="w-4 h-4" /> {errors.email.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label className="" htmlFor="password">
              Password
            </Label>
          </div>
          <div className="relative">
            <Input
              className=""
              {...register("password1")}
              type={showPassword1 ? "text" : "password"}
              onBlur={() => trigger("password2")}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 py-5 hover:bg-transparent"
              onClick={() => setShowPassword1((prev) => !prev)}
            >
              {showPassword1 ? (
                <EyeIcon className="w-4 h-4" />
              ) : (
                <EyeOffIcon className="w-4 h-4" />
              )}
            </Button>
            {errors.password1 && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                <CircleAlert className="w-4 h-4" /> {errors.password1.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label className="" htmlFor="password">
              Confirm Passsword
            </Label>
          </div>
          <div className="relative">
            <Input
              className=""
              {...register("password2")}
              type={showPassword2 ? "text" : "password"}
              onBlur={() => trigger("password2")}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 py-5 hover:bg-transparent"
              onClick={() => setShowPassword2((prev) => !prev)}
            >
              {showPassword2 ? (
                <EyeIcon className="w-4 h-4" />
              ) : (
                <EyeOffIcon className="w-4 h-4" />
              )}
            </Button>
            {errors.password2 && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                <CircleAlert className="w-4 h-4" /> {errors.password2.message}
              </p>
            )}
          </div>
          {formError && (
            <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
              <CircleAlert className="w-4 h-4" /> {formError}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          onClick={() => setFormError("")}
          disabled={isSubmitting}
        >
          Register
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </form>
  );
}
