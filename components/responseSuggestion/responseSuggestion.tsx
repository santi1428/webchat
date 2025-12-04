import { motion } from "framer-motion";
import { useChatStore } from "../../lib/store";

export default function ResponseSuggestion(props) {
  const message = useChatStore((state) => state.message);
  const setMessage = useChatStore((state) => state.setMessage);

  const { suggestion } = props;
  if (message !== suggestion) {
    return (
      <motion.div className="self-center">
        <button
          className="text-sm  text-bell hover:text-background hover:bg-bell rounded-full px-16 border border-dashed border-bell py-1"
          onClick={() => setMessage(suggestion)}
        >
          {suggestion}
        </button>
      </motion.div>
    );
  }

  return null;
}
