import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getColor } from "@/lib/utils";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/zustand";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { FaUserEdit } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router";
import { LuLogOut } from "react-icons/lu";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

function ProfileInfo() {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();

  const Logout = async () => {
    try {
      const res = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        {
          withCredentials: true,
        }
      );
      const success = res.data.success;
      if (res.status === 200 && success) {
        toast.success(success);
        navigate("/auth");
        setUserInfo(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="absolute bottom-0 h-16 flex itmes-center justify-between px-10 w-full bg-[#2a2b33]  ">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-10 w-10  rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}${userInfo.image}`}
                alt="profile"
                className="object-cover rounded-full w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                  userInfo.selectedColor
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.charAt(0)
                  : userInfo.email.charAt(0)}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : " "}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
            <NavLink to="/profile">
              <FaUserEdit className="text-purple-500 text-xl font-medium"  />
              </NavLink>
            </TooltipTrigger>
            <TooltipContent className=" bg-[#4c05dbb4] text-[#ffff] border-none" >
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <LuLogOut className="text-[red] text-xl font-medium" onClick={Logout} />
            </TooltipTrigger>
            <TooltipContent className=" bg-[red] text-[#ffff] border-none" >
              Logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default ProfileInfo;
