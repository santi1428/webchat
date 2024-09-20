type User = {
  id?: string;
  name?: string | null;
  lastName?: string | null;
  email?: string | null;
  password?: string | null;
  confirmPassword?: string | null;
  profilePhotoURL?: string | null;
  resetPasswordToken?: string | null;
  resetPasswordTokenExpiry?: int | null;
};

type Session = {
    expires: string;
    user: User;
}

interface BigInt {
  toJSON(): string;
}

interface Date {
  addHours(h: number): Date;
}

interface CustomFile extends File {
  filepath: string;
}


type Chat = {
    id: string;
    name: string;
    lastName: string;
    profilePhotoURL: string;
    lastMessage: {
        content: string;
        createdAt: string;
        senderId: string;
        receiverId: string;
        updatedAt: string;
        id: string;
    };
}


type ChatStore = {
  selectedChat: User;
  activeChatsFilter: string;
  changeSelectedChat: (selectedChat: User) => void;
  setActiveChatsFilter: (activeChatsFilter: string) => void;
  getRoomID: (myID: string, activeChatID: string) => string;
  reset: () => void;
};

type NotificationStore = {
  focusedSearchInput: boolean;
  focusedMessageInput: boolean;
  setFocusedSearchInput: (focusedSearchInput: boolean) => void;
  setFocusedMessageInput: (focusedMessageInput: boolean) => void;
  scrollMessagesToBottom: boolean;
  setScrollMessagesToBottom: (scrollMessagesToBottom: boolean) => void;
};

type SocketStore = {
  socket: any;
  setSocket: (socket: any) => void;
  socketConnected: boolean;
  setSocketConnected: (socketConnected: boolean) => void;
  hasJoinedRooms: boolean;
  setHasJoinedRooms: (hasJoinedRooms: boolean) => void;
  usersConnectionStatus: any[];
  setUsersConnectionStatus: (newUsersConnectionStatus: any[]) => void;
  activeUsers: any[];
  setActiveUsers: (newActiveUsers: any[]) => void;
  usersTypingStatus: any[];
  setUsersTypingStatus: (newUsersTypingStatus: any[]) => void;
  activeUsersTyping: any[];
  setActiveUsersTyping: (newActiveUsersTyping: any[]) => void;
  timeToRefreshConnectionStatus: number;
  timeToRefreshTypingStatus: number;
};

type ModalStore = {
  isBlockUserModalOpen: boolean;
  setIsBlockUserModalOpen: (isBlockUserModalOpen: boolean) => void;
  blockUserModalData: User;
  setBlockUserModalData: (blockUserModalData: User) => void;
  closeBlockUserModal: () => void;
  openBlockUserModal: () => void;
};
