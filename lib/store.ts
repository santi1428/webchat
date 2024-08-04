import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";

const initialSelectedChatState = {
  id: "",
  name: "",
  lastName: "",
  profilePhotoName: "",
  email: "",
};

const useChatStore = create((set) => ({
  getRoomID: (myID, activeChatID) => {
    let separator = ":";
    if (myID <= activeChatID) {
      return myID + separator + activeChatID;
    } else {
      return activeChatID + separator + myID;
    }
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
}));

const useNotificationStore = create((set) => ({
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

const useSocketStore = create((set) => ({
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
  timeToRefreshConnectionStatus: 5000,
  timeToRefreshTypingStatus: 1000,
}));

const useModalStore = create((set) => ({
  isBlockUserModalOpen: false,
  setIsBlockUserModalOpen: (isBlockUserModalOpen) => {
    set((state) => ({ isBlockUserModalOpen: isBlockUserModalOpen }));
  },
  blockUserModalData: {
    id: "",
    name: "",
    lastName: "",
    profilePhotoName: "",
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
