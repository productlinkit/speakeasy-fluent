import { useEffect, useState } from "react";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

// Types `text` one character at a time once `start` is true.
export function useTypewriter(text, { start = true, speed = 32 } = {}) {
  const reduced = useReducedMotion();
  const chars = Array.from(text);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setCount(chars.length);
      return;
    }
    if (count >= chars.length) return;
    const id = setTimeout(() => setCount((c) => c + 1), speed);
    return () => clearTimeout(id);
  }, [start, count, chars.length, speed, reduced]);

  return { typed: chars.slice(0, count).join(""), done: count >= chars.length };
}

// Real-time 2:00 countdown that loops, used for the call timer.
export function useCountdown(seconds) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    const id = setInterval(() => setLeft((s) => (s <= 1 ? seconds : s - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds]);
  return left;
}
