import { useEffect, useState, type ChangeEvent } from "react";
import api from "../../api";
import useAuth from "../../hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../../components/ui/button";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, CircleAlert } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

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
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
          <div className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">Profile</span>
          </div>

          <Button
            type="button"
            onClick={handleEditOrCancel}
            className={
              isEditing
                ? "bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-500"
                : "bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600"
            }
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </nav>

        <form
          id="profile-form"
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          <header className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-blue-50 px-5 py-6 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <label className="group relative block cursor-pointer">
                  <img
                    src={
                      previewImage ||
                      user.picture ||
                      "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(
                          `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                            user.username ||
                            "User",
                        ) +
                        "&background=2563eb&color=fff"
                    }
                    alt={user.username}
                    className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-blue-100 transition-transform group-hover:scale-105 sm:h-24 sm:w-24"
                  />
                  {isEditing && (
                    <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-sm">
                      <Camera className="h-4 w-4" />
                    </span>
                  )}
                  <Input
                    {...register("image", { onChange: (e) => imagePreview(e) })}
                    className="hidden"
                    type="file"
                    accept="image/*"
                    disabled={!isEditing}
                  />
                </label>

                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    {`${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                      user.username}
                  </h1>
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-blue-700">
                    <span className="rounded-full bg-blue-100 px-2.5 py-1">
                      Name
                    </span>
                    <span>
                      {`${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                        user.username}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
              </div>
            </div>
          </header>

          <section className="px-5 py-6 sm:px-8 lg:px-10">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-800">Account</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2 grid gap-2 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
                <Label className="text-left text-sm font-medium text-slate-700">
                  Username
                </Label>
                <div className="space-y-1">
                  <Input
                    {...register("username")}
                    disabled={!isEditing}
                    onBlur={() => trigger("username")}
                    className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-900 shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                  {errors.username && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <CircleAlert className="h-3.5 w-3.5" />
                      {errors.username.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 grid gap-2 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
                <Label className="text-left text-sm font-medium text-slate-700">
                  First Name
                </Label>
                <Input
                  value={user.first_name || ""}
                  readOnly
                  className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-900 shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  disabled={true}
                />
              </div>

              <div className="md:col-span-2 grid gap-2 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
                <Label className="text-left text-sm font-medium text-slate-700">
                  Last Name
                </Label>
                <Input
                  value={user.last_name || ""}
                  readOnly
                  className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-900 shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  disabled={true}
                />
              </div>

              <div className="md:col-span-2 grid gap-2 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
                <Label className="text-left text-sm font-medium text-slate-700">
                  Email
                </Label>
                <div className="space-y-1">
                  <Input
                    {...register("email")}
                    type="email"
                    disabled={true}
                    className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-900 shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                  {errors.email && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <CircleAlert className="h-3.5 w-3.5" />
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
          {isEditing && (
            <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4 sm:px-8 lg:px-10">
              <Button
                type="submit"
                className="bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-600"
              >
                Save
              </Button>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}

export default Profile;
