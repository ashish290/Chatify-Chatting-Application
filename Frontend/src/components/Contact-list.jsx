import { getColor } from "@/lib/utils";
import { HOST } from "@/utils/constants";
import { useAppStore } from "@/zustand";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Hash } from "lucide-react"; // Add this import for channel icon

const ContactList = ({ contacts, isChannel }) => {
  const {
    setSelectedChatData,
    setSelectedChatTypes,
    setSelectedChatMessages,
    selectedChatData,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel){
      setSelectedChatTypes("channel");
    } 
    else setSelectedChatTypes("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#8417ff] hover:bg-[#8417ff]"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {isChannel ? (
              // Channel display
              <div className="flex gap-3 items-center">
                <div className="h-12 w-12 rounded-lg bg-[#f1f1f111] flex items-center justify-center">
                  <Hash className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-neutral-400">
                    {contact.members?.length || 0} members
                  </p>
                </div>
              </div>
            ) : (
              // Contact display
              <div className="flex gap-3 items-center">
                <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                  {contact.image ? (
                    <AvatarImage
                      src={`${HOST}${contact.image}`}
                      alt="profile"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div
                      className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                        contact.selectedColor
                      )}`}
                    >
                      {contact.firstName
                        ? contact.firstName.charAt(0)
                        : contact.email.charAt(0)}
                    </div>
                  )}
                </Avatar>
                <p>{contact.firstName + " " + contact.lastName}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;