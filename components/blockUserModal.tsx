import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Modal from "react-modal";
import { useChatStore, useModalStore, useSocketStore } from "../lib/store";
import { AnimatePresence, motion } from "framer-motion";
import useBlockUser from "./hooks/useBlockUser";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function BlockUserModal(): JSX.Element {
  Modal.setAppElement("#rootModal");
  const isBlockUserModalOpen = useModalStore(
    (state) => state.isBlockUserModalOpen
  );

  const closeBlockUserModal = useModalStore(
    (state) => state.closeBlockUserModal
  );

  const joinedRooms = useSocketStore((state) => state.joinedRooms);
  const getRoomID = useChatStore((state) => state.getRoomID);
  const setJoinedRooms = useSocketStore((state) => state.setJoinedRooms);

  const sessionData = useSession();
  const session: Session = sessionData.data as Session;

  const selectedChat = useChatStore((state) => state.selectedChat);
  const reset = useChatStore((state) => state.reset);

  const blockUserModalData = useModalStore((state) => state.blockUserModalData);

  const { blockUser, isBlockUserSuccess } = useBlockUser();

  const blockUserToast = useRef(null);

  useEffect(() => {
    if (isBlockUserSuccess) {
      closeBlockUserModal();
      toast.success("User blocked successfully.", {
        position: "bottom-center",
        id: blockUserToast.current,
      });
      if (selectedChat?.id === blockUserModalData.id) {
        reset();
      }
      // Remove any joined room with the blocked user
      if (session?.user?.id) {
        const roomID = getRoomID(session?.user?.id, blockUserModalData.id);
        if (joinedRooms.includes(roomID)) {
          const updatedJoinedRooms = joinedRooms.filter(
            (joinedRoomID) => joinedRoomID !== roomID
          );
          setJoinedRooms(updatedJoinedRooms);
        }
      }
    }
  }, [
    isBlockUserSuccess,
    closeBlockUserModal,
    blockUserModalData.id,
    selectedChat?.id,
    reset,
    getRoomID,
    session?.user?.id,
    joinedRooms,
    setJoinedRooms,
  ]);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      height: "200px",
      backgroundColor: "#1A202C",
      borderRadius: "20px",
    },
    overlay: {
      backdropFilter: "blur(2px)",
      backgroundColor: "none",
    },
  };

  return (
    <Modal
      isOpen={isBlockUserModalOpen}
      onRequestClose={closeBlockUserModal}
      contentLabel="Blocked Users Modal"
      style={customStyles}
    >
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <p className="text-base font-semibold text-bell mt-2">
            Are you sure you want to block this user?
          </p>
          <div className="relative h-8 w-8">
            <Image
              src={
                blockUserModalData.profilePhotoURL.includes("http")
                  ? blockUserModalData.profilePhotoURL
                  : "/images/" + blockUserModalData.profilePhotoURL
              }
              className="rounded-full w-full h-full object-cover"
              alt="NoImage"
              fill
            />
          </div>
          <p className="text-base text-bell ml-2">
            {blockUserModalData.name} {blockUserModalData.lastName}
          </p>
          <div className="flex flex-row justify-center">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 mr-4"
              onClick={() => {
                closeBlockUserModal();
              }}
            >
              Cancel
            </button>
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.1 }}
              whileHover={{ scale: 1.1 }}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={() => {
                blockUserToast.current = toast.loading("Blocking user...", {
                  position: "bottom-center",
                });
                blockUser(blockUserModalData.id);
              }}
            >
              Block
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
}
