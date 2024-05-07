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
    <div className="hidden relative md:inline-block md:ml-7 mb-4 md:mb-0 md:w-full w-5/6">
      <input
        type="text"
        className="rounded-2xl md:w-10/12 mt-6 pl-4 pt-2 pb-2 pr-2 bg-background2  border border-customBorderColor text-bell"
        placeholder="Search"
        value={activeChatsFilter}
        onChange={(e) => {
          setActiveChatsFilter(e.target.value);
        }}
      />
      <AnimatePresence mode={"wait"}>
        {activeChatsFilter.trim().length > 0 && (
          <motion.button
            key={activeChatsFilter.trim().length > 0 ? 1 : 0}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ scale: 0 }}
            onClick={() => {
              setActiveChatsFilter("");
            }}
            className="absolute top-8 xl:right-32 2xl:right-40 lg:right-28 hidden lg:block"
          >
            <FontAwesomeIcon icon={faXmark} className="text-bell" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
