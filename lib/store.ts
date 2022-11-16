import create from "zustand";

const initialSelectedChatState = {
  id: "",
  name: "",
  lastName: "",
  profilePhotoName: "",
  email: "",
};

const useChatStore = create((set) => ({
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

export { useChatStore, useNotificationStore };
