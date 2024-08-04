import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { useModalStore } from "../../../lib/store";

export default function BlockUser(props) {
  const { showOptionsMenu, selectedChat, activeChat } = props;

  console.log("activeChat", activeChat);

  const openBlockUserModal = useModalStore((state) => state.openBlockUserModal);
  const setBlockUserModalData = useModalStore(
    (state) => state.setBlockUserModalData
  );

  return (
    <div
      className="relative flex flex-row items-center w-full"
      onClick={(e) => {
        setBlockUserModalData({
          id: activeChat.id,
          name: activeChat.name,
          lastName: activeChat.lastName,
          profilePhotoName: activeChat.profilePhotoName,
        });
        openBlockUserModal();
        e.stopPropagation();
      }}
    >
      <FontAwesomeIcon
        icon={faBan}
        className={`md:py-3 pl-2 md:self-center md:pl-5
            ${
              selectedChat.id === activeChat.id
                ? "text-bell"
                : "text-background2"
            }
              `}
      />
      <p className="capitalize md:py-3 px-1 md:px-2 w-auto md:text-sm text-xs">
        Block User
      </p>
    </div>
  );
}
