import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import axios, { Axios, AxiosError } from "axios";
import api from "@/api";
import { toast } from "sonner";
import { useState } from "react";
import PasswordInput from "@/components/ui/PasswordInput";

export function PasswordChangeDialog() {
  const [open, setOpen] = useState<boolean>(false);
  const changePasswordSchema = z
    .object({
      old_password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must include at least one uppercase letter")
        .regex(/[0-9]/, "Must include at least one number"),
      new_password1: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must include at least one uppercase letter")
        .regex(/[0-9]/, "Must include at least one number"),

      new_password2: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must include at least one uppercase letter")
        .regex(/[0-9]/, "Must include at least one number"),
    })
    //checks if password1 and password2 matches
    .refine((data) => data.new_password1 === data.new_password2, {
      message: "Passwords must match",
      path: ["new_password2"],
    })
    // Checks if the new password doesn't match the old password
    .refine((data) => data.old_password !== data.new_password1, {
      message: "Your new password must not match your old password",
      path: ["new_password1"],
    });

  type passwordChangeProps = z.infer<typeof changePasswordSchema>;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
    trigger,
    watch,
  } = useForm<passwordChangeProps>({
    resolver: zodResolver(changePasswordSchema),
  });

  const password1 = watch("new_password1");
  const password2 = watch("new_password2");

  const handleChangePassword = async (data: passwordChangeProps) => {
    try {
      await api.post("/api/auth/password/change/", data);
      toast.success("Successfully updated password.");
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Error updating your password. Please try again.");
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
        setError("old_password", {
          message: error.response?.data.old_password,
        });
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        // Reset the values of the dialog after closing and opening it again
        reset();
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-md text-sm shadow"
          type="button"
        >
          Change password
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm md:max-w-md">
        <form onSubmit={handleSubmit(handleChangePassword)}>
          <DialogHeader>
            <DialogTitle>Change your password</DialogTitle>
            <DialogDescription>
              Make a change to your password here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col my-7 gap-3">
            <Label className="" htmlFor="old-password">
              Old password
            </Label>
            <PasswordInput {...register("old_password")} showToolTip={false} />
            {errors.old_password && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <CircleAlert className="w-4 h-4" />{" "}
                {errors.old_password.message}
              </p>
            )}

            <Label className="" htmlFor="password-1">
              New password
            </Label>
            <PasswordInput
              value={password1}
              {...register("new_password1")}
              onBlur={() => trigger("new_password1")}
            />
            {errors.new_password1 && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <CircleAlert className="w-4 h-4" />{" "}
                {errors.new_password1.message}
              </p>
            )}
            <Label className="" htmlFor="password-2">
              Confirm password
            </Label>
            <PasswordInput value={password2} {...register("new_password2")} />
            {errors.new_password2 && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <CircleAlert className="w-4 h-4" />{" "}
                {errors.new_password2.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button>Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
