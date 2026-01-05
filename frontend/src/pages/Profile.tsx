import { useEffect, useState, ChangeEvent } from "react";
import api from "../api";
import useAuth from "../hooks/useAuth";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, CircleAlert, Pencil, User } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

function Profile() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { user, setUser } = useAuth();
  const [previewImage, setPreviewImage] = useState<string | null>(null); //for previewing the newly uploaded image of the user before submitting formData to backend

  //to prevent crashing if no user is still returned at mount
  if (!user) return;

  //schema and validator for the profile form
  const profileSchema = z.object({
    first_name: z.string().min(1, "Cannot be blank").max(50),
    last_name: z.string().min(1, "Cannot be blank").max(50),
    username: z.string().min(1, "Cannot be blank").max(50),
    password: z.string().min(8, "Enter at least 8 characters").optional(),
    email: z.email(),
    image: z.any().optional(),
  });

  type profileProps = z.infer<typeof profileSchema>;

  //initialization of the react hook form
  const {
    register,
    formState: { errors },
    handleSubmit,
    trigger,
    setError,
    reset,
  } = useForm<profileProps>({
    //default values to populate the input fields with the authenticated user
    defaultValues: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      username: user?.username,
      email: user?.email,
    },
    //outsource the form validator to zod
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = async (data: profileProps) => {
    //need to make a formData to send user details with image
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("username", data.username);
    formData.append("email", data.email);

    //only include the image in payload if user uploaded an image
    if (data.image?.length) {
      formData.append("picture_file", data.image[0]);
    }

    try {
      const res = await api.put("/api/auth/user/", formData);
      console.log("Updated user:", formData);
      toast.success("Succesfully updated user profile!");
      setUser(res.data);
      setIsEditing(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);

        //set the error from RHF to pass onto to the errors in the input forms; primarily for username and email uniqueness check from backend
        if (error.response?.data?.email) {
          setError("email", { message: error.response.data.email });
        }
        if (error.response?.data?.username) {
          setError("username", { message: error.response.data.username });
        }
      } else {
        console.error("Error encountered", error);
      }
    }
  };

  //reset the form state when user clicks cancel
  const handleEditOrCancel = async () => {
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

  //to show the image on the img element when user uploads a picture
  const imagePreview = (e: ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files;
    if (image?.length) {
      //access the first file which is the image; no other files to check for because this only supports one file upload at a time
      const fetchImage = image[0];
      //convert the image url in memory to a binary url used for previewing the image
      setPreviewImage(URL.createObjectURL(fetchImage));
    }
  };

  //cleanup use effect
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 px-4">
      <Button
        type="button"
        variant="outline"
        className={`fixed top-8 right-8 z-10 text-white shadow-lg ${
          isEditing
            ? "bg-red-600 hover:bg-red-400 text-white hover:text-white"
            : "bg-blue-700 hover:bg-blue-500 hover:text-white"
        }`}
        onClick={handleEditOrCancel}
      >
        {isEditing ? "Cancel" : <Pencil />}
      </Button>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl flex flex-col items-center gap-8 bg-transparent"
      >
        <h1 className="flex items-center gap-3 text-4xl font-extrabold text-gray-900 mb-2 tracking-tight drop-shadow-sm mt-0">
          <User className="w-12 h-12 text-blue-600" />
          Profile
        </h1>
        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-2 w-full">
          <label className="relative group cursor-pointer">
            <img
              src={previewImage || user.picture}
              alt={user.username}
              className="w-36 h-36 rounded-full object-cover border-4 border-blue-200 shadow-lg transition-transform group-hover:scale-105 bg-white"
            />
            {isEditing && (
              <span className="absolute flex items-center justify-center bottom-3 right-3 border w-10 h-10 bg-white shadow-md rounded-full cursor-pointer group-hover:bg-blue-50 transition-colors">
                <Camera className="w-6 h-6 text-blue-600" />
              </span>
            )}
            {isEditing && (
              <Input
                {...register("image", { onChange: (e) => imagePreview(e) })}
                className="hidden"
                type="file"
              />
            )}
          </label>
        </div>
        <div className="w-full border-b border-gray-200 mb-1"></div>
        {/* Name Fields */}
        <div className="flex flex-row gap-8 w-full">
          <div className="flex flex-col flex-1">
            <Label className="mb-1 text-gray-700 font-semibold">
              First Name
            </Label>
            <Input
              {...register("first_name")}
              className="font-semibold bg-gray-50 border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 py-3 px-4 rounded-lg"
              type="text"
              disabled={!isEditing}
              autoComplete="off"
            />
            {errors.first_name && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                <CircleAlert className="w-4 h-4" /> {errors.first_name.message}
              </p>
            )}
          </div>
          <div className="flex flex-col flex-1">
            <Label className="mb-1 text-gray-700 font-semibold">
              Last Name
            </Label>
            <Input
              {...register("last_name")}
              className="font-semibold bg-gray-50 border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 py-3 px-4 rounded-lg"
              type="text"
              disabled={!isEditing}
              autoComplete="off"
            />
            {errors.last_name && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                <CircleAlert className="w-4 h-4" /> {errors.last_name.message}
              </p>
            )}
          </div>
        </div>
        <div className="w-full border-b border-gray-200"></div>
        {/* Username Field */}
        <div className="flex flex-col w-full">
          <Label className="mb-1 text-gray-700 font-semibold">Username</Label>
          <Input
            {...register("username")}
            type="text"
            className="font-semibold bg-gray-50 border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 py-3 px-4 rounded-lg"
            disabled={!isEditing}
            onBlur={() => trigger("username")}
            autoComplete="off"
          />
          {errors.username && (
            <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
              <CircleAlert className="w-4 h-4" /> {errors.username.message}
            </p>
          )}
        </div>
        <div className="w-full border-b border-gray-200"></div>
        {/* Email and Password Change Buttons Side by Side */}
        <div className="flex flex-row items-center w-full gap-8 justify-center mt-2 mb-2">
          <div className="flex flex-row items-center gap-5 ">
            <Label className="mb-1 text-gray-700 font-semibold">Email:</Label>
            <Button
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-md text-sm shadow mr-15"
              type="button"
              disabled={!isEditing}
            >
              Change email
            </Button>
          </div>
          <div className="flex flex-row items-center gap-5">
            <Label className="mb-1 text-gray-700 font-semibold">
              Password:
            </Label>
            <Button
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-md text-sm shadow"
              type="button"
              disabled={!isEditing}
            >
              Change password
            </Button>
          </div>
        </div>
        <div
          style={{
            height: "48px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isEditing && (
            <Button
              className="w-40 shadow"
              type="submit"
              disabled={!isEditing}
              variant="greendefault"
            >
              Submit
            </Button>
          )}
        </div>
      </form>
    </main>
  );
}

export default Profile;
