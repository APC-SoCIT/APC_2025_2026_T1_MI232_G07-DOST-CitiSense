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

function Home() {
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
    <main className="flex flex-col items-center justify-center border border-gray-500 rounded-2xl shadow-xl w-[700px] h-[770px] mx-auto mt-10 relative">
      <Button
        type="button"
        variant="outline"
        className={`mt-10 absolute top-0 right-5 text-white ${
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
        className="flex flex-col justify-center items-center"
      >
        <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900 mb-8">
          <User className="w-10 h-10 text-blue-600" />
          Profile
        </h1>
        <div className="flex flex-col text-center">
          <label className="relative">
            <img
              src={previewImage || user.picture}
              alt={user.username}
              className="w-32 h-32 rounded-full object-cover mb-10"
            />
            {isEditing ? (
              <span className="absolute flex items-center justify-center top-26 left-21 border w-8 h-8 bg-white rounded-3xl cursor-pointer">
                <Camera className="w-5 h-5" />
              </span>
            ) : null}

            {isEditing ? (
              <Input
                {...register("image", { onChange: (e) => imagePreview(e) })}
                className="m-5 hidden"
                type="file"
              />
            ) : null}
          </label>
        </div>

        <div className="flex flex-row gap-4 mb-6">
          <div className="flex flex-col mr-15">
            <Label className="mb-3 items-center justify-center flex">
              First Name
            </Label>
            <Input
              {...register("first_name")}
              className="text-bold bg-gray-200"
              type="text"
              disabled={!isEditing}
              autoComplete="off"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                <CircleAlert className="w-4 h-4" /> {errors.first_name.message}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <Label className="mb-3 flex items-center justify-center">
              Last Name
            </Label>
            <Input
              {...register("last_name")}
              className="text-bold bg-gray-200"
              type="text"
              disabled={!isEditing}
              autoComplete="off"
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                <CircleAlert className="w-4 h-4" /> {errors.last_name.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col mb-6">
          <Label className="mb-3 flex items-center justify-center">
            Username
          </Label>
          <Input
            {...register("username")}
            type="text"
            className="text-bold bg-gray-200"
            disabled={!isEditing}
            onBlur={() => trigger("username")}
            autoComplete="off"
          />
          {errors.username && (
            <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
              <CircleAlert className="w-4 h-4" /> {errors.username.message}
            </p>
          )}
        </div>

        <div className="flex flex-col w-[300px] mb-15">
          <Label className="mb-3 flex items-center justify-center">
            Email{" "}
          </Label>
          <Input
            {...register("email")}
            className="text-center text-bold bg-gray-200"
            type="text"
            disabled={true}
            autoComplete="off"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
            <CircleAlert className="w-4 h-4" /> {errors.email.message}
          </p>
        )}
        <div className="flex flex-row text-2xl">
          <Label className="mb-2 flex items-center justify-center mr-2">
            Password:
          </Label>
          <span className="mr-2">***********</span>
          <Button
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-md text-sm"
            type="button"
          >
            Change password
          </Button>
        </div>
        <Button
          className="mt-20"
          type="submit"
          disabled={!isEditing}
          variant="greendefault"
        >
          Submit
        </Button>
      </form>
    </main>
  );
}

export default Home;
