import { motion } from "framer-motion";

export default function FloatingCard({
  children,
  className = "",
  delay = 0,
}) {
  return (
    <motion.div
      animate={{
        y: [0, -12, 0],
        rotate: [0, 1, 0, -1, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      whileHover={{
        scale: 1.05,
        y: -18,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}