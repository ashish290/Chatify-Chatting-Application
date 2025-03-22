export const createChatSlice = (set, get) => ({
  selectedChatData: undefined,
  selectedChatType: undefined,
  selectedChatMessages: [],
  directMessagesContacts: [],
  channels: [],
  setChannels : (channels) => set({channels}),
  setSelectedChatTypes: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
  setDirectMessagesContacts: (directMessagesContacts) => set({ directMessagesContacts }),
  addChannel : (channel) => {
    const channels = get().channels;
    set({channels:[channel, ...channels]});
  },
  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatTypes = get().selectedChatType;

    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recipient:
            selectedChatTypes === "channel"
              ? message.recipient
              : message.recipient._id,
          sender:
            selectedChatTypes === "channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    });
  },
  addChannelInChannelList : (message) => {
    const channels = get().channels;
    const data = channels.find((channel) => channel._id === message.channelId);
    const index = channels.findIndex(
      (channel) => channel._id === message.channelId
    );
    if(index !== -1 && index !== undefined) {
      channels.splice(index, 1);
      channels.unshift(data);
    }
  },

  addContactsInDMContacts: (message) => {
    const directMessagesContacts = get().directMessagesContacts;
    const currentUser = get().userInfo;
    const contact =
      message.sender._id === currentUser.id ? message.recipient : message.sender;
  
    const index = directMessagesContacts.findIndex(
      (c) => c._id === contact._id
    );
  
    if (index !== -1) {
      directMessagesContacts.splice(index, 1);
    }
  
    set({ directMessagesContacts: [contact, ...directMessagesContacts] });
  },
});
