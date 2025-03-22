import { useAppStore } from "@/zustand";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { colors, getColor } from "@/lib/utils";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import {
  ADD_PROFILE,
  HOST,
  REMOVE_PROFILE,
  UPDATE_ROUTE,
} from "@/utils/constants";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profilesetup === true) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.selectedColor);
    }
    if (userInfo.image) {
      setImage(`${HOST}${userInfo.image}`);
    }
  }, [userInfo]);

  const saveChanges = async () => {
    try {
      const form = {
        firstName: firstName,
        lastName: lastName,
        color: selectedColor,
      };
      const res = await apiClient.post(UPDATE_ROUTE, form, {
        withCredentials: true,
      });
      const success = res.data.success;
      console.log(res.data);
      if (res.status === 200 && success) {
        console.log("Success:", success);
        setUserInfo(res.data);
        toast.success(success);
        navigate("/chat");
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        console.log("Error Response Data:", error.response.data);
        const { filedError } = error.response.data;
        if (status === 400 && filedError) {
          toast.error(filedError);
        }
      }
      console.log("Profile-Update Error:", error);
    }
  };

  const handleNavigate = async () => {
    if (userInfo.profilesetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup profile.");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteImage = async () => {
    try {
      const res = await apiClient.delete(REMOVE_PROFILE, {
        withCredentials: true,
      });
      const { success } = res.data;
      if (res.status === 200 && success) {
        setUserInfo({ ...userInfo, image: null });
        toast.success(success);
        setImage(null);
      }
    } catch (error) {
      console.log("Delete Image Error:", error);
    }
  };

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("profile-image", file);
        const res = await apiClient.post(ADD_PROFILE, formData, {
          withCredentials: true,
        });
        const { success } = res.data;
        if (res.status === 200 && res.data.image) {
          console.log(res.data.image, res.data);

          setUserInfo({ ...userInfo, image: res.data.image });
          console.log('ImageChange : ',userInfo);
          toast.success(success);
        }
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.log("Image Change Error:", error);
      if (error.response) {
        const status = error.response.status;
        const { imgError } = error.response.data;
        if (status === 400 && imgError) {
          toast.error(imgError);
        }
      }
    }
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          <IoArrowBack
            className="text-4xl lg:text-6xl text-white/90 cursor-pointer"
            onClick={handleNavigate}
          />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName ? firstName.charAt(0) : userInfo.email.charAt(0)}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full cursor-pointer"
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".png, .jpg, .jpeg, .svg, .webp"
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, idx) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                    selectedColor === idx
                      ? "outline outline-white/50 outline-1"
                      : ""
                  }`}
                  key={idx}
                  onClick={() => setSelectedColor(idx)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
