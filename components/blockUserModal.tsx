import React, { useEffect, useRef } from "react";
import Modal from "react-modal";
import { useModalStore } from "../lib/store";
import { AnimatePresence, motion } from "framer-motion";
import useBlockUser from "./hooks/useBlockUser";
import toast from "react-hot-toast";

export default function BlockUserModal(): JSX.Element {
  Modal.setAppElement("#rootModal");
  const isBlockUserModalOpen = useModalStore(
    (state) => state.isBlockUserModalOpen
  );

  const closeBlockUserModal = useModalStore(
    (state) => state.closeBlockUserModal
  );

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
    }
  }, [isBlockUserSuccess]);

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
          <div className="flex flex-row justify-center items-center mt-5 mb-3">
            <div className="relative h-8 w-8">
              <img
                src={
                  blockUserModalData.profilePhotoURL.includes("http")
                    ? blockUserModalData.profilePhotoURL
                    : "/images/" + blockUserModalData.profilePhotoURL
                }
                className="rounded-full w-full h-full object-cover"
                alt="NoImage"
              />
            </div>
            <p className="text-base text-bell ml-2">
              {blockUserModalData.name} {blockUserModalData.lastName}
            </p>
          </div>
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
