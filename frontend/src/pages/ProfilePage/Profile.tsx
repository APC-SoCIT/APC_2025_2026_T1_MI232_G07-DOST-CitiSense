import { useEffect, useState, type ChangeEvent } from "react";
import api from "../../api";
import useAuth from "../../hooks/useAuth";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, CircleAlert, Pencil, User } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { PasswordChangeDialog } from "./PasswordChange";

function Profile() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { user, setUser } = useAuth();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!user) return null;

  const profileSchema = z.object({
    first_name: z.string().min(1, "Cannot be blank").max(50),
    last_name: z.string().min(1, "Cannot be blank").max(50),
    username: z.string().min(1, "Cannot be blank").max(50),
    password: z.string().min(8, "Enter at least 8 characters").optional(),
    email: z.email(),
    image: z.any().optional(),
  });

  type profileProps = z.infer<typeof profileSchema>;

  const {
    register,
    formState: { errors },
    handleSubmit,
    trigger,
    setError,
    reset,
  } = useForm<profileProps>({
    defaultValues: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      username: user?.username,
      email: user?.email,
    },
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = async (data: profileProps) => {
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("username", data.username);
    formData.append("email", data.email);

    if (data.image?.length) {
      formData.append("picture_file", data.image[0]);
    }

    try {
      const res = await api.put("/api/auth/user/", formData);
      toast.success("Succesfully updated user profile!");
      setUser(res.data);
      setIsEditing(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.email) {
          setError("email", { message: error.response.data.email });
        }
        if (error.response?.data?.username) {
          setError("username", { message: error.response.data.username });
        }
      }
    }
  };

  const handleEditOrCancel = () => {
    if (isEditing) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email,
      });
      setPreviewImage(user.picture || null);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const imagePreview = (e: ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files;
    if (image?.length) {
      const fetchImage = image[0];
      setPreviewImage(URL.createObjectURL(fetchImage));
    }
  };

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 px-4 sm:px-6">
      <Button
        type="button"
        variant="outline"
        className={`fixed top-6 right-6 sm:top-8 sm:right-8 z-10 shadow-lg ${
          isEditing
            ? "bg-red-600 hover:bg-red-400 text-white"
            : "bg-blue-700 hover:bg-blue-500 text-white"
        }`}
        onClick={handleEditOrCancel}
      >
        {isEditing ? "Cancel" : <Pencil />}
      </Button>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl flex flex-col items-center gap-6 sm:gap-8 bg-transparent"
      >
        <h1 className="flex items-center gap-3 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
          <User className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
          Profile
        </h1>

        {/* Profile Image */}
        <div className="flex flex-col items-center w-full">
          <label className="relative group cursor-pointer">
            <img
              src={previewImage || user.picture}
              alt={user.username}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-blue-200 shadow-lg transition-transform group-hover:scale-105 bg-white"
            />
            {isEditing && (
              <>
                <span className="absolute flex items-center justify-center bottom-2 right-2 sm:bottom-3 sm:right-3 border w-8 h-8 sm:w-10 sm:h-10 bg-white shadow-md rounded-full group-hover:bg-blue-50 transition-colors">
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </span>
                <Input
                  {...register("image", { onChange: (e) => imagePreview(e) })}
                  className="hidden"
                  type="file"
                />
              </>
            )}
          </label>
        </div>

        <div className="w-full border-b border-gray-200" />

        {/* Name Fields */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full">
          <div className="flex flex-col flex-1">
            <Label className="mb-1 font-semibold">First Name</Label>
            <Input
              {...register("first_name")}
              className="font-semibold bg-gray-50 border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 py-3 px-4 rounded-lg"
              disabled={!isEditing}
            />
            {errors.first_name && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                <CircleAlert className="w-4 h-4" />
                {errors.first_name.message}
              </p>
            )}
          </div>

          <div className="flex flex-col flex-1">
            <Label className="mb-1 font-semibold">Last Name</Label>
            <Input
              {...register("last_name")}
              className="font-semibold bg-gray-50 border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 py-3 px-4 rounded-lg"
              disabled={!isEditing}
            />
            {errors.last_name && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                <CircleAlert className="w-4 h-4" />
                {errors.last_name.message}
              </p>
            )}
          </div>
        </div>

        <div className="w-full border-b border-gray-200" />

        {/* Username */}
        <div className="flex flex-col w-full">
          <Label className="mb-1 font-semibold">Username</Label>
          <Input
            {...register("username")}
            disabled={!isEditing}
            onBlur={() => trigger("username")}
            className="font-semibold bg-gray-50 border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 py-3 px-4 rounded-lg"
          />
          {errors.username && (
            <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
              <CircleAlert className="w-4 h-4" />
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="w-full border-b border-gray-200" />

        {isEditing && (
          <Button
            className="w-full sm:w-40 shadow mb-4"
            type="submit"
            variant="greendefault"
          >
            Submit
          </Button>
        )}
      </form>{" "}
      {/* Email & Password */}
      <div className="flex flex-col mt-5 md:flex-row items-center w-full gap-4 md:gap-8 justify-center">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-5 text-center sm:text-left">
          <Label className="font-semibold">Password:</Label>
          <PasswordChangeDialog />
        </div>
      </div>
    </main>
  );
}

export default Profile;
