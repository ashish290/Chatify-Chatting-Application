import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import Lottie from "react-lottie";
import { apiClient } from "@/lib/api-client";
import { CONTACT_SEARCH, HOST } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useAppStore } from "@/zustand";

function NewDm() {
  const { setSelectedChatData, setSelectedChatTypes } = useAppStore();
  const [openNewContactMode, setOpenNewContactMode] = useState(false);
  const [searchedContact, setsearchedContact] = useState([]);

  const SelectContact = (contact) => {
    setOpenNewContactMode(false);
    setSelectedChatTypes("contact");
    setSelectedChatData(contact);
    setsearchedContact([]);
  };

  const searchContact = async (user) => {
    try {
      if (user.length > 0) {
        const res = await apiClient.post(
          CONTACT_SEARCH,
          { user },
          { withCredentials: true }
        );
        if (res.status === 200 && res.data.contact) {
          setsearchedContact(res.data.contact);
        }
      } else {
        setsearchedContact([]);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactMode(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white ">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactMode} onOpenChange={setOpenNewContactMode}>
        <DialogContent className=" bg-[#1c1b1e] bg-none rounded-2xl border-none text-white w-[400px] h-[400px] flex flex-col ">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className="rounded-lg bg-[#2c2e3b] "
              onChange={(e) => searchContact(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[250px]">
            <div className="flex flex-col gap-5">
              {searchedContact.map((contact) => (
                <div
                  key={contact._id}
                  className="flex gap-3 items-center cursor-pointer"
                  onClick={() => {
                    SelectContact(contact);
                  }}
                >
                  <Avatar className="h-12 w-12  rounded-full overflow-hidden">
                    {contact.image ? (
                      <AvatarImage
                        src={`${HOST}${contact.image}`}
                        alt="profile"
                        className="object-cover w-full h-full bg-black"
                      />
                    ) : (
                      <div
                        className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                          contact.selectedColor
                        )}`}
                      >
                        {contact.firstName
                          ? contact.firstName.charAt(0)
                          : contact.email.charAt(0)}
                      </div>
                    )}
                  </Avatar>
                  <div className="flex flex-col">
                    <span>
                      {contact.firstName && contact.lastName
                        ? `${contact.firstName} ${contact.lastName}`
                        : contact.email}
                    </span>
                    <span className="text-xs">{contact.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {searchedContact.length > 0 && <ScrollArea className="h-[250px]" />}

          {searchedContact.length <= 0 && (
            <div>
              <div className="flex-1 md:flex flex-col justify-center items-center  druation-1000 transition-all">
                <Lottie
                  isClickToPauseDisabled={true}
                  height={100}
                  width={100}
                  options={animationDefaultOptions}
                />
                <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                  <h3 className="poppins-medium">
                    Search new
                    <span className="text-purple-500"> Contacts</span>
                  </h3>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewDm;
