import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import { useState } from "react";

export default function BlockedUser(props) {
  const { showOptionsMenu, selectedChat, activeChat } = props;
  const [modalIsOpen, setIsOpen] = useState(false);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex flex-row items-center">
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Blocked Users Modal"
      >
        <button onClick={closeModal}>close</button>
        <div>I am a modal</div>
        <form>
          <input />
          <button>tab navigation</button>
          <button>stays</button>
          <button>inside</button>
          <button>the modal</button>
        </form>
      </Modal>
    </div>
  );
}
