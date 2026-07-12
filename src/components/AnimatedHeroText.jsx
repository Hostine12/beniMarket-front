import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const phrases = [
  {
    text: "Achetez frais",
    color: "text-orange-400",
  },
  {
    text: "Payez par Mobile Money",
    color: "text-green-500",
  },
  {
    text: "Recevez rapidement",
    color: "text-white",
  },
];

export default function AnimatedHeroText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[90px] flex items-center justify-center lg:justify-start overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
          className={`font-extrabold ${phrases[index].color}`}
        >
          {phrases[index].text}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}