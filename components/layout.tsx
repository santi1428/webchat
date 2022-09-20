import Navbar from "./navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }): JSX.Element {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background bg-cover bg-center relative">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={router.route}
          transition={{ duration: 0.2 }}
          initial="initialState"
          animate="animateState"
          exit="exitState"
          variants={{
            initialState: {
              opacity: 0,
              scale: 0,
            },
            animateState: { opacity: 1, scale: 1 },
            exitState: {
              scale: 0,
            },
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <Toaster />
    </div>
  );
}
