import { useChatStore } from "../../lib/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";

export default function ActiveChatsFilter(): JSX {
  const setActiveChatsFilter = useChatStore(
    (state) => state.setActiveChatsFilter
  );

  const activeChatsFilter = useChatStore((state) => state.activeChatsFilter);

  return (
    <div className="flex flex-row relative justify-center">
        <input
          type="text"
          className="w-11/12 rounded-2xl mt-6 pl-4 pt-2 pb-2 pr-2 bg-background2  border border-customBorderColor text-bell"
          placeholder="Search"
          value={activeChatsFilter}
          onChange={(e) => {
            setActiveChatsFilter(e.target.value);
          }}
        />

      <AnimatePresence mode="wait">

        {activeChatsFilter.trim().length > 0 && (
          <motion.div
            key={activeChatsFilter.trim().length > 0 ? 1 : 0}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ scale: 0 }}
            onClick={() => {
              setActiveChatsFilter("");
            }}
            className="self-center absolute top-9 right-12 cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="text-bell" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
