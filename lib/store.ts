import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";

const initialSelectedChatState: User = {
  id: "",
  name: "",
  lastName: "",
  profilePhotoURL: "",
  email: "",
};

const useChatStore = create<ChatStore>((set) => ({
  getRoomID: (myID: string, activeChatID: string): string => {
    let combined = myID + activeChatID;

    // Convert the string into an array of characters, sort them, and join them back
    let sortedCombined = combined.split("").sort().join("");

    return sortedCombined;
  },
  selectedChat: {
    ...initialSelectedChatState,
  },
  activeChatsFilter: "",
  changeSelectedChat: (selectedChat) =>
    set((state) => ({ selectedChat: selectedChat })),
  setActiveChatsFilter: (activeChatsFilter) =>
    set((state) => ({ activeChatsFilter: activeChatsFilter })),
  reset: () => set((state) => ({ selectedChat: initialSelectedChatState })),
  message: "",
  setMessage: (message) => set((state) => ({ message: message })),
}));

const useNotificationStore = create<NotificationStore>((set) => ({
  focusedSearchInput: false,
  focusedMessageInput: false,
  setFocusedSearchInput: (focusedSearchInput) => {
    set((state) => ({ focusedSearchInput: focusedSearchInput }));
  },
  setFocusedMessageInput: (focusedMessageInput) => {
    set((state) => ({ focusedMessageInput: focusedMessageInput }));
  },
  scrollMessagesToBottom: false,
  setScrollMessagesToBottom: (scrollMessagesToBottom) => {
    set((state) => ({ scrollMessagesToBottom: scrollMessagesToBottom }));
  },
}));

const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  setSocket: (socket) => {
    set((state) => ({ socket: socket }));
  },
  socketConnected: false,
  setSocketConnected: (socketConnected: boolean) => {
    set((state) => ({ socketConnected: socketConnected }));
  },
  hasJoinedRooms: false,
  setHasJoinedRooms: (hasJoinedRooms: boolean) => {
    set((state) => ({ hasJoinedRooms: hasJoinedRooms }));
  },
  joinedRooms: Array<string>(),
  setJoinedRooms: (newJoinedRooms) => {
    set((state) => ({ joinedRooms: newJoinedRooms }));
  },
  usersConnectionStatus: [],
  setUsersConnectionStatus: (newUsersConnectionStatus) => {
    set((state) => ({ usersConnectionStatus: newUsersConnectionStatus }));
  },
  activeUsers: [],
  setActiveUsers: (newActiveUsers) => {
    set((state) => ({ activeUsers: newActiveUsers }));
  },
  usersTypingStatus: [],
  setUsersTypingStatus: (newUsersTypingStatus) => {
    set((state) => ({ usersTypingStatus: newUsersTypingStatus }));
  },
  activeUsersTyping: [],
  setActiveUsersTyping: (newActiveUsersTyping) => {
    set((state) => ({ activeUsersTyping: newActiveUsersTyping }));
  },
  timeToRefreshConnectionStatus: 2500,
  timeToRefreshTypingStatus: 1000,
}));

const useModalStore = create<ModalStore>((set) => ({
  isBlockUserModalOpen: false,
  setIsBlockUserModalOpen: (isBlockUserModalOpen) => {
    set((state) => ({ isBlockUserModalOpen: isBlockUserModalOpen }));
  },
  blockUserModalData: {
    id: "",
    name: "",
    lastName: "",
    profilePhotoURL: "",
    email: "",
  },
  setBlockUserModalData: (blockUserModalData) => {
    set((state) => ({ blockUserModalData: blockUserModalData }));
  },
  closeBlockUserModal: () => {
    set((state) => ({ isBlockUserModalOpen: false }));
  },
  openBlockUserModal: () => {
    set((state) => ({ isBlockUserModalOpen: true }));
  },
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("ChatStore", useChatStore);
  mountStoreDevtool("NotificationStore", useNotificationStore);
  mountStoreDevtool("SocketStore", useSocketStore);
}

export { useChatStore, useNotificationStore, useSocketStore, useModalStore };
