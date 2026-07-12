import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const words = [
  {
    text: "plus proche.",
    color: "text-orange-400",
  },
  {
    text: "plus rapide.",
    color: "text-green-500",
  },
  {
    text: "plus sûr.",
    color: "text-white",
  },
];

export default function AnimatedHeroText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <span className="text-white">
        Votre marché,
      </span>

      <br />

      <div className="h-[70px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{
              duration: 0.55,
              ease: "easeInOut",
            }}
            className={`${words[index].color}`}
          >
            {words[index].text}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}