import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnimatedText({
  text,
  className = "",
  speed = 50,
  startDelay = 0,
  pause = 2500,
}) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let timeout;
    let index = 0;

    const startAnimation = () => {
      setDisplayed("");
      index = 0;

      const interval = setInterval(() => {
        index++;

        setDisplayed(text.slice(0, index));

        if (index === text.length) {
          clearInterval(interval);

          timeout = setTimeout(() => {
            startAnimation();
          }, pause);
        }
      }, speed);
    };

    timeout = setTimeout(startAnimation, startDelay);

    return () => {
      clearTimeout(timeout);
    };
  }, [text, speed, startDelay, pause]);

  return (
    <motion.span
      className={className}
      animate={{ opacity: [0.7, 1, 1, 0.7] }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
    >
      {displayed}
    </motion.span>
  );
}