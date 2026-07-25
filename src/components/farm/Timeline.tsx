import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface Props {
  hour: number;
  onChange: (h: number) => void;
}

const fmt = (h: number) => `${h.toString().padStart(2, "0")}:00`;

export function Timeline({ hour, onChange }: Props) {
  return (
    <div className="card-soft p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-light-text" />
          <div className="font-display text-sm font-semibold">24-Hour Timeline</div>
          <span className="chip font-mono">
            <span className="blink h-1.5 w-1.5 rounded-full" style={{ background: "var(--healthy)" }} />
            {fmt(hour)}
          </span>
        </div>
        <div className="flex gap-2">
          {[0, 6, 12, 18].map((h) => (
            <button
              key={h}
              onClick={() => onChange(h)}
              className="rounded-full border border-border bg-white px-3 py-1 text-xs text-light-text hover:border-primary hover:text-primary"
            >
              {fmt(h)}
            </button>
          ))}
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={23}
        value={hour}
        onChange={(e) => onChange(+e.target.value)}
        className="timeline-range w-full"
        aria-label="Timeline hour"
      />

      <div className="mt-3 flex justify-between font-mono text-[10px] text-light-text">
        {[0, 3, 6, 9, 12, 15, 18, 21].map((h) => (
          <motion.span
            key={h}
            animate={{ color: hour === h ? "var(--forest)" : "var(--light-text)" }}
          >
            {fmt(h)}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
