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

export default function AnimatedText() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex].text;

    let timeout;

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, displayed.length + 1));
      }, 80);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => {
        setDeleting(true);
      }, 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, displayed.length - 1));
      }, 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setPhraseIndex((phraseIndex + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, phraseIndex]);

  return (
    <span
      className={`${phrases[phraseIndex].color} transition-colors duration-500`}
    >
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}