import { useEffect, useRef, useState } from "react";

export function useCountUp(value: number, duration = 700, decimals = 0) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);
  const start = useRef<number | null>(null);
  const raf = useRef(0);

  useEffect(() => {
    from.current = display;
    start.current = null;
    cancelAnimationFrame(raf.current);
    const step = (t: number) => {
      if (start.current === null) start.current = t;
      const p = Math.min(1, (t - start.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = from.current + (value - from.current) * eased;
      setDisplay(+v.toFixed(decimals));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, decimals]);

  return display;
}
