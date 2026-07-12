import { motion } from "framer-motion";

const AnimatedText = ({ text, className = "", delay = 0 }) => {
  const letters = text.split("");

  return (
    <span className={className}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + index * 0.04,
            duration: 0.25,
          }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
};

export default AnimatedText;