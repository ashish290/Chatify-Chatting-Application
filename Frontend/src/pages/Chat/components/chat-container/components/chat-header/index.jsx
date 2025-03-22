import { getColor } from "@/lib/utils";
import { HOST } from "@/utils/constants";
import { useAppStore } from "@/zustand";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { RiCloseFill } from "react-icons/ri";

function ChatHeader() {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();
 
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-5 md:px-20 w-[100%] p-10">
      <div className="flex justify-center items-center gap-5 ">
      <div className="h-12 w-12 rounded-full overflow-hidden">
        {
          selectedChatType === "contact" ? (
            <Avatar className="h-12 w-12  rounded-full overflow-hidden">
          {selectedChatData.image ? (
            <AvatarImage
              src={`${HOST}${selectedChatData.image}`}
              alt="profile"
              className="object-cover w-full h-full"
            />
          ) : (
            <div
              className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                selectedChatData.selectedColor
              )}`}
            >
              {selectedChatData.firstName
                ? selectedChatData.firstName.charAt(0)
                : selectedChatData.email.charAt(0)}
            </div>
          )}
        </Avatar>
          ) : ( <div className="h-12 w-12 rounded-lg bg-[#f1f1f111] flex items-center justify-center">
            #
          </div> )
        }
      </div>
      <div>
        {selectedChatType === "contact" &&
          selectedChatData.firstName + " " + selectedChatData.lastName}
      </div>
      </div>
      <div className="flex gap-3 md:gap-5 items-center w -[100]">
        <div className="flex gap-2 md:gap-3 items-center justify-center">
          <div className="flex items-center justify-center gap-3 md:gap-5">
            <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
              <RiCloseFill
                className="text-2xl md:text-3xl"
                onClick={closeChat}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
