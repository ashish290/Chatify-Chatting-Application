import ChatHeader from "./components/chat-header";
import MessageBar from "./components/messaage-bar";
import MessageContainer from "./components/message-container";

function ChatContainer() {
  return (
    <div className="top-0 w-[100vw] h-[100vh] bg-[#1c1d25] flex flex-col md:static md:flex-1 ">
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  );
}

export default ChatContainer;
