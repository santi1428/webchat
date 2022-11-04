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
  changeSelectedChat: (selectedChat) =>
    set((state) => ({ selectedChat: selectedChat })),
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
