import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const messages = [
  {
    text: "près de chez vous.",
    color: "text-orange-400",
  },
  {
    text: "livré rapidement.",
    color: "text-green-500",
  },
  {
    text: "payé par Mobile Money.",
    color: "text-emerald-400",
  },
  {
    text: "100 % béninois.",
    color: "text-white",
  },
];

export default function AnimatedHeroText() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let typingInterval;
    let nextTimeout;

    const current = messages[messageIndex].text;
    let i = 0;

    setDisplayed("");

    typingInterval = setInterval(() => {
      i++;

      setDisplayed(current.slice(0, i));

      if (i === current.length) {
        clearInterval(typingInterval);

        nextTimeout = setTimeout(() => {
          setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 2200);
      }
    }, 55);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(nextTimeout);
    };
  }, [messageIndex]);

  return (
    <div>
      <div className="text-white">
        Votre marché,
      </div>

      <div className="h-[80px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={messageIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className={`inline-block ${messages[messageIndex].color}`}
          >
            {displayed}

            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
              }}
            >
              ▌
            </motion.span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}