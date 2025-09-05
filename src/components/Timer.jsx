import { useEffect, useState } from "react";

export default function Timer({ duration, onTimeout, resetTrigger }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [resetTrigger, duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onTimeout]);

  return (
    <div className="text-right text-slate-300 mb-2">
      ⏳ {timeLeft}s
    </div>
  );
}
